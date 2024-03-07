import { TypedBody, TypedParam } from '@nestia/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { JobService } from 'src/jobs/jobs.service';
import { MailService } from 'src/mail/mail.service';
import { CreatePortalDto } from 'src/portals/dto/create-portal.dto';
import { RejectProposalDto } from 'src/prizes/dto/reject-proposal.dto';
import { UsersService } from 'src/users/users.service';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { stringToSlug } from 'src/utils/slugify';
import { Http200Response } from 'src/utils/types/http.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePortalProposalDto } from './dto/create-portal-proposal.dto';
import {
  TestTrigger,
  UpdatePlatformFeeDto,
} from './dto/update-platform-fee.dto';
import { UpdatePortalPropsalDto } from './dto/update-portal-proposal.dto';
import { PortalProposals } from './entities/portal-proposals.entity';
import { Portals } from './entities/portal.entity';
import { PortalsComments } from './entities/portals-comments.entity';
import { PortalWithBalance } from './entities/types';
import { PortalCommentService } from './services/portal-comments.service';
import { PortalProposalsService } from './services/portal-proposals.service';
import { PortalsService } from './services/portals.service';

function addMinutes(date: Date, minutes: number): Date {
  date.setMinutes(date.getMinutes() + minutes);

  return date;
}

