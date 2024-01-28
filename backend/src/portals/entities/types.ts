import { PaginateQuery } from 'nestjs-paginate';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Portals } from './portal.entity';
import { Contributions } from 'src/blockchain/blockchain';

export type PortalPaginateQuery = PaginateQuery & {
  tags: string[];
};

export type PortalPaginateResponse = IPaginationOptions<Portals> & {
  tags?: string[];
  search?: string;
  sort?: 'ASC' | 'DESC';
};
export interface PortalWithBalance extends Portals {
  balance: number;
  isActive: boolean;
  totalFunds?: number;
  totalRewards?: number;
  contributors?: Contributions;
}
