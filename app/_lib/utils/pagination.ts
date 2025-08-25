export function calculateSkipAmount(page: number, limit: number): number {
  return (Number(page) - 1) * limit;
}

export function calculateTotalPages(totalCount: number, limit: number): number {
  return Math.ceil(totalCount / limit);
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export function createPaginatedResponse<T>(
  data: T[],
  totalCount: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const totalPages = calculateTotalPages(totalCount, limit);
  return {
    data,
    totalPages,
    currentPage: page,
    hasMore: page < totalPages,
  };
}
