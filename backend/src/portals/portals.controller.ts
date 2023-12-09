import { TypedBody, TypedParam } from '@nestia/core';
import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { MailService } from 'src/mail/mail.service';
import { CreatePortalDto } from 'src/portals/dto/create-portal.dto';
import { RejectProposalDto } from 'src/prizes/dto/reject-proposal.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { stringToSlug } from 'src/utils/slugify';
import { Http200Response } from 'src/utils/types/http.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { CreatePortalProposalDto } from './dto/create-portal-proposal.dto';
import { PortalProposals } from './entities/portal-proposals.entity';
import { Portals } from './entities/portal.entity';
import { PortalWithBalance } from './entities/types';
import { PortalProposalsService } from './services/portal-proposals.service';
import { PortalsService } from './services/portals.service';

@Controller('portals')
export class PortalsController {
  constructor(
    private readonly portalProposalsService: PortalProposalsService,
    private readonly mailService: MailService,
    private readonly portalsService: PortalsService,
    private readonly blockchainService: BlockchainService,
  ) { }

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
      sendImmediately: portalProposal.sendImmediately

    });
    await this.portalProposalsService.remove(portalProposal.id);
    await this.mailService.portalDeployed(
      portalProposal.user.email,
      portalProposal.user.name,
      portalProposal.title,
    );
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
  ): Promise<Readonly<{ data: PortalWithBalance[]; hasNextPage: boolean }>> {
    const PortalWithoutBalance = infinityPagination(
      await this.portalsService.findAllPendingWithPagination({
        page,
        limit,
      }),
      {
        limit,
        page,
      },
    );
    const PortalWithBalanceData: PortalWithBalance[] = await Promise.all(
      PortalWithoutBalance.data.map(async (Portal) => {
        const balance = await this.blockchainService.getBalanceOfAddress(
          Portal.contract_address,
        );
        return {
          ...Portal,
          balance: parseInt(balance.toString()),
        } as PortalWithBalance;
      }),
    );
    return {
      data: PortalWithBalanceData as PortalWithBalance[],
      hasNextPage: PortalWithoutBalance.hasNextPage,
    };
  }

  @Get('/:id')
  async getPortal(@TypedParam('id') id: string): Promise<PortalWithBalance> {
    const Portal = await this.portalsService.findOne(id);
    const balance = await this.blockchainService.getBalanceOfAddress(
      Portal.contract_address,
    );

    return {
      ...Portal,
      balance: parseInt(balance.toString()),
      // submission_time_blockchain: parseInt(submission_time.toString()),
      // voting_time_blockchain: parseInt(voting_time.toString()),
    };
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
    @TypedBody() createPortalProposal: CreatePortalProposalDto,
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
}
