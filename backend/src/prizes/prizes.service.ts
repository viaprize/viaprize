import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { Prize } from './entities/prize.entity';
@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(Prize)
    private prizeRepository: Repository<Prize>,
  ) { }

  async findAll(query: PaginateQuery): Promise<Paginated<Prize>> {
    let paginations: Paginated<Prize>;
    const total_funds = query.search!['total_funds'];

    paginations = await paginate(query, this.prizeRepository, {
      sortableColumns: ['created_at'],

      defaultSortBy: [['created_at']] as any,
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

  getSmartContractDetails() { }

  async findOne(id: string) {
    return await this.prizeRepository.findOne({
      where: {
        id,
      },

    });
  }

  remove(id: number) {
    return `This action removes a #${id} prize`;
  }
}
