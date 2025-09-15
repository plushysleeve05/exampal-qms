// hooks/useSubjectData.ts
import { useState, useCallback, useEffect } from 'react';
import { 
  fetchExamYears, 
  fetchQuestionCounts,
  ExamType,
  TopicCount
} from '../../api';

// Interface for our subject data model
interface SubjectData {
  questionCount: {
    total: number;
    sectionA: number;
    sectionB: number;
  };
  years: number[];
  topics: TopicCount[];
}

interface UseSubjectDataProps {
  examType: ExamType | string | undefined;
  subject: string | undefined;
}

interface UseSubjectDataReturn {
  subjectData: SubjectData;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useSubjectData = ({ examType, subject }: UseSubjectDataProps): UseSubjectDataReturn => {
  const [subjectData, setSubjectData] = useState<SubjectData>({
    questionCount: { total: 0, sectionA: 0, sectionB: 0 },
    years: [],
    topics: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all data
  const fetchData = useCallback(async () => {
    if (!examType || !subject) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch data in parallel for better performance
      const [examYears, questionCounts] = await Promise.all([
        fetchExamYears(),
        fetchQuestionCounts(examType as ExamType, subject)
      ]);
      
      // Process years
      const years = examYears.map(year => parseInt(year, 10)).filter(year => !isNaN(year));
      
      // Update state with all the data
      setSubjectData({
        questionCount: questionCounts.sectionCounts,
        years,
        topics: questionCounts.topicCounts
      });
    } catch (err) {
      console.error('Error fetching subject data:', err);
      setError('Failed to load subject data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [examType, subject]);
  
  // Fetch data when component mounts or when examType/subject changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return {
    subjectData,
    isLoading,
    error,
    refreshData: fetchData
  };
};