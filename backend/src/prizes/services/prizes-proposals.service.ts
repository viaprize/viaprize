import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { CreatePrizeProposalDto } from '../dto/create-prize-proposal.dto';
import { UpdatePrizeDto } from '../dto/update-prize-proposal.dto';
import { PrizeProposals } from '../entities/prize-proposals.entity';

@Injectable()
export class PrizeProposalsService {
  constructor(
    @InjectRepository(PrizeProposals)
    private prizeProposalsRepository: Repository<PrizeProposals>,
    private userService: UsersService,
  ) {}
  async create(createPrizeDto: CreatePrizeProposalDto, userId: string) {
    const user = await this.userService.findOneByAuthId(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_ACCEPTABLE);
    }

    const prizeProposal = await this.prizeProposalsRepository.save({
      ...createPrizeDto,
      user: user,
    });
    return prizeProposal;
    // await this.mailService.proposalSent(user.email);
  }

  async findAll() {
    return await this.prizeProposalsRepository.find();
  }

  async findAllWithPagination(
    paginationOptions: IPaginationOptions<PrizeProposals>,
  ) {
    return this.prizeProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'],
    });
  }

  async findAllPendingWithPagination(
    paginationOptions: IPaginationOptions<PrizeProposals>,
  ) {
    return this.prizeProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'],
      where: paginationOptions.where,
    });
  }

  async findByUserWithPagination(
    paginationOptions: IPaginationOptions<PrizeProposals>,
    authId: string,
  ) {
    return this.prizeProposalsRepository.find({
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
    return await this.prizeProposalsRepository.findBy({
      user: {
        authId: authId,
      },
    });
  }

  async findOne(id: string) {
    return await this.prizeProposalsRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
  }
  async approve(id: string) {
    const prizeProposal = await this.findOne(id);
    if (!prizeProposal?.user) {
      throw new Error('User not found');
    }
    await this.prizeProposalsRepository.update(id, {
      isApproved: true,
    });
    prizeProposal.isApproved = true;
    return prizeProposal;
  }

  async reject(id: string, comment: string) {
    const prizeProposal = await this.findOne(id);
    if (!prizeProposal?.user) {
      throw new Error('User not found');
    }
    await this.prizeProposalsRepository.update(id, {
      isApproved: false,
    });
    prizeProposal.isApproved = false;
    console.log(comment);
    return prizeProposal;
    // await this.mailService.rejected(prizeProposal.user.email, comment);
  }

  async update(id: string, updatePrizeDto: UpdatePrizeDto) {
    await this.prizeProposalsRepository.update(id, updatePrizeDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.prizeProposalsRepository.delete(id);
  }
}
