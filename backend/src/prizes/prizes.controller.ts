import {
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { PrizeProposalsService } from './services/prizes-proposals.service';
import { PrizesService } from './services/prizes.service';

import { TypedBody, TypedParam } from '@nestia/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { MailService } from 'src/mail/mail.service';
import { UpdatePlatformFeeDto } from 'src/portals/dto/update-platform-fee.dto';
import { UsersService } from 'src/users/users.service';
import { Http200Response } from 'src/utils/types/http.type';
import { PrizeWithBlockchainData } from 'src/utils/types/prize-blockchain.type';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AuthGuard } from '../auth/auth.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { UpdatePrizeDto } from './dto/update-prize-proposal.dto';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { Prize } from './entities/prize.entity';
import { PrizesComments } from './entities/prizes-comments.entity';
import { Submission } from './entities/submission.entity';
import { PrizeCommentService } from './services/prize-comment.service';
import { SubmissionService } from './services/submissions.service';

interface SubmissionWithBlockchainData extends Submission {
  voting_blockchain: number;
}
/**
 * The PrizeProposalsPaginationResult class is a TypeScript implementation of the
 * InfinityPaginationResultType interface, representing the result of paginated prize proposals with
 * properties for data, hasNextPage, results, total, page, and limit.
 * @date 9/25/2023 - 3:54:21 AM
 *
 * @class PrizeProposalsPaginationResult
 * @typedef {PrizeProposalsPaginationResult}
 * @implements {InfinityPaginationResultType<PrizeProposals>}
//  */
// class PrizeProposalsPaginationResult
//   implements InfinityPaginationResultType<PrizeProposals>
// {
//   data: PrizeProposals[];
//   hasNextPage: boolean;
//   results: PrizeProposals[];
//   total: number;
//   page: number;
//   limit: number;
// }

/**
 * This is the prizes controller class.
 * it handles the documentation of routes and implementation of services related to the prizes route.
 * @tag {prizes}
 */
