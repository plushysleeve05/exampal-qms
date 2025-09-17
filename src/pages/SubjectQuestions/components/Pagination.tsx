// components/Pagination.tsx
import React from 'react';
import { PaginationData } from '../hooks/usePagination';

interface PaginationProps {
  // Backend pagination data
  pagination: PaginationData;
  
  // Callbacks to change page or page size
  onPageChange: (pageNumber: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  
  // Display values
  indexOfFirstItem: number;
  indexOfLastItem: number;
  
  // Navigation helpers
  hasNext?: boolean;
  hasPrev?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination: { currentPage, pageSize, totalItems, totalPages },
  onPageChange,
  onPageSizeChange,
  indexOfFirstItem,
  indexOfLastItem,
  // If not provided, calculate these based on currentPage and totalPages
  hasNext = currentPage + 1 < totalPages,
  hasPrev = currentPage > 0
}) => {
  return (
    <div className="px-6 py-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          

          <div className="ml-6 flex items-center">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-700 dark:text-gray-300 mr-2">
              Show:
            </label>
            <select
              id="itemsPerPage"
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(parseInt(e.target.value));
              }}
              className="rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Always show pagination controls if we have any items */}
        {totalItems > 0 && (
          <nav aria-label="Question list pagination" className="flex">
            <div className="flex items-center rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
              {/* Previous Button */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrev}
                className={`relative inline-flex items-center px-3 py-2 border-r border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  !hasPrev
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>

              {/* Current page indicator
              <span className="relative inline-flex items-center px-4 py-2 border-r border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                Page {currentPage + 1}
                {totalPages > 0 && ` of ${totalPages}`}
              </span> */}

              {/* Next Button */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext && totalItems < pageSize}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                  !hasNext && totalItems < pageSize
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Next page"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Pagination;
