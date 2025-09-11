// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem
}) => {
  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{totalItems > 0 ? indexOfFirstItem + 1 : 0}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastItem, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </span>

          <div className="ml-6 flex items-center">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-700 dark:text-gray-300 mr-2">
              Show:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
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

        {/* Enhanced pagination controls */}
        {totalPages > 1 && (
          <nav aria-label="Question list pagination" className="flex">
            <div className="flex items-center rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                onClick={() => paginate(0)}
                disabled={currentPage === 0}
                className={`relative inline-flex items-center px-2 py-1.5 border-r border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="First page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L9.586 11l4.707-4.707a1 1 0 111.414 1.414L12.414 11l4.707 4.707a1 1 0 010 1.414zM6.707 15.707a1 1 0 01-1.414 0L.586 11l4.707-4.707a1 1 0 111.414 1.414L3.414 11l4.707 4.707a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 0}
                className={`relative inline-flex items-center px-2 py-1.5 border-r border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Page number buttons - show current page and neighbors */}
              {[...Array(totalPages)].map((_, index) => {
                // Display human-friendly 1-based page numbers, but use 0-indexed for logic
                const displayPageNumber = index + 1;
                
                // Show current page and 1 neighbor on each side
                if (
                  index === 0 ||
                  index === totalPages - 1 ||
                  Math.abs(index - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={index}
                      onClick={() => paginate(index)}
                      className={`relative inline-flex items-center px-3 py-1.5 border-r border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === index
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-current={currentPage === index ? "page" : undefined}
                    >
                      {displayPageNumber}
                    </button>
                  );
                }
                
                // Add ellipsis for gaps
                if (
                  (index === 1 && currentPage > 2) ||
                  (index === totalPages - 2 && currentPage < totalPages - 3)
                ) {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-3 py-1.5 border-r border-gray-300 dark:border-gray-600 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      &hellip;
                    </span>
                  );
                }
                
                return null;
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`relative inline-flex items-center px-2 py-1.5 border-r border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Next page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => paginate(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                className={`relative inline-flex items-center px-2 py-1.5 text-sm font-medium ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                aria-label="Last page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10.414 9l-4.707 4.707a1 1 0 01-1.414-1.414L7.586 9 4.293 5.707a1 1 0 010-1.414zm10 0a1 1 0 011.414 0L20.414 9l-4.707 4.707a1 1 0 01-1.414-1.414L17.586 9 14.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
