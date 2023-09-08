import { Injectable } from '@nestjs/common';
import { CreatePrizeProposalDto } from './dto/create-prize-proposal.dto';
import { UpdatePrizeDto } from './dto/update-prize-proposal.dto';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
import { Prize } from './entities/prize.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(Prize)
    private prizeRepository: Repository<Prize>,
  ) {}
  create(createPrizeDto: CreatePrizeProposalDto) {
    return 'This action adds a new prize';
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Prize>> {
    let paginations: Paginated<Prize>;
    const total_funds = query.search!['total_funds'];

    paginations = await paginate(query, this.prizeRepository, {
      sortableColumns: ['created_at'],
      //@ts-ignore
      defaultSortBy: ['created_at'],
      filterableColumns: {
        proficiencies: [FilterOperator.IN],
        priorities: [FilterOperator.IN],
      },
    });

    if (total_funds) {
      paginations = {
        links: paginations.links,
        meta: paginations.meta,
        data: {
          ...paginations.data,
        },
      };
    }
    return paginations;
  }

  getSmartContractDetails() {}

  async findOne(id: string) {
    return await this.prizeRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updatePrizeDto: UpdatePrizeDto) {
    return `This action updates a #${id} prize`;
  }

  remove(id: number) {
    return `This action removes a #${id} prize`;
  }
}
