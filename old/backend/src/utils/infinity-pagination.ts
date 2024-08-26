import { InfinityPaginationResultType } from './types/infinity-pagination-result.type';
import { IPaginationOptions } from './types/pagination-options';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions<T>,
): InfinityPaginationResultType<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
