import { IPaginationOptions } from './types/pagination-options';
import { InfinityPaginationResultType } from './types/infinity-pagination-result.type';
export declare const infinityPagination: <T>(data: T[], options: IPaginationOptions) => Readonly<{
    data: T[];
    hasNextPage: boolean;
}>;
