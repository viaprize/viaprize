import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { PrizesService } from './prizes.service';
import { PrizeProposalsService } from './services/prizes-proposals.service';

import { TypedBody, TypedParam } from '@nestia/core';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { MailService } from 'src/mail/mail.service';
import { Http200Response } from 'src/utils/types/http.type';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AuthGuard } from '../auth/auth.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { PrizeProposals } from './entities/prize-proposals.entity';
import { Prize } from './entities/prize.entity';

interface PrizeWithBalance extends Prize {
  balance: number;
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
  ) {}

  @Post('')
  @UseGuards(AuthGuard)
  async createPrize(
    @TypedBody() createPrizeDto: CreatePrizeDto,
  ): Promise<Prize> {
    const prizeProposal = await this.prizeProposalsService.findOne(
      createPrizeDto.proposal_id,
    );
    const prize = await this.prizeService.create({
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
    });
    await this.prizeProposalsService.remove(prizeProposal.id);
    await this.mailService.prizeDeployed(
      prizeProposal.user.email,
      prizeProposal.user.name,
      prizeProposal.title,
    );
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
   * @returns {Promise<Readonly<{data: PrizeWithBalance[];hasNextPage: boolean;}>>>}
   */
  @Get('')
  async getPrizes(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
  ): Promise<Readonly<{ data: PrizeWithBalance[]; hasNextPage: boolean }>> {
    const prizeWithoutBalance = infinityPagination(
      await this.prizeService.findAllPendingWithPagination({
        page,
        limit,
      }),
      {
        limit,
        page,
      },
    );
    const prizeWithBalanceData: PrizeWithBalance[] = await Promise.all(
      prizeWithoutBalance.data.map(async (prize) => {
        const balance = await this.blockchainService.getBalanceOfAddress(
          prize.contract_address,
        );
        return {
          ...prize,
          balance: parseInt(balance.toString()),
        } as PrizeWithBalance;
      }),
    );
    return {
      data: prizeWithBalanceData as PrizeWithBalance[],
      hasNextPage: prizeWithoutBalance.hasNextPage,
    };
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
      proposals.description,
      proposals.startSubmissionDate
        ? proposals.startSubmissionDate.toDateString()
        : 'No Submission Date has been set',
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
      proposal.description,
      `Link is not implemented yet`,
    );
    return {
      message: `Proposal with id ${id} has been accepted`,
    };
  }
}
