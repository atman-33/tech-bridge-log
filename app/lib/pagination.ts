export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationInfo;
}

export const DEFAULT_PAGE_SIZE = 20;

export function calculatePagination(
  totalItems: number,
  currentPage: number = 1,
  itemsPerPage: number = DEFAULT_PAGE_SIZE,
): PaginationInfo {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: validCurrentPage < totalPages,
    hasPreviousPage: validCurrentPage > 1,
    startIndex,
    endIndex,
  };
}

export function paginateArray<T>(
  items: T[],
  currentPage: number = 1,
  itemsPerPage: number = DEFAULT_PAGE_SIZE,
): PaginatedResult<T> {
  const pagination = calculatePagination(
    items.length,
    currentPage,
    itemsPerPage,
  );
  const paginatedItems = items.slice(
    pagination.startIndex,
    pagination.endIndex,
  );

  return {
    items: paginatedItems,
    pagination,
  };
}

export function getPageFromSearchParams(searchParams: URLSearchParams): number {
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  return Number.isNaN(page) || page < 1 ? 1 : page;
}

export function createPageUrl(
  pathname: string,
  page: number,
  existingParams?: URLSearchParams,
): string {
  const params = new URLSearchParams();

  // Copy existing search params
  if (existingParams) {
    existingParams.forEach((value, key) => {
      if (key !== "page") {
        params.set(key, value);
      }
    });
  }

  // Set page parameter
  if (page > 1) {
    params.set("page", page.toString());
  }

  const search = params.toString();
  return pathname + (search ? `?${search}` : "");
}
