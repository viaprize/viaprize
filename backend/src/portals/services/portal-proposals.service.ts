import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from 'src/users/users.service';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { CreatePortalProposalDto } from '../dto/create-portal-proposal.dto';
import { UpdatePortalPropsalDto } from '../dto/update-portal-proposal.dto';
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

    const portalProposal = await this.portalProposalsRepository.save({
      ...createPortalProposalDto,
      user: user,
      slug: slug,
    });
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
    });
    portalProposal.isApproved = false;
    portalProposal.isRejected = true;
    console.log(comment);
    return portalProposal;
    // await this.mailService.rejected(portalProposal.user.email, comment);
  }

  async update(id: string, updatePortalProposal: UpdatePortalPropsalDto) {
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
