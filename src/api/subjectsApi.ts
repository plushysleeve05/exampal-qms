import api from './api';
import { Subject, ExamType } from './types';

// Define the ApiResponse interface for handling API responses with data
interface ApiResponse<T> {
  data: T;
  // Add other fields if needed, such as status, message, etc.
}

/**
 * Fetch all subjects for a specific exam type (BECE or WASSCE)
 * @param examType The type of exam (BECE or WASSCE)
 * @returns Promise with array of subjects
 */
export const fetchSubjects = async (examType: ExamType): Promise<Subject[]> => {
  try {
    // The API returns an array directly
    const response = await api.get<Subject[]>(`/setups/${examType}/subjects`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${examType} subjects:`, error);
    throw error;
  }
};

/**
 * Fetch a specific subject by ID for a given exam type
 * @param examType The type of exam (BECE or WASSCE)
 * @param id Subject ID
 * @returns Promise with subject details
 */
export const fetchSubjectById = async (examType: ExamType, id: number): Promise<Subject> => {
  try {
    const response = await api.get<ApiResponse<Subject>>(`/setups/${examType}/subjects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${examType} subject with id ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new subject for a specific exam type
 * @param examType The type of exam (BECE or WASSCE)
 * @param subjectData Data for the new subject
 * @returns Promise with created subject
 */
export const createSubject = async (examType: ExamType, subjectData: Partial<Subject>): Promise<Subject> => {
  try {
    const response = await api.post<ApiResponse<Subject>>(`/setups/${examType}/subjects`, subjectData);
    return response.data.data;
  } catch (error) {
    console.error(`Error creating ${examType} subject:`, error);
    throw error;
  }
};

/**
 * Update an existing subject
 * @param examType The type of exam (BECE or WASSCE)
 * @param id Subject ID
 * @param subjectData Updated subject data
 * @returns Promise with updated subject
 */
export const updateSubject = async (examType: ExamType, id: number, subjectData: Partial<Subject>): Promise<Subject> => {
  try {
    const response = await api.put<ApiResponse<Subject>>(`/setups/${examType}/subjects/${id}`, subjectData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating ${examType} subject with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a subject
 * @param examType The type of exam (BECE or WASSCE)
 * @param id Subject ID
 * @returns Promise with success message
 */
export const deleteSubject = async (examType: ExamType, id: number): Promise<void> => {
  try {
    await api.delete(`/setups/${examType}/subjects/${id}`);
  } catch (error) {
    console.error(`Error deleting ${examType} subject with id ${id}:`, error);
    throw error;
  }
};
