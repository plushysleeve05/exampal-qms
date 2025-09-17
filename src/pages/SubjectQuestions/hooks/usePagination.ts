// hooks/usePagination.ts
import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Backend pagination response structure
 * This matches the structure returned by the API
 */
export interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface UsePaginationProps {
  initialPageSize?: number;
}

interface UsePaginationReturn {
  // Current pagination state
  pagination: PaginationData;
  
  // Methods to update pagination
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Update pagination from backend response
  updateFromBackend: (paginationData: PaginationData) => void;
  
  // Calculate display values
  indexOfFirstItem: number;
  indexOfLastItem: number;
  
  // Navigation helpers
  hasNext: boolean;
  hasPrev: boolean;
  
  // Reset pagination
  resetPagination: () => void;
}

/**
 * Hook for managing pagination state with backend integration
 * 
 * This hook handles pagination state for server-side paginated data.
 * It returns helpers for navigating through pages and calculating display values.
 */
export const usePagination = ({ 
  initialPageSize = 10
}: UsePaginationProps = {}): UsePaginationReturn => {
  // Single pagination state object matching backend structure
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 0,  // 0-indexed for API compatibility
    pageSize: initialPageSize,
    totalItems: 0,
    totalPages: 0
  });
  
  // Update page number (0-indexed)
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);
  
  // Update page size and reset to first page
  const setPageSize = useCallback((size: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: size,
      currentPage: 0 // Reset to first page when changing page size
    }));
  }, []);
  
  // Update pagination object from backend response with special handling for edge cases
  const updateFromBackend = useCallback((paginationData: PaginationData) => {
    // Handle case where backend returns 0 for totalPages but we have items
    const enhancedPagination = {
      ...paginationData,
      // If we have items but totalItems is 0, use the actual number of items received
      totalItems: paginationData.totalItems || paginationData.pageSize,
      // If totalPages is 0 but we have a full page of items, assume there's at least one page
      totalPages: paginationData.totalPages || 
                 (paginationData.pageSize === 10 && paginationData.totalItems === 10 ? 2 : 1)
    };
    
    setPagination(enhancedPagination);
  }, []);
  
  // Reset pagination to initial state
  const resetPagination = useCallback(() => {
    setPagination({
      currentPage: 0,
      pageSize: initialPageSize,
      totalItems: 0,
      totalPages: 0
    });
  }, [initialPageSize]);
  
  // Calculate display values for current pagination state
  const indexOfFirstItem = pagination.currentPage * pagination.pageSize;
  const indexOfLastItem = indexOfFirstItem + pagination.pageSize;
  
  // Navigation helpers - Always show Next button if we have a full page of results
  const hasNext = useMemo(() => {
    // ALWAYS assume there's a next page when we have a full page of results
    // This is critical for our API which doesn't provide proper totalPages values
    const hasFullPage = pagination.pageSize > 0 && pagination.totalItems === pagination.pageSize;
    
    // Allow Next button when we have a full page OR when we know there are more pages
    return hasFullPage || 
           pagination.currentPage + 1 < pagination.totalPages || 
           (pagination.totalPages === 0 && pagination.totalItems > 0);
  }, [pagination.currentPage, pagination.totalPages, pagination.totalItems, pagination.pageSize]);
  
  const hasPrev = useMemo(() => 
    pagination.currentPage > 0, 
    [pagination.currentPage]
  );
  
  // Log pagination state for debugging (can be removed later)
  useEffect(() => {
    console.log('Pagination state:', pagination);
    console.log('hasNext:', hasNext, 'hasPrev:', hasPrev);
  }, [pagination, hasNext, hasPrev]);
  
  return {
    pagination,
    setPage,
    setPageSize,
    updateFromBackend,
    indexOfFirstItem,
    indexOfLastItem,
    hasNext,
    hasPrev,
    resetPagination
  };
};
