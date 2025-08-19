import { Link } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { PaginationInfo } from '~/lib/pagination';

interface PaginationProps {
  pagination: PaginationInfo;
  createPageUrl: (page: number) => string;
  className?: string;
}

export function Pagination({ pagination, createPageUrl, className }: PaginationProps) {
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
      className={cn(
        'flex items-center justify-center space-x-1 mt-8',
        className
      )}
      aria-label="Pagination"
    >
      {/* Previous button */}
      {hasPreviousPage ? (
        <Link
          to={createPageUrl(currentPage - 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-300 bg-white border border-slate-300 rounded-l-md cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-600">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </span>
      )}

      {/* Page numbers */}
      <div className="flex">
        {visiblePages.map((page, index) => {
          if (page === -1) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border-t border-b border-slate-300 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = page === currentPage;

          return isCurrentPage ? (
            <span
              key={page}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary border-t border-b border-primary dark:bg-primary dark:border-primary"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              to={createPageUrl(page)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border-t border-b border-slate-300 hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      {hasNextPage ? (
        <Link
          to={createPageUrl(currentPage + 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-r-md hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-300 bg-white border border-slate-300 rounded-r-md cursor-not-allowed dark:bg-slate-800 dark:border-slate-600 dark:text-slate-600">
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      )}
    </nav>
  );
}