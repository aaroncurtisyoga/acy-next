export function calculateSkipAmount(page: number, limit: number): number {
  return (Number(page) - 1) * limit;
}

export function calculateTotalPages(totalCount: number, limit: number): number {
  return Math.ceil(totalCount / limit);
}
