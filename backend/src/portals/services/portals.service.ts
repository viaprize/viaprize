import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paginated, paginate } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { Portals } from '../entities/portal.entity';
import { PortalPaginateQuery, PortalPaginateResponse } from '../entities/types';

@Injectable()
export class PortalsService {
  constructor(
    @InjectRepository(Portals)
    private portalRepository: Repository<Portals>,
  ) { }

  async findAll(query: PortalPaginateQuery): Promise<Paginated<Portals>> {
    const { tags, ...paginateQuery } = query;

    const queryBuilder = this.portalRepository.createQueryBuilder('portal');

    if (tags) {
      queryBuilder.andWhere('portal.proficiencies IN (:...proficiencies)', {
        tags,
      });
    }

    let paginations = await paginate(paginateQuery, queryBuilder, {
      sortableColumns: ['createdAt'],
      defaultSortBy: [['createdAt']] as any,
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

  async findOne(id: string) {
    const portal = await this.portalRepository.findOneOrFail({
      where: {
        id,
      },
      relations: ['user'],
    });

    return portal;
  }

  async findAllPendingWithPagination(
    paginationOptions: PortalPaginateResponse,
  ) {
    const queryBuilder = this.portalRepository.createQueryBuilder('portal');

    queryBuilder.skip((paginationOptions.page - 1) * paginationOptions.limit);
    queryBuilder.take(paginationOptions.limit);
    queryBuilder.leftJoinAndSelect('portal.user', 'user');

    if (paginationOptions.search) {
      queryBuilder.andWhere(
        '(portal.title ILIKE :search OR portal.description ILIKE :search)',
        { search: `%${paginationOptions.search}%` },
      );
    }

    const tags =
      typeof paginationOptions.tags === 'string'
        ? [paginationOptions.tags]
        : paginationOptions.tags;

    if (tags && tags.length > 0) {
      queryBuilder.andWhere('portal.tags ILIKE ANY(:tags)', {
        tags: tags.map((tag) => `%${tag}%`),
      });
    }

    const orderDirection = paginationOptions.sort === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy({ 'portal.createdAt': orderDirection });

    return queryBuilder.getMany();
  }

  async create(portalData: Omit<Portals, 'id' | 'createdAt' | 'updatedAt'>) {
    const portal = this.portalRepository.create(portalData);
    return await this.portalRepository.save(portal);
  }
  remove(id: number) {
    return `This action removes a #${id} portal`;
  }
}
