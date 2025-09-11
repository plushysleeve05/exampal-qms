// hooks/usePagination.ts
import { useState, useCallback } from 'react';

interface UsePaginationProps {
  initialItemsPerPage?: number;
  initialTotalItems?: number;
  initialTotalPages?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  paginate: (pageNumber: number) => void;
  updatePaginationFromBackend: (paginationData: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }) => void;
}

export const usePagination = ({ 
  initialItemsPerPage = 10,
  initialTotalItems = 0,
  initialTotalPages = 0
}: UsePaginationProps): UsePaginationReturn => {
  // Use 0-indexed pagination for API compatibility
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  
  // Function to change page
  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);
  
  // Function to update pagination data from backend
  const updatePaginationFromBackend = useCallback((paginationData: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }) => {
    setCurrentPage(paginationData.currentPage);
    setItemsPerPage(paginationData.pageSize);
    setTotalItems(paginationData.totalItems);
    setTotalPages(paginationData.totalPages);
  }, []);
  
  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setTotalPages,
    totalItems,
    setTotalItems,
    paginate,
    updatePaginationFromBackend
  };
};
