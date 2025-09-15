import axios from 'axios';

// Base URL for all image upload endpoints
const BASE_URL = 'https://api.exampalgh.com'; // Production URL

// Define the common parameters for all image uploads
interface BaseImageUploadParams {
  examType: string;
  examYear: string;
  subject: string;
  examSection: string;
  questionType: string;
  topic: string;
  questionNumber: number;
  imageByte: string; // base64 encoded image
}

// Answer option upload parameters extends the base with option
interface AnswerImageUploadParams extends BaseImageUploadParams {
  option: string; // "A", "B", "C", "D", or "E"
}

/**
 * Convert a File object to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:image/xxx;base64, prefix from the base64 string
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Upload a question image
 */
export const uploadQuestionImage = async (params: BaseImageUploadParams): Promise<string> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/images/question`,
      params,
      { headers }
    );
    
    return response.data.imageUrl || '';
  } catch (error) {
    console.error('Error uploading question image:', error);
    throw error;
  }
};

/**
 * Upload an answer option image
 */
export const uploadAnswerImage = async (params: AnswerImageUploadParams): Promise<string> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/images/answer`,
      params,
      { headers }
    );
    
    return response.data.imageUrl || '';
  } catch (error) {
    console.error(`Error uploading answer option ${params.option} image:`, error);
    throw error;
  }
};

/**
 * Upload a solution image
 */
export const uploadSolutionImage = async (params: BaseImageUploadParams): Promise<string> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/images/solution`,
      params,
      { headers }
    );
    
    return response.data.imageUrl || '';
  } catch (error) {
    console.error('Error uploading solution image:', error);
    throw error;
  }
};

/**
 * Upload a marking scheme image
 */
export const uploadMarkingSchemeImage = async (params: BaseImageUploadParams): Promise<string> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/images/marking-scheme`,
      params,
      { headers }
    );
    
    return response.data.imageUrl || '';
  } catch (error) {
    console.error('Error uploading marking scheme image:', error);
    throw error;
  }
};

/**
 * Upload a teachers note image
 */
export const uploadTeachersNoteImage = async (params: BaseImageUploadParams): Promise<string> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/images/teachers-note`,
      params,
      { headers }
    );
    
    return response.data.imageUrl || '';
  } catch (error) {
    console.error('Error uploading teachers note image:', error);
    throw error;
  }
};

/**
 * Upload a solution hint
 */
export const uploadSolutionHint = async (params: BaseImageUploadParams): Promise<string> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/images/solution-hint`,
      params,
      { headers }
    );
    
    return response.data.imageUrl || '';
  } catch (error) {
    console.error('Error uploading solution hint:', error);
    throw error;
  }
};

/**
 * Upload a preamble image
 */
export const uploadPreambleImage = async (params: BaseImageUploadParams): Promise<string> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.post(
      `${BASE_URL}/api/v1/images/preamble`,
      params,
      { headers }
    );
    
    return response.data.imageUrl || '';
  } catch (error) {
    console.error('Error uploading preamble image:', error);
    throw error;
  }
};