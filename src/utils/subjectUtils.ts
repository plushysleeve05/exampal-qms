/**
 * Utility functions for formatting and normalizing subject names
 */

/**
 * Normalizes subject name to ensure consistent capitalization for API calls
 * 
 * This function ensures proper capitalization of subject names by capitalizing
 * each word. It handles URL-formatted subjects (with hyphens) as well as
 * space-separated subject names.
 * 
 * @param subjectName The subject name to normalize
 * @returns The normalized subject name with proper capitalization
 */
export const normalizeSubjectName = (subjectName: string): string => {
  if (!subjectName) return '';
  
  // Replace hyphens with spaces
  const formattedName = subjectName.replace(/-/g, ' ');
  
  // Capitalize each word
  return formattedName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format subject name for URL usage (lowercase with hyphens)
 * 
 * @param subjectName The subject name to format for URL
 * @returns URL-friendly subject name
 */
export const formatSubjectForUrl = (subjectName: string): string => {
  if (!subjectName) return '';
  return subjectName.toLowerCase().replace(/\s+/g, '-');
};