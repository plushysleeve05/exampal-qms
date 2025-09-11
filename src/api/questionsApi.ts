import axios from 'axios';
import { ExamType } from './types';

// Define the Question interface based on the API response
export interface Question {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  examType: string;
  examYear: string;
  subject: string;
  examSection: string;
  questionType: string;
  topic: string;
  questionNumber: number;
  difficultyLevel: number;
  preambleUrl?: string;
  questionUrl: string;
  answers: {
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    optionE: string;
    correctAnswer: string;
  };
  solution: {
    videoUrl: string;
    imageUrl: string;
    markingSchemeUrl: string;
    teachersNoteUrl: string;
    solutionHintUrl: string;
  };
  relatedTopics: {
    topics: string[] | null;
  };
}

// Define filter parameters interface
export interface QuestionFilterParams {
  examtype: ExamType;
  subject?: string;
  examyears?: string[];
  examSections?: string[];
  topics?: string[];
  difficultyLevels?: string[];
  questionType?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
}

// Define response type to match actual API response structure
export interface QuestionsResponse {
  questions: Question[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Fetch filtered questions based on provided parameters
 * @param params Filter parameters for the questions
 * @returns Promise with questions array and pagination metadata
 */
export const fetchFilteredQuestions = async (params: QuestionFilterParams): Promise<QuestionsResponse> => {
  try {
    // Build query string from filter parameters
    const queryParams = new URLSearchParams();
    
    // Add required parameter
    queryParams.append('examtype', params.examtype);
    
    // Add optional parameters if they exist
    if (params.subject) {
      queryParams.append('subject', params.subject);
    }
    
    if (params.examyears && params.examyears.length > 0) {
      queryParams.append('examyears', params.examyears.join(','));
    }
    
    if (params.examSections && params.examSections.length > 0) {
      queryParams.append('examSections', params.examSections.join(','));
    }
    
    if (params.topics && params.topics.length > 0) {
      queryParams.append('topics', params.topics.join(','));
    }
    
    if (params.difficultyLevels && params.difficultyLevels.length > 0) {
      queryParams.append('difficultyLevels', params.difficultyLevels.join(','));
    }
    
    if (params.questionType) {
      queryParams.append('questionType', params.questionType);
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    // Get auth token if available
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    // Use the direct URL instead of the API instance's baseURL
    const response = await axios.get<QuestionsResponse>(
      `https://trbc396b-8082.uks1.devtunnels.ms/api/v1/questions/filtered?${queryParams.toString()}`,
      { headers }
    );
    
    // Return the entire response including pagination metadata
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered questions:', error);
    throw error;
  }
};

/**
 * Fetch a specific question by ID
 * @param id Question ID
 * @returns Promise with question details
 */
export const fetchQuestionById = async (id: number): Promise<Question> => {
  try {
    // Get auth token if available
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get<Question>(
      `https://trbc396b-8082.uks1.devtunnels.ms/api/v1/questions/${id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching question with id ${id}:`, error);
    throw error;
  }
};
