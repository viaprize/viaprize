import { TypedBody, TypedParam } from '@nestia/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { addMinutes, differenceInSeconds } from 'date-fns';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { MailService } from 'src/mail/mail.service';
import { UpdatePlatformFeeDto } from 'src/portals/dto/update-platform-fee.dto';
import { PriceService } from 'src/price/price.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SubmissionsTypePrizeV2 } from 'src/utils/constants';
import { sleep } from 'src/utils/sleep';
import { stringToSlug } from 'src/utils/slugify';
import { Http200Response } from 'src/utils/types/http.type';
import {
  IndividualPrizeWithBalance,
  PrizeWithBlockchainData,
} from 'src/utils/types/prize-blockchain.type';
import { WalletService } from 'src/wallet/wallet.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AuthGuard } from '../auth/auth.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateExtraDonationPrizeDataDto } from './dto/create-extra-donation.dto';
import { CreateExtraPrizeDto } from './dto/create-extra-prize.dto';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { FetchSubmissionDto } from './dto/submission.dto';
import { UpdatePrizeDto } from './dto/update-prize-proposal.dto';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { Prize } from './entities/prize.entity';
import { PrizesComments } from './entities/prizes-comments.entity';
import { Submission } from './entities/submission.entity';
import { ExtraDonationPrizeDataService } from './services/extra-donation-prize-data.service';
import { ExtraPrizeDataService } from './services/extra-prize.service';
import { PrizeCommentService } from './services/prize-comment.service';
import { PrizeProposalsService } from './services/prizes-proposals.service';
import { PrizesService } from './services/prizes.service';
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
    private readonly walletService: WalletService,
    private readonly extraPrizeService: ExtraPrizeDataService,
    private readonly extraPrizeDonationService: ExtraDonationPrizeDataService,
    private readonly priceService: PriceService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createPrize(
    @TypedBody() createPrizeDto: CreatePrizeDto,
  ): Promise<Prize> {
    const prizeProposal = await this.prizeProposalsService.findOne(
      createPrizeDto.proposal_id,
    );
    const slug = await this.prizeService.checkAndReturnUniqueSlug(
      stringToSlug(prizeProposal.title),
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
      slug: slug,
      judges: prizeProposal.judges,
    });

    const startSubmissionData =
      await this.blockchainService.getPrizeV2FunctionEncoded(
        'startSubmissionPeriod',
        [prize.submissionTime],
      );

    const startVotingData =
      await this.blockchainService.getPrizeV2FunctionEncoded(
        'startVotingPeriod',
        [prize.votingTime],
      );

    const endVotingData =
      await this.blockchainService.getPrizeV2FunctionEncoded(
        'endVotingPeriod',
        [],
      );
    const endSubmissionData =
      await this.blockchainService.getPrizeV2FunctionEncoded(
        'endSubmissionPeriod',
        [],
      );
    const startSubmissionTransactionData = {
      to: prize.contract_address,
      data: startSubmissionData,
      value: '0',
    };
    const endSubmissionTransactionData = {
      to: prize.contract_address,
      data: endSubmissionData,
      value: '0',
    };
    const endVotingTransactionData = {
      to: prize.contract_address,
      data: endVotingData,
      value: '0',
    };

    const startVotingTransactionData = {
      to: prize.contract_address,
      data: startVotingData,
      value: '0',
    };

    const endSubmissionDate = addMinutes(
      prize.startSubmissionDate,
      prize.submissionTime,
    );
    const endVotingDate = addMinutes(prize.startVotingDate, prize.votingTime);
    console.log(
      prize.startSubmissionDate,
      'startSubmissionDate',
      prize.startSubmissionDate.getUTCMinutes(),
      'startSubmissionDate',
    );
    const today = new Date();
    await this.walletService.scheduleTransaction(
      startSubmissionTransactionData,
      'gasless',
      differenceInSeconds(
        new Date(prize.startSubmissionDate.toISOString()),
        today,
      ),
      prize.slug,
    );

    await sleep(1000);

    await this.walletService.scheduleTransaction(
      startVotingTransactionData,
      'gasless',
      differenceInSeconds(new Date(prize.startVotingDate.toISOString()), today),
      `${prize.slug} Voting`,
    );
    await sleep(1000);

    await this.walletService.scheduleTransaction(
      endSubmissionTransactionData,
      'gasless',
      differenceInSeconds(new Date(endSubmissionDate.toISOString()), today),
      `${prize.slug} Submission End`,
    );
    await sleep(1000);

    await this.walletService.scheduleTransaction(
      endVotingTransactionData,
      'gasless',
      differenceInSeconds(new Date(endVotingDate.toISOString()), today),
      `${prize.slug} Voting End`,
    );

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
    const results = (await this.blockchainService.getPrizesV2PublicVariables(
      prizeWithoutBalance.data.map((prize) => prize.contract_address),
      [
        'totalFunds',
        'distributed',
        'getSubmissionTime',
        'getVotingTime',
        'isActive',
        'totalVotes',
        'submissionPeriod',
        'votingPeriod',
        'VERSION',
      ],
    )) as [
      [
        bigint,
        boolean,
        bigint,
        bigint,
        boolean,
        bigint,
        boolean,
        boolean,
        bigint,
      ],
    ];
    const prizeWithBalanceData = prizeWithoutBalance.data.map(
      (prize, index) => {
        return {
          ...prize,
          balance: parseInt(results[index][0].toString()),
          distributed: results[index][1],
          submission_time_blockchain: parseInt(results[index][2].toString()),
          voting_time_blockchain: parseInt(results[index][3].toString()),
          refunded:
            !results[index][4] &&
            parseInt(results[index][5].toString()) === 0 &&
            results[index][1],
          voting_period_active_blockchain: results[index][7],
          is_active_blockchain: results[index][4],
          submission_perio_active_blockchain: results[index][6],
        } as PrizeWithBlockchainData;
      },
    );
    console.log(prizeWithBalanceData, 'prizeWithBalanceData');
    const prizeWithContributorsPromises = prizeWithBalanceData.map(
      async (prize, index) => {
        const version = results[index][8];
        console.log(version, 'version');
        if (version.toString() === '2') {
          const [[allFunders]] =
            (await this.blockchainService.getPrizesV2PublicVariables(
              [prize.contract_address],
              ['getAllFunders'],
            )) as [[string[]]];
          return {
            ...prize,
            contributors: allFunders,
          };
        } else if (version.toString() === '201') {
          const [[allCryptoFunders, allFiatFunders]] =
            (await this.blockchainService.getPrizesV2PublicVariables(
              [prize.contract_address],
              ['getAllCryptoFunders', 'getAllFiatFunders'],
            )) as [string[], string[]];
          return {
            ...prize,
            contributors: [
              ...new Set([...allCryptoFunders, ...allFiatFunders]),
            ],
          };
        }
      },
    );
    const prizeWithContributors = await Promise.all(
      prizeWithContributorsPromises,
    );
    console.log(prizeWithContributors, 'prizeWithContributors');
    return {
      data: prizeWithContributors as PrizeWithBlockchainData[],
      hasNextPage: prizeWithoutBalance.hasNextPage,
    };
  }

  @Get('/:slug')
  async getPrize(
    @TypedParam('slug') slug: string,
  ): Promise<IndividualPrizeWithBalance> {
    const prize = await this.prizeService.findAndReturnBySlug(slug);
    let contributors: string[] = [];
    const [
      totalFunds,
      distributed,
      submissionTime,
      votingTime,
      disputePeriod,
      totalVotes,
      isActive,
      submissionPeriod,
      votingPeriod,
      version,
    ] = (
      await this.blockchainService.getPrizesV2PublicVariables(
        [prize.contract_address],
        [
          'totalFunds',
          'distributed',
          'getSubmissionTime',
          'getVotingTime',
          'disputePeriod',
          'totalVotes',
          'isActive',
          'submissionPeriod',
          'votingPeriod',
          'VERSION',
        ],
      )
    )[0] as [
      bigint,
      boolean,
      bigint,
      bigint,
      bigint,
      bigint,
      boolean,
      boolean,
      boolean,
      string[],
      bigint,
    ];
    if (version.toString() === '2') {
      const [[allFunders]] =
        (await this.blockchainService.getPrizesV2PublicVariables(
          [prize.contract_address],
          ['getAllFunders'],
        )) as [[string[]]];
      contributors = allFunders;
    } else if (version.toString() === '201') {
      const [[allCryptoFunders, allFiatFunders]] =
        (await this.blockchainService.getPrizesV2PublicVariables(
          [prize.contract_address],
          ['getAllCryptoFunders', 'getAllFiatFunders'],
        )) as [[string[], string[]]];

      contributors = [...new Set([...allCryptoFunders, ...allFiatFunders])];
    }
    const contributorsData = await this.blockchainService.getPortalContributors(
      prize.contract_address,
    );

    const ContributorsWithUser = contributorsData.data.map(
      async (contributor) => {
        return {
          ...contributor,
          contributor: await this.userService.findUserByWallett(
            contributor.contributor,
          ),
        };
      },
    );

    const resultsWithContributors = {
      data: await Promise.all(ContributorsWithUser),
    };

    console.log(contributors, 'contributors');
    return {
      ...prize,
      distributed: distributed,
      balance: parseInt(totalFunds.toString()),
      submission_time_blockchain: parseInt(submissionTime.toString()),
      voting_time_blockchain: parseInt(votingTime.toString()),
      dispute_period_time_blockchain: parseInt(disputePeriod.toString()),
      refunded:
        isActive && parseInt(totalVotes.toString()) === 0 && distributed,
      voting_period_active_blockchain: votingPeriod,
      is_active_blockchain: isActive,
      submission_perio_active_blockchain: submissionPeriod,
      contributors: resultsWithContributors,
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

  @Post('/:slug/submission')
  @UseGuards(AuthGuard)
  async submit(
    @TypedParam('slug') slug: string,
    @TypedBody() body: CreateSubmissionDto,
    @Request() req,
  ): Promise<Http200Response> {
    const user = await this.userService.findOneByAuthId(req.user.userId);
    const prize = await this.prizeService.findAndReturnBySlug(slug);

    const hash = await this.walletService
      .simulateAndWriteSmartContractPrizeV2(
        'addSubmission',
        [user.walletAddress as `0x${string}`, body.submissionHash],
        prize.contract_address,
        'gasless',
        '0',
      )
      .catch((e) => {
        console.log(e);
        throw new HttpException(e.message, 400);
      });
    console.log(hash, 'hash');
    console.log(prize.contract_address, 'contract_address');
    const submissionHash =
      await this.blockchainService.getSubmissionHashFromTransactionPrizeV2(
        hash,
      );
    console.log(submissionHash, 'submissionHash');
    const submission = await this.submissionService.create(
      { ...body, submissionHash: submissionHash as string },
      user,
    );
    await this.prizeService.addSubmission(submission, slug);

    await this.mailService.submission(user.email);

    return {
      message: `Submission has been sent`,
    };
  }
  @Get('/:slug/submission/:id')
  async getSubmission(
    @TypedParam('id') id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @TypedParam('slug') _: string,
  ): Promise<FetchSubmissionDto> {
    const sub = await this.submissionService.findSubmissionById(id);
    const [[submissionTime]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [sub.prize.contract_address],
        ['getSubmissionTime'],
      )) as [[bigint]];

    return {
      ...sub,
      submissionDeadline: parseInt(submissionTime.toString()),
    };
  }

  @Patch('/submission/:id')
  @UseGuards(AuthGuard)
  async EditSubmission(
    @TypedParam('id') id: string,
    @TypedBody() content: string,
    @Request() req,
  ): Promise<Http200Response> {
    const authId = req.user.userId as string;
    await this.submissionService.submissionEdit(authId, id, content);
    return {
      message: `Submission with id ${id} has been Edited`,
    };
  }

  @Post('/:slug/participate')
  @UseGuards(AuthGuard)
  async participate(
    @TypedParam('slug') slug: string,
    @Request() req,
  ): Promise<Http200Response> {
    const user = await this.userService.findOneByAuthId(req.user.userId);
    await this.prizeService.addPariticpant(slug, user);
    return {
      message: `You have been added to the prize`,
    };
  }

  @Get('/:slug/contestants')
  async getContestants(@TypedParam('slug') slug: string): Promise<User[]> {
    const res = await this.prizeService.getParcipants(slug);
    return res;
  }

  @Get('/:slug/submission')
  async getSubmissions(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
    @TypedParam('slug') slug: string,
  ): Promise<
    Readonly<{
      data: SubmissionWithBlockchainData[];
      hasNextPage: boolean;
    }>
  > {
    const prize = await this.prizeService.findAndReturnBySlug(slug);
    const submissions = await infinityPagination(
      await this.submissionService.findAllWithPagination({
        limit,
        page,
        where: {
          prize: {
            slug: slug,
          },
        },
      }),
      {
        limit,
        page,
      },
    );
    const [[submissionsFromBlockchain]] =
      (await this.blockchainService.getPrizesV2PublicVariables(
        [prize.contract_address],
        ['getAllSubmissions'],
      )) as [[SubmissionsTypePrizeV2]];
    const finalSubmissions = submissionsFromBlockchain.map(
      (blockchainSubmission) => {
        const backendSubmission = submissions.data.find(
          (submission) =>
            blockchainSubmission.submissionHash === submission.submissionHash,
        );
        if (backendSubmission) {
          return {
            ...backendSubmission,
            voting_blockchain: parseInt(
              blockchainSubmission.usdcVotes.toString(),
            ),
          } as SubmissionWithBlockchainData;
        }
      },
    );

    const removeUndefinedFinalSubmission = finalSubmissions.filter((e) => e);

    return {
      data: removeUndefinedFinalSubmission as SubmissionWithBlockchainData[],
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
    @Body() createPrizeProposalDto: CreatePrizeProposalDto,
    @Request() req,
  ): Promise<PrizeProposals> {
    console.log('hsldjflsjflsdjlk');
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

  /**
   * The function `getSlugById` is an asynchronous function that takes an id parameter returns the slug associated with id in portals
   *
   * @date 9/25/2023 - 5:35:35 AM
   * @async
   * @param {string} id
   * @returns {Promise<Pick<Prize,'slug'>>}
   */
  @Get('/slug/:id')
  async getSlugById(
    @TypedParam('id') id: string,
  ): Promise<Pick<Prize, 'slug'>> {
    const slug = await this.prizeService.getSlugById(id);
    return {
      slug,
    };
  }
  /**
   * Create extra data for a prize
   * @date 9/25/2023 - 5:35:35 AM
   * @async
   * @param {string} prizeId - The ID of the prize
   * @param {CreateExtraPrizeDto} body - The data to be used for creating extra prize
   * @returns {Promise<Http200Response>}
   * @throws {HttpException} - Throws an error if creating extra prize fails
   */
  @Post('/extra_data/:prize_id')
  async createExtraData(
    @TypedParam('prize_id') prizeId: string,
    @Body() body: CreateExtraPrizeDto,
  ): Promise<Http200Response> {
    try {
      await this.extraPrizeService.createFund(body);
      return {
        message: `Extra prize proposal with id ${prizeId} has been created`,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(`Error creating extra prize ${e.message}`, 400);
    }
  }

  /**
   * Get extra data for a prize
   * @date 9/25/2023 - 5:35:35 AM
   * @async
   * @param {string} prizeId - The ID of the prize
   * @returns {Promise<number>} - The total value of the extra prize in USD
   */
  @Get('/extra_data/:prize_id')
  async getExtraData(@TypedParam('prize_id') prizeId: string): Promise<number> {
    const extraPrize = await this.extraPrizeService.getFundByExternalId(
      prizeId,
    );
    const btcToUsd = (await this.priceService.getPrice('bitcoin'))['bitcoin']
      .usd;
    const ethToUsd = (await this.priceService.getPrice('ethereum'))['ethereum']
      .usd;
    const solToUsd = (await this.priceService.getPrice('solana'))['solana'].usd;

    return (
      extraPrize.fundsUsd +
      extraPrize.fundsInBtc * btcToUsd +
      extraPrize.fundsInEth * ethToUsd +
      extraPrize.fundsInSol * solToUsd
    );
  }
  /**
   * Create extra donation data for a prize
   * @date 9/25/2023 - 5:35:35 AM
   * @async
   * @param {string} prizeId - The ID of the prize
   * @param {CreateExtraDonationPrizeDataDto} body - The data to be used for creating extra donation
   * @returns {Promise<Http200Response>}
   * @throws {HttpException} - Throws an error if creating extra donation fails
   */
  @Post('/extra_data/donation/:prize_id')
  async createExtraDonationData(
    @TypedParam('prize_id') prizeId: string,
    @Body() body: CreateExtraDonationPrizeDataDto,
  ): Promise<Http200Response> {
    try {
      await this.extraPrizeDonationService.createDonation(body);
      return {
        message: `Extra prize proposal with id ${prizeId} has been created`,
      };
    } catch (e) {
      console.error(e);
      throw new HttpException(`Error creating extra prize ${e.message}`, 400);
    }
  }

  @Get('/address/:id')
  async address(@TypedParam('id') id: string): Promise<Http200Response> {
    const startingPeriod =
      await this.blockchainService.getPrizesV2PublicVariables(
        [id],
        ['submissionPeriod', 'getSubmissionTime', 'votingPeriod'],
      );

    console.log(startingPeriod);

    return {
      message: `Prize proposal with id ${id} has been updated`,
    };
  }
}
