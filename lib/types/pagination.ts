/**
 * Generic pagination result wrapper
 */
export interface PaginationMetadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMetadata;
};
