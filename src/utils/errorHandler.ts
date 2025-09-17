import { errorToast } from '../utils/toast';

/**
 * A utility to handle API errors in a consistent way across the application
 * 
 * @param {Error} error The error that occurred
 * @param {string} context A description of where the error occurred
 * @param {Record<string, any>} [data] Optional data related to the error
 */
export const handleApiError = (error: Error, context: string, data?: Record<string, any>) => {
  if (import.meta.env.DEV) {
    // Only log details in development
    console.error(`Error in ${context}:`, error, data);
  }
  
  // Show user-friendly error toast
  errorToast(`${context}: ${error.message}`);
};

export default handleApiError;