import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { Prize } from './entities/prize.entity';
import { PrizePaginateQuery } from './entities/types';
@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(Prize)
    private prizeRepository: Repository<Prize>,
  ) {}

  async findAll(query: PrizePaginateQuery): Promise<Paginated<Prize>> {
    // let paginations: Paginated<Prize>;
    // const total_funds = query.search!['total_funds'];

    // paginations = await paginate(query, this.prizeRepository, {
    //   sortableColumns: ['created_at'],

    //   defaultSortBy: [['created_at']] as any,
    //   filterableColumns: {
    //     proficiencies: [FilterOperator.IN],
    //     priorities: [FilterOperator.IN],
    //   },
    // });

    // if (total_funds) {
    //   paginations = {
    //     links: paginations.links,
    //     meta: paginations.meta,
    //     data: {
    //       ...paginations.data,
    //     },
    //   };
    // }

    const { proficiencies, priorities, ...paginateQuery } = query;

    const queryBuilder = this.prizeRepository.createQueryBuilder('prize');

    if (proficiencies) {
      queryBuilder.andWhere('prize.proficiencies IN (:...proficiencies)', {
        proficiencies,
      });
    }

    if (priorities) {
      queryBuilder.andWhere('prize.priorities IN (:...priorities)', {
        priorities,
      });
    }

    let paginations = await paginate(paginateQuery, queryBuilder, {
      sortableColumns: ['created_at'],
      defaultSortBy: [['created_at']] as any,
    });

    const total_funds = query.search!['total_funds'];
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

  remove(id: number) {
    return `This action removes a #${id} prize`;
  }
}
