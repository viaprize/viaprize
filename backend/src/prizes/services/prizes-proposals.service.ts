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
      isApproved: false,
      isRejected: false,
    });
    return prizeProposal;
  }

  async setPlatformFee(id: string, platformFeePercentage: number) {
    const prizeProposal = await this.prizeProposalsRepository.findOneByOrFail({
      id: id,
    });

    if (!prizeProposal) {
      throw new HttpException(
        'Portal Proposal not found',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.prizeProposalsRepository.update(id, {
      platformFeePercentage: platformFeePercentage,
    });
    prizeProposal.platformFeePercentage = platformFeePercentage;
    return prizeProposal;
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
  async findByUserNameWithPagination(
    paginationOptions: IPaginationOptions<PrizeProposals>,
    username: string,
  ) {
    return this.prizeProposalsRepository.find({
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

  async findOne(id: string): Promise<PrizeProposals> {
    const prizeProposal = await this.prizeProposalsRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    if (!prizeProposal) {
      throw new Error('Prize not found with id ' + id);
    }
    return prizeProposal;
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
      isRejected: true,
    });
    prizeProposal.isApproved = false;
    prizeProposal.isRejected = true;
    console.log(comment);
    return prizeProposal;
    // await this.mailService.rejected(prizeProposal.user.email, comment);
  }

  async update(id: string, updatePrizeDto: UpdatePrizeDto) {
    await this.prizeProposalsRepository.update(id, updatePrizeDto);
    return this.findOne(id);
  }

  async isEmpty() {
    const count = await this.prizeProposalsRepository.count();
    return count === 0;
  }

  async remove(id: string) {
    await this.prizeProposalsRepository.delete({
      id,
    });
    return true;
  }
}
