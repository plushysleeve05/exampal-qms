import { useState, useEffect } from 'react';
import { fetchSubjects } from '../../../api/subjectsApi';
import { ExamType, Subject } from '../../../api/types';

interface UseSubjectsResult {
  beceSubjects: Subject[];
  wassceSubjects: Subject[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch subjects for both BECE and WASSCE exam types
 */
export const useSubjects = (): UseSubjectsResult => {
  const [beceSubjects, setBeceSubjects] = useState<Subject[]>([]);
  const [wassceSubjects, setWassceSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Flag to handle component unmounting
    let isActive = true;
    
    const loadSubjects = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both BECE and WASSCE subjects in parallel
        const [beceData, wassceData] = await Promise.all([
          fetchSubjects('BECE' as ExamType),
          fetchSubjects('WASSCE' as ExamType)
        ]);
        
        // Only update state if component is still mounted
        if (isActive) {
          setBeceSubjects(beceData);
          setWassceSubjects(wassceData);
          setError(null);
        }
      } catch (err) {
        // Only update error state if component is still mounted
        if (isActive) {
          setError(err instanceof Error ? err : new Error('An error occurred while fetching subjects'));
        }
      } finally {
        // Only update loading state if component is still mounted
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    // Load subjects when the component mounts
    loadSubjects();

    // Cleanup function to prevent state updates after unmounting
    return () => {
      isActive = false;
    };
  }, []);

  return {
    beceSubjects,
    wassceSubjects,
    isLoading,
    error
  };
};