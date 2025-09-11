// hooks/useSortQuestions.ts
import { useState, useCallback } from 'react';
import { QuestionData } from '../types';

interface UseSortQuestionsProps {
  initialQuestions: QuestionData[];
  initialKey?: keyof QuestionData;
  initialDirection?: 'asc' | 'desc';
}

interface UseSortQuestionsReturn {
  sortedQuestions: QuestionData[];
  sortConfig: {
    key: keyof QuestionData;
    direction: 'asc' | 'desc';
  };
  handleSort: (key: keyof QuestionData, direction?: 'asc' | 'desc') => void;
}

export const useSortQuestions = ({
  initialQuestions,
  initialKey = 'questionNumber',
  initialDirection = 'asc'
}: UseSortQuestionsProps): UseSortQuestionsReturn => {
  const [sortConfig, setSortConfig] = useState<{ 
    key: keyof QuestionData; 
    direction: 'asc' | 'desc' 
  }>({
    key: initialKey,
    direction: initialDirection
  });
  
  const [sortedQuestions, setSortedQuestions] = useState<QuestionData[]>(initialQuestions);
  
  // Handle sorting when column header is clicked
  const handleSort = useCallback((key: keyof QuestionData, direction?: 'asc' | 'desc') => {
    // If direction is not provided, toggle current direction
    let newDirection: 'asc' | 'desc';
    if (!direction) {
      newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      newDirection = direction;
    }

    setSortConfig({ key, direction: newDirection });

    const newSortedQuestions = [...initialQuestions].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // Special handling for difficulty levels
      if (key === 'difficultyLevel') {
        const aOrderValue = typeof aValue === 'number' ? aValue : 0;
        const bOrderValue = typeof bValue === 'number' ? bValue : 0;
        return newDirection === 'asc' ? aOrderValue - bOrderValue : bOrderValue - aOrderValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setSortedQuestions(newSortedQuestions);
  }, [initialQuestions, sortConfig]);
  
  // Initially sort the questions
  useState(() => {
    handleSort(initialKey, initialDirection);
  });
  
  return {
    sortedQuestions,
    sortConfig,
    handleSort
  };
};
