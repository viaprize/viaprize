import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { PrizeProposalsService } from './services/prizes-proposals.service';

import { TypedBody, TypedParam, TypedQuery } from '@nestia/core';
import { MailService } from 'src/mail/mail.service';
import { Http200Response } from 'src/utils/types/http.type';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AuthGuard } from '../auth/auth.guard';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { RejectProposalDto } from './dto/reject-proposal.dto';
import { PrizeProposals } from './entities/prize-proposals.entity';

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

interface PrzieQuery {
  page: number;
  limit: number;
}
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
  ) {}

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
      await this.prizeProposalsService.findAllWithPagination({
        page,
        limit,
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
   * Get pending proposal of user 
   * @date 9/25/2023 - 4:47:51 AM
   * @summary Get pending proposals,
   * @async 
   * @param {PrzieQuery} [query={
        page: 1,
        limit: 10
      }]
   * @param {string} userId
   * @returns {Promise<InfinityPaginationResultType<PrizeProposals>>}
   */
  @Get('/proposals/user/:userId')
  async getProposalsBy(
    @TypedQuery()
    query: PrzieQuery = {
      page: 1,
      limit: 10,
    },
    @TypedParam('userId') userId: string,
  ): Promise<InfinityPaginationResultType<PrizeProposals>> {
    if (query.limit > 50) {
      query.limit = 50;
    }

    return infinityPagination(
      await this.prizeProposalsService.findByUserWithPagination(
        {
          ...query,
        },
        userId,
      ),
      { ...query },
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
