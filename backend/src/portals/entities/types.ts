import { PaginateQuery } from 'nestjs-paginate';
import { Portals } from './portal.entity';

export type PortalPaginateQuery = PaginateQuery & {
  tags: string[];
};
export interface PortalWithBalance extends Portals {
  balance: number;
  isActive: boolean;
  totalFunds?: number;
  totalRewards?: number;
}
