import { FindOptionsWhere } from 'typeorm';

export interface IPaginationOptions<T> {
  page: number;
  limit: number;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
}
