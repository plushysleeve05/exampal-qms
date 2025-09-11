import api from './api';
import { ExamYear } from './types';

/**
 * Fetch all exam years
 * @returns Promise with array of exam years
 */
export const fetchExamYears = async (): Promise<ExamYear[]> => {
  try {
    // The API returns an array directly
    const response = await api.get<ExamYear[]>('/setups/examyears');
    return response.data;
  } catch (error) {
    console.error('Error fetching exam years:', error);
    throw error;
  }
};

/**
 * Fetch a specific exam year by ID
 * @param id Exam year ID
 * @returns Promise with exam year details
 */
export const fetchExamYearById = async (id: number): Promise<ExamYear> => {
  try {
    const response = await api.get<ExamYear>(`/setups/examyears/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exam year with id ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new exam year
 * @param examYearData Data for the new exam year
 * @returns Promise with created exam year
 */
export const createExamYear = async (examYearData: { year: number; name: string }): Promise<ExamYear> => {
  try {
    const response = await api.post<ExamYear>('/setups/examyears', examYearData);
    return response.data;
  } catch (error) {
    console.error('Error creating exam year:', error);
    throw error;
  }
};

/**
 * Update an existing exam year
 * @param id Exam year ID
 * @param examYearData Updated exam year data
 * @returns Promise with updated exam year
 */
export const updateExamYear = async (id: number, examYearData: { year?: number; name?: string }): Promise<ExamYear> => {
  try {
    const response = await api.put<ExamYear>(`/setups/examyears/${id}`, examYearData);
    return response.data;
  } catch (error) {
    console.error(`Error updating exam year with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an exam year
 * @param id Exam year ID
 * @returns Promise with success message
 */
export const deleteExamYear = async (id: number): Promise<void> => {
  try {
    await api.delete(`/setups/examyears/${id}`);
  } catch (error) {
    console.error(`Error deleting exam year with id ${id}:`, error);
    throw error;
  }
};
