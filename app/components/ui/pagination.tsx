import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import type { PaginationInfo } from "~/lib/pagination";
import { cn } from "~/lib/utils";

interface PaginationProps {
  pagination: PaginationInfo;
  createPageUrl: (page: number) => string;
  className?: string;
}

export function Pagination({
  pagination,
  createPageUrl,
  className,
}: PaginationProps) {
  const { currentPage, totalPages, hasPreviousPage, hasNextPage } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: number[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mt-8 flex items-center justify-center space-x-1",
        className
      )}
    >
      {/* Previous button */}
      {hasPreviousPage ? (
        <Link
          className="inline-flex items-center rounded-l-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-500 text-sm hover:bg-slate-50 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          to={createPageUrl(currentPage - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center rounded-l-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-300 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-600">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </span>
      )}

      {/* Page numbers */}
      <div className="flex">
        {visiblePages.map((page, index) => {
          if (page === -1) {
            return (
              <span
                className="inline-flex items-center border-slate-300 border-t border-b bg-white px-3 py-2 font-medium text-slate-500 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
                key={`ellipsis-${index}`}
              >
                ...
              </span>
            );
          }

          const isCurrentPage = page === currentPage;

          return isCurrentPage ? (
            <span
              aria-current="page"
              className="inline-flex items-center border-primary border-t border-b bg-primary px-3 py-2 font-medium text-sm text-white dark:border-primary dark:bg-primary"
              key={page}
            >
              {page}
            </span>
          ) : (
            <Link
              className="inline-flex items-center border-slate-300 border-t border-b bg-white px-3 py-2 font-medium text-slate-500 text-sm hover:bg-slate-50 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              key={page}
              to={createPageUrl(page)}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      {hasNextPage ? (
        <Link
          className="inline-flex items-center rounded-r-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-500 text-sm hover:bg-slate-50 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          to={createPageUrl(currentPage + 1)}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex cursor-not-allowed items-center rounded-r-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-300 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-600">
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