function formatDateToUTC(date) {
  const pad = (num) => num.toString().padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // getUTCMonth() returns 0-11
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function extractMinutes(isoString: string) {
  const minutesMatch = isoString.match(/:(\d{2})/);
  return minutesMatch ? parseInt(minutesMatch[1]) : null;
}

// Example usage:
@Controller('portals')
export class PortalsController {
  constructor(
    private readonly portalProposalsService: PortalProposalsService,
    private readonly mailService: MailService,
    private readonly portalsService: PortalsService,
    private readonly blockchainService: BlockchainService,
    private readonly jobService: JobService,
    private readonly userService: UsersService,
    private readonly portalCommentService: PortalCommentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/clear_cache')
  async clearCache(): Promise<Http200Response> {
    await this.cacheManager.reset();
    return {
      message: 'Cache cleared',
    };
  }

  @Post('')
  @UseGuards(AuthGuard)
  async createPortal(
    @TypedBody() createPortalDto: CreatePortalDto,
  ): Promise<Portals> {
    const portalProposal = await this.portalProposalsService.findOne(
      createPortalDto.proposal_id,
    );
    const portal = await this.portalsService.create({
      allowDonationAboveThreshold: portalProposal.allowDonationAboveThreshold,
      description: portalProposal.description,
      contract_address: createPortalDto.address,
      deadline: portalProposal.deadline,
      fundingGoal: portalProposal.fundingGoal,
      images: portalProposal.images,
      isMultiSignatureReciever: portalProposal.isMultiSignatureReciever,
      slug: portalProposal.slug,
      proposer_address: portalProposal.proposerAddress,
      tags: portalProposal.tags,
      termsAndCondition: portalProposal.termsAndCondition,
      title: portalProposal.title,
      treasurers: portalProposal.treasurers,
      user: portalProposal.user,
      sendImmediately: portalProposal.sendImmediately,
      fundingGoalWithPlatformFee: portalProposal.fundingGoalWithPlatformFee,
      updates: [],
    });
    if (!portalProposal.sendImmediately) {
      const properMinutes = extractMinutes(
        portalProposal.deadline.toISOString(),
      );
      if (!properMinutes) {
        throw new HttpException('Error in minutes', 500);
      }
      await this.jobService.registerJobForEndKickStarterCampaign(
        createPortalDto.address,
        {
          expiresAt: parseInt(
            formatDateToUTC(
              new Date(addMinutes(portalProposal.deadline, 5).toISOString()),
            ),
          ),
          hours: [portalProposal.deadline.getUTCHours()],
          minutes: [properMinutes],
          mdays: [portalProposal.deadline.getUTCDate()],
          months: [portalProposal.deadline.getUTCMonth() + 1],
          wdays: [portalProposal.deadline.getUTCDay()],
        },
      );
    }
    await this.portalProposalsService.remove(portalProposal.id);
    await this.mailService.portalDeployed(
      portalProposal.user.email,
      portalProposal.user.name,
      portalProposal.title,
    );
    await this.cacheManager.reset();

    return portal;
  }

  /**
   * The code snippet you provided is a method in the `PortalsController` class. It is a route handler
   * for the GET request to `/portals` endpoint. Here's a breakdown of what it does:
   * Gets page
   *
   * @summary Get all Portals
   *
   * @date 9/25/2023 - 4:06:45 AM
   * @async
   * @param {page=1} this is the page number of the return pending proposals
   * @param {limit=10} this is the limit of the return type of the pending proposals
   * @returns {Promise<Readonly<{data: PortalWithBalance[];hasNextPage: boolean;}>>>}
   */
  @Get('')
  async getPortals(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
    @Query('tags')
    tags?: string[],
    @Query('search')
    search?: string,
    @Query('sort')
    sort?: 'DESC' | 'ASC',
  ): Promise<
    Readonly<{
      data: PortalWithBalance[];
      hasNextPage: boolean;
    }>
  > {
    let portalWithoutBalance: {
      data: Portals[];
      hasNextPage: boolean;
    };
    const key = `portals-${page}-${limit}-${tags}-${search}-${sort}`;
    const cachePortalWithoutBalance = await this.cacheManager.get(key);
    if (cachePortalWithoutBalance) {
      portalWithoutBalance = JSON.parse(cachePortalWithoutBalance as string);
    } else {
      portalWithoutBalance = infinityPagination(
        await this.portalsService.findAllPendingWithPagination({
          page,
          limit,
          tags: tags,
          search: search,
          sort: sort,
        }),
        {
          limit,
          page,
        },
      );
      await this.cacheManager.set(
        key,
        JSON.stringify(portalWithoutBalance),
        21600000,
      );
    }
    const results = await this.blockchainService.getPortalsPublicVariables(
      portalWithoutBalance.data.map((portal) => portal.contract_address),
    );
    console.log({ results });
    let start = 0;
    let end = 4;
    const portalWithBalanceData: PortalWithBalance[] =
      portalWithoutBalance.data.map((portal) => {
        const portalResults = results.slice(start, end);
        start += 4;
        end += 4;
        return {
          ...portal,
          balance: parseInt((portalResults[0].result as bigint).toString()),
          totalFunds: parseInt((portalResults[1].result as bigint).toString()),
          totalRewards: parseInt(
            (portalResults[2].result as bigint).toString(),
          ),
          isActive: portalResults[3].result as boolean,
        } as PortalWithBalance;
      });
    return {
      data: portalWithBalanceData,
      hasNextPage: portalWithoutBalance.hasNextPage,
    };
  }

  @Get('/:id')
  async getPortal(@TypedParam('id') id: string): Promise<PortalWithBalance> {
    const portal = await this.portalsService.findOne(id);
    const results = await this.blockchainService.getPortalPublicVariables(
      portal.contract_address,
    );
    const contributors = await this.blockchainService.getPortalContributors(
      portal.contract_address,
    );

    const ContributorsWithUser = contributors.data.map(async (contributor) => {
      return {
        ...contributor,
        contributor: await this.userService.findUserByWallett(
          contributor.contributor,
        ),
      };
    });

    const resultsWithContributors = {
      data: await Promise.all(ContributorsWithUser),
    };

    return {
      ...portal,
      balance: parseInt((results[0].result as bigint).toString()),
      totalFunds: parseInt((results[1].result as bigint).toString()),
      totalRewards: parseInt((results[2].result as bigint).toString()),
      isActive: results[3].result as boolean,
      contributors: resultsWithContributors,
    };
  }

  /**
   * The function `createComment` is an asynchronous function that takes a `comment` parameter calls
   * the `create` method of the `prizeCommentService` with the given `id` and  `userAuthId` . and it updatees the prize
   *
   * @date 9/25/2023 - 5:35:35 AM
   * @security bearer
   * @async
   * @param {string} id
   * @returns {Promise<Http200Response>}
   */
  @Post('/:id/comment')
  @UseGuards(AuthGuard)
  async createComment(
    @TypedParam('id') id: string,
    @TypedBody() body: CreateCommentDto,
    @Request() req,
  ): Promise<Http200Response> {
    await this.portalCommentService.create(body.comment, req.user.userId, id);
    return {
      message: `Prize  with id ${id} has been updated with comment`,
    };
  }

  @Post('/:id/comment/reply')
  @UseGuards(AuthGuard)
  async replyToComment(
    @TypedParam('id') id: string,
    @TypedBody() body: CreateCommentDto,
    @Request() req,
  ): Promise<Http200Response> {
    await this.portalCommentService.replyToComment(
      id,
      body.comment,
      req.user.userId,
    );
    return {
      message: `Prize  with id ${id} has been updated with comment`,
    };
  }

  @Post('/:id/comment/like')
  @UseGuards(AuthGuard)
  async likeComment(
    @TypedParam('id') id: string,
    @Request() req,
  ): Promise<Http200Response> {
    await this.portalCommentService.likeComment(id, req.user.userId);
    return {
      message: `Prize  with id ${id} has been updated with comment`,
    };
  }

  @Post('/:id/comment/dislike')
  @UseGuards(AuthGuard)
  async dislikeComment(
    @TypedParam('id') id: string,
    @Request() req,
  ): Promise<Http200Response> {
    await this.portalCommentService.dislikeComment(id, req.user.userId);
    return {
      message: `Prize  with id ${id} has been updated with comment`,
    };
  }

  /**
   * The function `getComments` is an asynchronous function that takes a `comment` parameter calls
   * the `getComment` method of the `portalCommentService` with the given `id`.
   *
   * @date 9/25/2023 - 5:35:35 AM
   * @async
   * @param {string} id
   * @returns {Promise<PortalsComments[]>}
   */
  @Get('/:id/comment')
  async getComment(@TypedParam('id') id: string): Promise<PortalsComments[]> {
    return await this.portalCommentService.getCommentsByPortalId(id);
  }

  @Put('/:id/add-update')
  @UseGuards(AuthGuard)
  async addUpdate(
    @TypedParam('id') id: string,
    @TypedBody() update: string,
  ): Promise<Portals> {
    const portal = await this.portalsService.addPortalUpdate(id, update);
    await this.cacheManager.reset();
    return portal;
  }

  @Delete('/proposal/delete/:id')
  @UseGuards(AuthGuard)
  async getDeletePortalProposalById(@TypedParam('id') id: string) {
    await this.portalProposalsService.remove(id);
    await this.cacheManager.reset();
    return true;
  }

  /**
   * The code snippet you provided is a method in the `PortalsController` class. It is a route handler
   * for the GET request to `/user/{username}` endpoint. Here's a breakdown of what it does:
   * Gets page
   *
   * @summary Get all Portal of a single user
   *
   * @date 9/25/2023 - 4:06:45 AM
   * @security bearer
   * @async
   * @param {page=1} this is the page number of the return pending proposals
   * @param {limit=10} this is the limit of the return type of the pending proposals
   * @returns {Promise<Readonly<{data: PortalProposals[];hasNextPage: boolean;}>>}
   */

  @Get('/user/:username')
  @UseGuards(AuthGuard)
  async getPortalByUser(
    @Param('username') username: string,
  ): Promise<PortalWithBalance[]> {
    let portalWithoutBalance: Portals[];

    const key = `user-portals-${username}`;
    const cachePortalWithoutBalance = await this.cacheManager.get(key);
    if (cachePortalWithoutBalance) {
      portalWithoutBalance = JSON.parse(cachePortalWithoutBalance as string);
    } else {
      (portalWithoutBalance = await this.portalsService.findAllUserPortals(
        username,
      )),
        await this.cacheManager.set(
          key,
          JSON.stringify(portalWithoutBalance),
          21600000,
        );
    }
    const results = await this.blockchainService.getPortalsPublicVariables(
      portalWithoutBalance.map((portal) => portal.contract_address),
    );
    // console.log({ results });
    let start = 0;
    let end = 4;
    const portalWithBalanceData: PortalWithBalance[] = portalWithoutBalance.map(
      (portal) => {
        const portalResults = results.slice(start, end);
        start += 4;
        end += 4;
        return {
          ...portal,
          balance: parseInt((portalResults[0].result as bigint).toString()),
          totalFunds: parseInt((portalResults[1].result as bigint).toString()),
          totalRewards: parseInt(
            (portalResults[2].result as bigint).toString(),
          ),
          isActive: portalResults[3].result as boolean,
        } as PortalWithBalance;
      },
    );
    return portalWithBalanceData;
  }

  /**
   * The code snippet you provided is a method in the `PortalsController` class. It is a route handler
   * for the GET request to `/proposals` endpoint. Here's a breakdown of what it does:
   * Gets page
   *
   * @summary Get all Pending proposals
   *
   * @date 9/25/2023 - 4:06:45 AM
   * @security bearer
   * @async
   * @param {page=1} this is the page number of the return pending proposals
   * @param {limit=10} this is the limit of the return type of the pending proposals
   * @returns {Promise<Readonly<{data: PortalProposals[];hasNextPage: boolean;}>>}
   */
  @Get('/proposals')
  @UseGuards(AdminAuthGuard)
  async getPendingProposals(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
  ): Promise<
    Readonly<{
      data: PortalProposals[];
      hasNextPage: boolean;
    }>
  > {
    const isEmpty = await this.portalProposalsService.isEmpty();
    if (isEmpty) {
      return {
        data: [],
        hasNextPage: false,
      };
    }
    return infinityPagination(
      await this.portalProposalsService.findAllPendingWithPagination({
        page,
        limit,
        where: {
          isApproved: false,
          isRejected: false,
        },
      }),
      {
        page,
        limit,
      },
    );
  }
  @Get('/proposals/:id')
  async getProposalById(
    @TypedParam('id')
    id: string,
  ): Promise<PortalProposals> {
    return await this.portalProposalsService.findOne(id);
  }
  /**
   * The code snippet you provided is a method in the `PortalsController` class. It is a route handler
   * for the GET request to `/proposals/accept` endpoint. Here's a breakdown of what it does:
   * Gets page
   *
   * @summary Retrieve a list of accepted Portal proposals
   * description: Retrieve a list of accepted Portal proposals. The list supports pagination.
   * parameters
   *
   * @date 9/25/2023 - 4:06:45 AM
   * @security bearer
   * @async
   * @param {page=1} this is the page number of the return pending proposals
   * @param {limit=10} this is the limit of the return type of the pending proposals
   * @returns {Promise<Readonly<{data: PortalProposals[];hasNextPage: boolean;}>>}
   */
  @Get('/proposals/accept')
  @UseGuards(AdminAuthGuard)
  async getAcceptedProposals(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
  ): Promise<
    Readonly<{
      data: PortalProposals[];
      hasNextPage: boolean;
    }>
  > {
    const isEmpty = await this.portalProposalsService.isEmpty();
    if (isEmpty) {
      return {
        data: [],
        hasNextPage: false,
      };
    }
    return infinityPagination(
      await this.portalProposalsService.findAllPendingWithPagination({
        page,
        limit,
        where: {
          isApproved: true,
          isRejected: false,
        },
      }),
      {
        page,
        limit,
      },
    );
  }

  /**
   * The code snippet you provided is a method in the `PortalsController` class. It is a route handler
   * for the POST request to `/proposals` endpoint. Here's a breakdown of what it does:
   * @summary Create a new proposal using user auth token to know which user is calling this function and sends email to user
   * @date 9/25/2023 - 4:44:05 AM
   *
   * @async
   * @param {CreatePortalProposalDto} createPortalProposalDto
   * @security bearer
   * @returns {Promise<PrizeProposals>}
   */

  @Post('/proposals')
  @UseGuards(AuthGuard)
  async create(
    @Body() createPortalProposal: CreatePortalProposalDto,
    @Request() req,
  ): Promise<PortalProposals> {
    console.log({ createPortalProposal });
    console.log(req.user, 'user');
    const proposals = await this.portalProposalsService.create(
      createPortalProposal,
      req.user.userId,
      stringToSlug(createPortalProposal.title),
    );
    await this.mailService.proposalSent(
      proposals.user.email,
      proposals.user.name,
      proposals.title,
    );
    return proposals;
  }

  /**
   * Get all proposals  of user  by username
   * @date 9/25/2023 - 4:47:51 AM
   * @summary Get all proposals of users by username,
   * @async
   * @param {page=1} this is the page number of the return pending proposals
   * @param {limit=10} this is the limit of the return type of the pending proposals
   * @param {string} userId
   * @returns {Promise<InfinityPaginationResultType<PrizeProposals>>}
   */
  @Get('/proposals/user/:username')
  async getProposalsByUsername(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
    @TypedParam('username') username: string,
  ): Promise<InfinityPaginationResultType<PortalProposals>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.portalProposalsService.findByUserNameWithPagination(
        {
          limit,
          page,
        },
        username,
      ),
      {
        page,
        limit,
      },
    );
  }

  /**
   * Admin Reject proposal
   * @date 9/25/2023 - 5:19:58 AM
   * @summary Reject Proposal,
   * @async
   * @param {string} id
   * @security bearer
   * @param {RejectProposalDto} rejectProposalDto
   * @returns {Promise<Http200Response>}
   */
  @Post('/proposals/reject/:id')
  @UseGuards(AdminAuthGuard)
  async rejectProposal(
    @TypedParam('id') id: string,
    @TypedBody() rejectProposalDto: RejectProposalDto,
  ): Promise<Http200Response> {
    const prizeProposal = await this.portalProposalsService.reject(
      id,
      rejectProposalDto.comment,
    );
    await this.mailService.rejected(
      prizeProposal.user.email,
      prizeProposal.user.email,
      rejectProposalDto.comment,
    );
    return {
      message: `Proposal with id ${id} has been rejected`,
    };
  }

  /**
   * The function `approveProposal` is an asynchronous function that takes an `id` parameter and calls
   * the `approve` method of the `portalProposalsService` with the given `id`. and it approves the proposal
   * and sends an email of approval
   * @date 9/25/2023 - 5:35:35 AM
   * @security bearer
   * @async
   * @param {string} id
   * @returns {Promise<Http200Response>}
   */
  @Post('/proposals/accept/:id')
  @UseGuards(AdminAuthGuard)
  async approveProposal(
    @TypedParam('id') id: string,
  ): Promise<Http200Response> {
    const proposal = await this.portalProposalsService.approve(id);
    await this.mailService.approved(
      proposal.user.email,
      proposal.user.name,
      proposal.title,
    );
    return {
      message: `Proposal with id ${id} has been accepted`,
    };
  }

  /**
   * it updates the proposal
   * @date 9/25/2023 - 5:35:35 AM
   * @security bearer
   * @async
   * @param {string} id
   * @returns {Promise<Http200Response>}
   */
  @Patch('/proposals/:id')
  @UseGuards(AuthGuard)
  async updateProposal(
    @TypedParam('id') id: string,
    @Body() updateBody: UpdatePortalPropsalDto,
  ): Promise<Http200Response> {
    console.log(updateBody, 'updateBody');
    const removeRejection = {
      ...updateBody,
      isRejected: false,
    };
    await this.portalProposalsService.update(id, removeRejection);
    await this.cacheManager.reset();
    return {
      message: `Proposal with id ${id} has been updated`,
    };
  }

  /**
   * The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
   * the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
   *
   * @date 9/25/2023 - 5:35:35 AM
   * @security bearer
   * @async
   * @param {string} id
   * @returns {Promise<Http200Response>}
   */
  @Post('/proposals/platformFee/:id')
  @UseGuards(AdminAuthGuard)
  async setPlatformFee(
    @TypedParam('id') id: string,
    @TypedBody() updateFeePortalDto: UpdatePlatformFeeDto,
  ): Promise<Http200Response> {
    await this.portalProposalsService.setPlatformFee(
      id,
      updateFeePortalDto.platformFeePercentage,
    );
    return {
      message: `Proposal with id ${id} has been updated`,
    };
  }

  /**
   * The function `setPlatformFee` is an asynchronous function that takes an `id` parameter and body with platformFee and calls
   * the ``setPlatformFee method of the `portalProposalsService` with the given `id`. and it updatees the proposal
   *
   * @date 9/25/2023 - 5:35:35 AM
   * @async
   * @param {string} contractAddress
   * @returns {Promise<Http200Response>}
   */
  @Post('/trigger/:contractAddress')
  async trigger(
    @TypedParam('contractAddress') contractAddress: string,
    @TypedBody() body: TestTrigger,
  ): Promise<Http200Response> {
    const date = new Date(body.date);
    console.log(date, ' dataeee');
    console.log(date.toUTCString(), ' d ate utc');

    const properMinutes = extractMinutes(date.toISOString());
    if (!properMinutes) {
      throw new HttpException('Error in minutes', 500);
    }
    console.log({
      expiresAt: parseInt(
        formatDateToUTC(new Date(addMinutes(date, 5).toISOString())),
      ),
      hours: [date.getUTCHours()],
      minutes: [new Date(date.toISOString()).getUTCMinutes()],
      mdays: [date.getUTCDate()],
      months: [date.getUTCMonth() + 1],
      wdays: [date.getUTCDay()],
    });
    console.log({
      expiresAt: parseInt(
        formatDateToUTC(new Date(addMinutes(date, 5).toISOString())),
      ),
      hours: [date.getUTCHours()],
      minutes: [properMinutes],
      mdays: [date.getUTCDate()],
      months: [date.getUTCMonth() + 1],
      wdays: [date.getUTCDay()],
    });

    console.log({
      expiresAt: parseInt(
        formatDateToUTC(new Date(addMinutes(date, 5).toISOString())),
      ),
      hours: [date.getHours()],
      minutes: [date.getMinutes()],
      mdays: [date.getDate()],
      months: [date.getMonth() + 1],
      wdays: [date.getDay()],
    });

    await this.jobService.registerJobForEndKickStarterCampaign(
      contractAddress,
      {
        expiresAt: parseInt(
          formatDateToUTC(new Date(addMinutes(date, 5).toISOString())),
        ),
        hours: [date.getUTCHours()],
        minutes: [properMinutes],
        mdays: [date.getUTCDate()],
        months: [date.getUTCMonth() + 1],
        wdays: [date.getUTCDay()],
      },
    );
    return {
      message: `Job has been registered`,
    };
  }
}
