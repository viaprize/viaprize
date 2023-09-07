import { Injectable } from '@nestjs/common';
import { CreatePrizeProposalDto } from '../dto/create-prize-proposal.dto';
import { UpdatePrizeDto } from '../dto/update-prize-proposal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrizeProposals } from '../entities/prize-proposals.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AllConfigType, AppConfig } from 'src/config/config.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

@Injectable()
export class PrizeProposalsService {
  constructor(
    @InjectRepository(PrizeProposals)
    private prizeProposalsRepository: Repository<PrizeProposals>,
    private configService: ConfigService<AppConfig>,
  ) {}
  async create(createPrizeDto: CreatePrizeProposalDto) {
    await this.prizeProposalsRepository.save({
      ...createPrizeDto,
    });
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

  async update(id: string, updatePrizeDto: UpdatePrizeDto) {
    await this.prizeProposalsRepository.update(id, updatePrizeDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.prizeProposalsRepository.delete(id);
  }
}