@Controller('prizes')
export class PrizesController {
  constructor(
    private readonly prizeProposalsService: PrizeProposalsService,
    private readonly mailService: MailService,
    private readonly prizeService: PrizesService,
    private readonly blockchainService: BlockchainService,
    private readonly submissionService: SubmissionService,
    private readonly userService: UsersService,
    private readonly prizeCommentsService: PrizeCommentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/submission/:id')
  async getSubmission(@TypedParam('id') id: string): Promise<Submission> {
    return await this.submissionService.findSubmissionById(id);
  }

  @Post('')
  @UseGuards(AuthGuard)
  async createPrize(
    @TypedBody() createPrizeDto: CreatePrizeDto,
  ): Promise<Prize> {
    const prizeProposal = await this.prizeProposalsService.findOne(
      createPrizeDto.proposal_id,
    );
    const prize = await this.prizeService.create({
      submissionTime: prizeProposal.submission_time,
      votingTime: prizeProposal.voting_time,
      title: prizeProposal.title,
      admins: prizeProposal.admins,
      contract_address: createPrizeDto.address,
      description: prizeProposal.description,
      isAutomatic: prizeProposal.isAutomatic,
      priorities: prizeProposal.priorities,
      proficiencies: prizeProposal.proficiencies,
      proposer_address: prizeProposal.admins[0],
      images: prizeProposal.images,
      startSubmissionDate: prizeProposal.startSubmissionDate,
      startVotingDate: prizeProposal.startVotingDate,
      user: prizeProposal.user,

      judges: prizeProposal.judges,
    });

    await this.prizeProposalsService.remove(prizeProposal.id);
    await this.mailService.prizeDeployed(
      prizeProposal.user.email,
      prizeProposal.user.name,
      prizeProposal.title,
    );
    await this.cacheManager.reset();
    return prize;
  }

  /**
   * The code snippet you provided is a method in the `PrizesController` class. It is a route handler
   * for the GET request to `/prizes` endpoint. Here's a breakdown of what it does:
   * Gets page
   *
   * @summary Get all Prizes
   *
   * @date 9/25/2023 - 4:06:45 AM
   * @async
   * @param {page=1} this is the page number of the return pending proposals
   * @param {limit=10} this is the limit of the return type of the pending proposals
   * @returns {Promise<Readonly<{data: PrizeWithBlockchainData[];hasNextPage: boolean;}>>>}
   */
  @Get('')
  async getPrizes(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
  ): Promise<
    Readonly<{ data: PrizeWithBlockchainData[]; hasNextPage: boolean }>
  > {
    const key = `prizes-${page}-${limit}`;
    let prizeWithoutBalance: { data: Prize[]; hasNextPage: boolean };
    const cachedprizeWithoutBalance = await this.cacheManager.get(key);
    if (cachedprizeWithoutBalance) {
      prizeWithoutBalance = JSON.parse(cachedprizeWithoutBalance as string);
    } else {
      prizeWithoutBalance = infinityPagination(
        await this.prizeService.findAllPendingWithPagination({
          page,
          limit,
        }),
        {
          limit,
          page,
        },
      );
      await this.cacheManager.set(
        key,
        JSON.stringify(prizeWithoutBalance),
        300000,
      );
    }
    const results = await this.blockchainService.getPrizesPublicVariables(
      prizeWithoutBalance.data.map((prize) => prize.contract_address),
    );
    let start = 0;
    let end = 4;
    const prizeWithBalanceData = prizeWithoutBalance.data.map((prize) => {
      const portalResults = results.slice(start, end);
      start += 4;
      end += 4;
      return {
        ...prize,
        balance: parseInt((portalResults[0].result as bigint).toString()),
        distributed: portalResults[1].result as boolean,
        submission_time_blockchain: parseInt(
          (portalResults[2].result as bigint).toString(),
        ),
        voting_time_blockchain: parseInt(
          (portalResults[3].result as bigint).toString(),
        ),
      } as PrizeWithBlockchainData;
    });
    return {
      data: prizeWithBalanceData as PrizeWithBlockchainData[],
      hasNextPage: prizeWithoutBalance.hasNextPage,
    };
  }

  @Get('/:id')
  async getPrize(
    @TypedParam('id') id: string,
  ): Promise<PrizeWithBlockchainData> {
    const prize = await this.prizeService.findOne(id);
    const results = await this.blockchainService.getPrizePublicVariables(
      prize.contract_address,
    );
    // console.log({ results })
    // console.log(results, 'results');
    console.log(results[4], 'resultsssn3');
    return {
      ...prize,
      distributed: results[3].result as boolean,
      balance: parseInt((results[4].result as bigint).toString()),
      submission_time_blockchain: parseInt(
        (results[1].result as bigint).toString(),
      ),
      voting_time_blockchain: parseInt(
        (results[2].result as bigint).toString(),
      ),
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
  @Put('/proposals/:id')
  @UseGuards(AuthGuard)
  async updateProposal(
    @TypedParam('id') id: string,
    @TypedBody() updateBody: UpdatePrizeDto,
    @Request() req,
  ): Promise<Http200Response> {
    const proposalCreator = (await this.prizeProposalsService.findOne(id)).user
      .authId;

    if (proposalCreator !== req.user.userId) {
      throw new Error('You are not authorized to update this proposal');
    }
    console.log(updateBody, 'body');
    await this.prizeProposalsService.update(id, updateBody);
    await this.cacheManager.reset();

    return {
      message: `Proposal with id ${id} has been updated`,
    };
  }

  @Get('/proposals/:id')
  async getProposal(@TypedParam('id') id: string): Promise<PrizeProposals> {
    return await this.prizeProposalsService.findOne(id);
  }

  @Delete('/proposals/deleted/:id')
  @UseGuards(AuthGuard)
  async deleteProposal(
    @TypedParam('id') id: string,
    @Request() req,
  ): Promise<Http200Response> {
    const proposalCreator = (await this.prizeProposalsService.findOne(id)).user
      .authId;
    if (proposalCreator !== req.user.id) {
      throw new Error('You are not authorized to delete this proposal');
    }
    await this.prizeProposalsService.remove(id);
    return {
      message: `Proposal with id ${id} has been deleted`,
    };
  }

  @Post('/:id/submission')
  @UseGuards(AuthGuard)
  async submit(
    @TypedParam('id') id: string,
    @TypedBody() body: CreateSubmissionDto,
    @Request() req,
  ): Promise<Http200Response> {
    const user = await this.userService.findOneByAuthId(req.user.userId);
    const submission = await this.submissionService.create(body, user);
    await this.prizeService.addSubmission(submission, id);

    await this.mailService.submission(user.email);

    return {
      message: `Submission has been sent`,
    };
  }

  @Get('/:id/submission')
  async getSubmissions(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
    @TypedParam('id') id: string,
  ): Promise<
    Readonly<{
      data: SubmissionWithBlockchainData[];
      hasNextPage: boolean;
    }>
  > {
    const prize = await this.prizeService.findOne(id);
    const submissions = await infinityPagination(
      await this.submissionService.findAllWithPagination({
        limit,
        page,
        where: {
          prize: {
            id: id,
          },
        },
      }),
      {
        limit,
        page,
      },
    );
    const finalSubmissions = await Promise.all(
      submissions.data.map(async (value) => {
        const votes = await this.blockchainService.getSubmissionVotes(
          prize.contract_address,
          value.submissionHash,
        );
        return {
          ...value,
          voting_blockchain: parseInt(votes.toString()),
        } as SubmissionWithBlockchainData;
      }),
    );

    return {
      data: finalSubmissions,
      hasNextPage: submissions.hasNextPage,
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
    await this.prizeCommentsService.create(body.comment, req.user.userId, id);
    return {
      message: `Prize  with id ${id} has been updated with comment`,
    };
  }

  /**
   * The function `getComments` is an asynchronous function that takes a `comment` parameter calls
   * the `getComment` method of the `prizeCommentService` with the given `id`.
   *
   * @date 9/25/2023 - 5:35:35 AM
   * @async
   * @param {string} id
   * @returns {Promise<PrizesComments[]>}
   */
  @Get('/:id/comment')
  async getComment(@TypedParam('id') id: string): Promise<PrizesComments[]> {
    return await this.prizeCommentsService.getCommentsByPrizeId(id);
  }

  /**
   * The code snippet you provided is a method in the `PrizesController` class. It is a route handler
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
   * @returns {Promise<Readonly<{data: PrizeProposals[];hasNextPage: boolean;}>>}
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
      data: PrizeProposals[];
      hasNextPage: boolean;
    }>
  > {
    const isEmpty = await this.prizeProposalsService.isEmpty();
    if (isEmpty) {
      return {
        data: [],
        hasNextPage: false,
      };
    }
    return infinityPagination(
      await this.prizeProposalsService.findAllPendingWithPagination({
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
        where: {
          isApproved: false,
          isRejected: false,
        },
      },
    );
  }
  /**
   * The code snippet you provided is a method in the `PrizesController` class. It is a route handler
   * for the GET request to `/proposals/accept` endpoint. Here's a breakdown of what it does:
   * Gets page
   *
   * @summary Retrieve a list of accepted prize proposals
   * description: Retrieve a list of accepted prize proposals. The list supports pagination.
   * parameters
   *
   * @date 9/25/2023 - 4:06:45 AM
   * @security bearer
   * @async
   * @param {page=1} this is the page number of the return pending proposals
   * @param {limit=10} this is the limit of the return type of the pending proposals
   * @returns {Promise<Readonly<{data: PrizeProposals[];hasNextPage: boolean;}>>}
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
      data: PrizeProposals[];
      hasNextPage: boolean;
    }>
  > {
    const isEmpty = await this.prizeProposalsService.isEmpty();
    if (isEmpty) {
      return {
        data: [],
        hasNextPage: false,
      };
    }
    return infinityPagination(
      await this.prizeProposalsService.findAllPendingWithPagination({
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
   * The code snippet you provided is a method in the `PrizesController` class. It is a route handler
   * for the POST request to `/proposals` endpoint. Here's a breakdown of what it does:
   * @summary Create a new proposal using user auth token to know which user is calling this function and sends email to user
   * @date 9/25/2023 - 4:44:05 AM
   *
   * @async
   * @param {CreatePrizeProposalDto} createPrizeProposalDto
   * @security bearer
   * @returns {Promise<PrizeProposals>}
   */

  @Post('/proposals')
  @UseGuards(AuthGuard)
  async create(
    @TypedBody() createPrizeProposalDto: CreatePrizeProposalDto,
    @Request() req,
  ): Promise<PrizeProposals> {
    console.log({ createPrizeProposalDto });
    console.log(req.user, 'user');
    const proposals = await this.prizeProposalsService.create(
      createPrizeProposalDto,
      req.user.userId,
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
  ): Promise<InfinityPaginationResultType<PrizeProposals>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.prizeProposalsService.findByUserNameWithPagination(
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
    const prizeProposal = await this.prizeProposalsService.reject(
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
   * the `approve` method of the `prizeProposalsService` with the given `id`. and it approves the proposal
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
    const proposal = await this.prizeProposalsService.approve(id);
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
    @TypedBody() updateFeePlatformPrize: UpdatePlatformFeeDto,
  ): Promise<Http200Response> {
    await this.prizeProposalsService.setPlatformFee(
      id,
      updateFeePlatformPrize.platformFeePercentage,
    );
    return {
      message: `Prize proposal with id ${id} has been updated`,
    };
  }
}
