import { Injectable } from '@nestjs/common';
import { CreatePrizeProposalDto } from '../dto/create-prize-proposal.dto';
import { UpdatePrizeDto } from '../dto/update-prize-proposal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrizeProposals } from '../entities/prize-proposals.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AllConfigType, AppConfig } from 'src/config/config.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';

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
      throw new Error('User not found');
    }

    await this.prizeProposalsRepository.save({
      ...createPrizeDto,
    });
    await this.mailService.proposalSent(user.email);
  }

  async findAll() {
    return await this.prizeProposalsRepository.find();
  }

  async findByProposerAddressWithPagination(
    paginationOptions: IPaginationOptions,
    propserAddress: string,
  ) {
    return this.prizeProposalsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: {
        proposer_address: propserAddress,
      },
    });
  }

  async findByProposerAddress(propserAddress: string) {
    return await this.prizeProposalsRepository.findBy({
      proposer_address: propserAddress,
    });
  }

  async findOne(id: string) {
    return await this.prizeProposalsRepository.findOne({
      where: {
        id,
      },
    });
  }
  async approve(id: string) {
    const prizeProposal = await this.findOne(id);
    if (!prizeProposal?.proposer_address) {
      throw new Error('Proposal not found');
    }
    await this.prizeProposalsRepository.update(id, {
      isApproved: true,
    });

    const user = await this.userService.findOneByAddress(
      prizeProposal?.proposer_address,
    );
    if (!user) {
      throw new Error('User not found');
    }

    await this.mailService.approved(user?.email);
  }

  async update(id: string, updatePrizeDto: UpdatePrizeDto) {
    await this.prizeProposalsRepository.update(id, updatePrizeDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.prizeProposalsRepository.delete(id);
  }
}
