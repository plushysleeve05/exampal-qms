// hooks/useQuestionsApi.ts
import { useState, useCallback } from 'react';
import { ExamType, ExamYear, Subject, Topic } from '../../../api/types';
import { fetchExamYears } from '../../../api/examYearsApi';
import { fetchSubjects } from '../../../api/subjectsApi';
import { fetchTopics } from '../../../api/topicsApi';
import { fetchFilteredQuestions, QuestionFilterParams } from '../../../api/questionsApi';
import { QuestionData } from '../types';
import { convertApiQuestionToQuestionData } from '../utils/questionUtils';

interface UseQuestionsApiProps {
  examType: ExamType | string | undefined;
  subject: string;
}

interface UseQuestionsApiReturn {
  years: ExamYear[];
  subjects: Subject[];
  topics: Topic[];
  isApiLoading: boolean;
  fetchMetadata: () => Promise<void>;
  fetchQuestions: (filterParams: QuestionFilterParams, 
    currentPage: number, 
    itemsPerPage: number) => Promise<{
      questions: QuestionData[];
      pagination: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
      }
    }>;
}

export const useQuestionsApi = ({ examType, subject }: UseQuestionsApiProps): UseQuestionsApiReturn => {
  const [years, setYears] = useState<ExamYear[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);

  // Fetch metadata (years, subjects, topics)
  const fetchMetadata = useCallback(async () => {
    setIsApiLoading(true);
    try {
      // Fetch exam years
      const yearsData = await fetchExamYears();
      setYears(yearsData);
      
      // Fetch subjects for the exam type
      if (examType) {
        const subjectsData = await fetchSubjects(examType as ExamType);
        setSubjects(subjectsData);
      }
      
      // Fetch topics for the current subject
      if (examType && subject) {
        const topicsData = await fetchTopics(examType as ExamType, subject);
        // Filter out duplicate topics - convert to Set and back to array
        const uniqueTopics = [...new Set(topicsData)];
        setTopics(uniqueTopics);
      }
    } catch (error) {
      console.error("Error fetching metadata from APIs:", error);
      throw error;
    } finally {
      setIsApiLoading(false);
    }
  }, [examType, subject]);

  // Fetch questions based on filters
  const fetchQuestions = useCallback(async (
    filterParams: QuestionFilterParams,
    currentPage: number,
    itemsPerPage: number
  ): Promise<{
    questions: QuestionData[]; 
    pagination: { 
      currentPage: number; 
      pageSize: number; 
      totalItems: number; 
      totalPages: number;
    }
  }> => {
    try {
      // Add pagination params
      const params = {
        ...filterParams,
        page: currentPage,
        pageSize: itemsPerPage
      };
      
      // Fetch questions from API
      const response = await fetchFilteredQuestions(params);
      
      // Convert API questions to QuestionData format
      const formattedQuestions = response.questions.map(
        (q, index) => convertApiQuestionToQuestionData(q, index + 1)
      );
      
      // Return both the questions and pagination data
      return {
        questions: formattedQuestions,
        pagination: response.pagination
      };
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  }, []);

  return {
    years,
    subjects,
    topics,
    isApiLoading,
    fetchMetadata,
    fetchQuestions
  };
};
