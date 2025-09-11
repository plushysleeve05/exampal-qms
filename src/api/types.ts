// Common response type for all API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// For array responses
export type ArrayResponse<T> = T[];

// ExamYear type - Based on actual API response
export type ExamYear = string;

// Subject type - Based on actual API response
export type Subject = string;

// Topic type - Based on actual API response
export type Topic = string;

// Exam types
export type ExamType = 'BECE' | 'WASSCE';
