import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from 'src/users/users.service';
import { DEFAULT_PLATFORM_FEE } from 'src/utils/constants';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreatePortalProposalDto } from '../dto/create-portal-proposal.dto';
import { PortalProposals } from '../entities/portal-proposals.entity';

@Injectable()
export class PortalProposalsService {
  constructor(
    @InjectRepository(PortalProposals)
    private portalProposalsRepository: Repository<PortalProposals>,
    private userService: UsersService,
  ) {}
  async create(
    createPortalProposalDto: CreatePortalProposalDto,
    userId: string,
    slug: string,
  ) {
    const user = await this.userService.findOneByAuthId(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_ACCEPTABLE);
    }
    let portalProposalObject = await this.portalProposalsRepository.create({
      ...createPortalProposalDto,
      user: user,
      slug: slug,
    });
    console.log({ portalProposalObject });

    portalProposalObject.fundingGoalWithPlatformFee =
      this.createFundingGoalWithPlatformFee(
        portalProposalObject.sendImmediately,
        portalProposalObject.fundingGoal,
        portalProposalObject.platformFeePercentage,
      );

    const portalProposal = await this.portalProposalsRepository.save(
      portalProposalObject,
    );
    return portalProposal;
  }

  createFundingGoalWithPlatformFee(
    sendImmediately: boolean,
    fundingGoal: string | undefined,
    platformFeePercentage: number,
  ) {
    console.log({ sendImmediately, fundingGoal, platformFeePercentage });
    let fundingGoalWithPlatformFee = '0';
    if (!sendImmediately && fundingGoal) {
      const fundingGoalNumber = parseFloat(fundingGoal);
      fundingGoalWithPlatformFee = (
        fundingGoalNumber +
        fundingGoalNumber *
          ((platformFeePercentage
            ? platformFeePercentage
            : DEFAULT_PLATFORM_FEE) /
            100)
      ).toString();
    }
    return fundingGoalWithPlatformFee;
  }
  async updateFundingGoal() {
    await this.portalProposalsRepository.update(
      '1f71fb49-fee7-4b91-8f3e-9424ba2522d4',
      {
        fundingGoal: '1000',
      },
    );
  }
  async setPlatformFee(id: string, platformFeePercentage: number) {
    const portalProposal = await this.portalProposalsRepository.findOneByOrFail(
      {
        id: id,
      },
    );

    if (!portalProposal) {
      throw new HttpException(
        'Portal Proposal not found',
        HttpStatus.NOT_FOUND,
      );
    }
    let fundingGoalWithPlatformFee = this.createFundingGoalWithPlatformFee(
      portalProposal.sendImmediately,
      portalProposal.fundingGoal,
      platformFeePercentage,
    );
    await this.portalProposalsRepository.update(id, {
      platformFeePercentage: platformFeePercentage,
      fundingGoalWithPlatformFee: fundingGoalWithPlatformFee,
    });
    portalProposal.platformFeePercentage = platformFeePercentage;
    return portalProposal;
  }

  async findAll() {
    return await this.portalProposalsRepository.find();
  }

  async findAllWithPagination(
    paginationOptions: IPaginationOptions<PortalProposals>,
  ) {
    return this.portalProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'],
    });
  }

  async findAllPendingWithPagination(
    paginationOptions: IPaginationOptions<PortalProposals>,
  ) {
    return this.portalProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'],
      where: paginationOptions.where,
    });
  }
  async isEmpty() {
    const count = await this.portalProposalsRepository.count();
    return count === 0;
  }
  async findByUserNameWithPagination(
    paginationOptions: IPaginationOptions<PortalProposals>,
    username: string,
  ) {
    return this.portalProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: {
        user: {
          username,
        },
      },
      relations: ['user'],
    });
  }

  async findByUserWithPagination(
    paginationOptions: IPaginationOptions<PortalProposals>,
    authId: string,
  ) {
    return this.portalProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: {
        user: {
          authId: authId,
        },
      },
      relations: ['user'],
    });
  }

  async findByUserAuthId(authId: string) {
    return await this.portalProposalsRepository.findBy({
      user: {
        authId: authId,
      },
    });
  }

  async findOne(id: string): Promise<PortalProposals> {
    const portalProposal = await this.portalProposalsRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    if (!portalProposal) {
      throw new Error('Prize not found with id ' + id);
    }
    return portalProposal;
  }
  async approve(id: string) {
    const portalProposal = await this.findOne(id);
    if (!portalProposal?.user) {
      throw new Error('User not found');
    }
    await this.portalProposalsRepository.update(id, {
      isApproved: true,
    });
    portalProposal.isApproved = true;
    return portalProposal;
  }

  async reject(id: string, comment: string) {
    const portalProposal = await this.findOne(id);
    if (!portalProposal?.user) {
      throw new Error('User not found');
    }
    await this.portalProposalsRepository.update(id, {
      isApproved: false,
      isRejected: true,
      rejectionComment: comment,
    });
    portalProposal.isApproved = false;
    portalProposal.isRejected = true;
    console.log(comment);
    return portalProposal;
    // await this.mailService.rejected(portalProposal.user.email, comment);
  }

  async update(
    id: string,
    updatePortalProposal: QueryDeepPartialEntity<PortalProposals>,
  ) {
    const portalProposal = await this.findOne(id);
    const fundingGoalWithPlatformFee = this.createFundingGoalWithPlatformFee(
      portalProposal.sendImmediately,
      updatePortalProposal.fundingGoal
        ? (updatePortalProposal.fundingGoal as string)
        : portalProposal.fundingGoal,
      portalProposal.platformFeePercentage,
    );
    updatePortalProposal.fundingGoalWithPlatformFee =
      fundingGoalWithPlatformFee;
    await this.portalProposalsRepository.update(id, updatePortalProposal);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.portalProposalsRepository.delete({
      id,
    });
    return true;
  }
}
