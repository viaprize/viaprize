import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated, paginate } from 'nestjs-paginate';
import { User } from 'src/users/entities/user.entity';
import { generateId } from 'src/utils/generate-id';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {} from 'typedoc.json';
import { FindManyOptions, Repository } from 'typeorm';
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
  slug: string;
};

@Injectable()
export class PrizesService {
  constructor(
    @InjectRepository(Prize)
    private prizeRepository: Repository<Prize>,
  ) {}
  async findAll(options?: FindManyOptions<Prize> | undefined) {
    return this.prizeRepository.find(options);
  }
  async findAllByQuery(query: PrizePaginateQuery): Promise<Paginated<Prize>> {
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
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['submissions', 'user'],
    });

    return prize;
  }

  async findAndReturnBySlug(slug: string) {
    console.log({ slug });
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        slug,
      },
      relations: ['submissions', 'user'],
    });

    return prize;
  }

  async findAndGetByIdOnly(id: string) {
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        id,
      },
    });
    return prize;
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

  async addSubmission(submission: Submission, slugId: string) {
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        slug: slugId,
      },
      relations: ['submissions'],
    });
    prize.submissions.push(submission);
    return await this.prizeRepository.save(prize);
  }

  remove(id: number) {
    return `This action removes a #${id} prize`;
  }
  async checkAndReturnUniqueSlug(slug: string) {
    const prize = await this.prizeRepository.exist({
      where: {
        slug: slug,
      },
    });
    if (prize) {
      const nanoid = await generateId();
      return `${slug}-${nanoid}`;
    }
    return slug;
  }

  async updateSlug(id: string, slug: string) {
    return await this.prizeRepository.update(
      {
        id,
      },
      {
        slug,
      },
    );
  }
  async getSlugById(id: string) {
    const prize = await this.prizeRepository.findOneOrFail({
      where: {
        id,
      },
      select: ['slug'],
    });
    return prize.slug;
  }
}
