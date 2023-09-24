import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfig } from 'src/config/config.type';
import { MailService } from 'src/mail/mail.service';
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
    private configService: ConfigService<AppConfig>,
    private mailService: MailService,
    private userService: UsersService,
  ) {}
  async create(createPrizeDto: CreatePrizeProposalDto, userId: string) {
    const user = await this.userService.findOneByUserId(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_ACCEPTABLE);
    }

    await this.prizeProposalsRepository.save({
      ...createPrizeDto,
      user: user,
    });
    await this.mailService.proposalSent(user.email);
  }

  async findAll() {
    return await this.prizeProposalsRepository.find();
  }

  async findAllWithPagination(paginationOptions: IPaginationOptions) {
    return this.prizeProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'],
    });
  }

  async findByUserWithPagination(
    paginationOptions: IPaginationOptions,
    userId: string,
  ) {
    return this.prizeProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: {
        user: {
          user_id: userId,
        },
      },
      relations: ['user'],
    });
  }

  async findByUser(userId: string) {
    return await this.prizeProposalsRepository.findBy({
      user: {
        user_id: userId,
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

    await this.mailService.approved(prizeProposal.user.email);
  }

  async reject(id: string, comment: string) {
    const prizeProposal = await this.findOne(id);
    if (!prizeProposal?.user) {
      throw new Error('User not found');
    }
    await this.prizeProposalsRepository.update(id, {
      isApproved: false,
    });

    await this.mailService.rejected(prizeProposal.user.email, comment);
  }

  async update(id: string, updatePrizeDto: UpdatePrizeDto) {
    await this.prizeProposalsRepository.update(id, updatePrizeDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.prizeProposalsRepository.delete(id);
  }
}
