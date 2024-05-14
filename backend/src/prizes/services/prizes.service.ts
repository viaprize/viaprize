import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated, paginate } from 'nestjs-paginate';
import { User } from 'src/users/entities/user.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { Prize } from '../entities/prize.entity';
import { Submission } from '../entities/submission.entity';
import { PrizePaginateQuery } from '../entities/types';

type CreatPrize = {
  title: string;
  description: string;
  isAutomatic: boolean;
  startVotingDate?: Date;
  startSubmissionDate?: Date;
  proposer_address: string;
  contract_address: string;
  admins: string[];
  proficiencies: string[];
  images: string[];
  priorities: string[];
  submissionTime: number;
  votingTime: number;
  user: User;
  judges?: string[];
};

@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(Prize)
    private prizeRepository: Repository<Prize>,
  ) { }

  async findAll(query: PrizePaginateQuery): Promise<Paginated<Prize>> {
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

  getSmartContractDetails() { }

  async findOne(id: string) {
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['submissions', 'user'],
    });

    return prize;
  }

  async findAndGetByIdOnly(id: string) {
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        id
      }
    })
    return prize
  }

  async findAllPendingWithPagination(
    paginationOptions: IPaginationOptions<Prize>,
  ) {
    return this.prizeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      relations: ['user'],
      where: paginationOptions.where,
    });
  }

  async create(prizeData: CreatPrize) {
    const prize = this.prizeRepository.create(prizeData);
    return await this.prizeRepository.save(prize);
  }

  async addSubmission(submission: Submission, prizeId: string) {
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        id: prizeId,
      },
      relations: ['submissions'],
    });
    prize.submissions.push(submission);
    return await this.prizeRepository.save(prize);
  }

  remove(id: number) {
    return `This action removes a #${id} prize`;
  }
}
