import api from './api';
import { Topic, ExamType, ApiResponse } from './types';

/**
 * Fetch all topics for a specific subject and exam type
 * @param examType The type of exam (BECE or WASSCE)
 * @param subjectName The name of the subject (e.g., "Integrated Science")
 * @returns Promise with array of topics
 */
export const fetchTopics = async (examType: ExamType, subjectName: string): Promise<Topic[]> => {
  try {
    // Encode the subject name for URL safety
    const encodedSubjectName = encodeURIComponent(subjectName);
    // The API returns an array directly
    const response = await api.get<Topic[]>(`/setups/${examType}/subjects/${encodedSubjectName}/topics`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching topics for ${examType} ${subjectName}:`, error);
    throw error;
  }
};

/**
 * Fetch a specific topic by ID for a given subject and exam type
 * @param examType The type of exam (BECE or WASSCE)
 * @param subjectName The name of the subject (e.g., "Integrated Science")
 * @param id Topic ID
 * @returns Promise with topic details
 */
export const fetchTopicById = async (examType: ExamType, subjectName: string, id: number): Promise<Topic> => {
  try {
    const encodedSubjectName = encodeURIComponent(subjectName);
    const response = await api.get<ApiResponse<Topic>>(`/setups/${examType}/subjects/${encodedSubjectName}/topics/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching topic with id ${id} for ${examType} ${subjectName}:`, error);
    throw error;
  }
};

/**
 * Create a new topic for a specific subject
 * @param examType The type of exam (BECE or WASSCE)
 * @param subjectName The name of the subject (e.g., "Integrated Science")
 * @param topicData Data for the new topic
 * @returns Promise with created topic
 */
export const createTopic = async (
  examType: ExamType, 
  subjectName: string, 
  topicData: Partial<Topic>
): Promise<Topic> => {
  try {
    const encodedSubjectName = encodeURIComponent(subjectName);
    const response = await api.post<ApiResponse<Topic>>(
      `/setups/${examType}/subjects/${encodedSubjectName}/topics`, 
      topicData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error creating topic for ${examType} ${subjectName}:`, error);
    throw error;
  }
};

/**
 * Update an existing topic
 * @param examType The type of exam (BECE or WASSCE)
 * @param subjectName The name of the subject (e.g., "Integrated Science")
 * @param id Topic ID
 * @param topicData Updated topic data
 * @returns Promise with updated topic
 */
export const updateTopic = async (
  examType: ExamType, 
  subjectName: string, 
  id: number, 
  topicData: Partial<Topic>
): Promise<Topic> => {
  try {
    const encodedSubjectName = encodeURIComponent(subjectName);
    const response = await api.put<ApiResponse<Topic>>(
      `/setups/${examType}/subjects/${encodedSubjectName}/topics/${id}`, 
      topicData
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating topic with id ${id} for ${examType} ${subjectName}:`, error);
    throw error;
  }
};

/**
 * Delete a topic
 * @param examType The type of exam (BECE or WASSCE)
 * @param subjectName The name of the subject (e.g., "Integrated Science")
 * @param id Topic ID
 * @returns Promise with success message
 */
export const deleteTopic = async (
  examType: ExamType, 
  subjectName: string, 
  id: number
): Promise<void> => {
  try {
    const encodedSubjectName = encodeURIComponent(subjectName);
    await api.delete(`/setups/${examType}/subjects/${encodedSubjectName}/topics/${id}`);
  } catch (error) {
    console.error(`Error deleting topic with id ${id} for ${examType} ${subjectName}:`, error);
    throw error;
  }
};
