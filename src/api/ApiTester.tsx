import { useState } from 'react';
import api from './api';
import { ExamYear, Subject, Topic, ExamType } from './types';

/**
 * ApiTester component - A helper component to test API calls
 * This is for development testing purposes only and should not be used in production
 */
export const ApiTester = () => {
  const [examYears, setExamYears] = useState<ExamYear[]>([]);
  const [beceSubjects, setBeceSubjects] = useState<Subject[]>([]);
  const [wassceSubjects, setWassceSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<{
    years: boolean;
    beceSubjects: boolean;
    wassceSubjects: boolean;
    topics: boolean;
  }>({
    years: false,
    beceSubjects: false,
    wassceSubjects: false,
    topics: false
  });
  const [errors, setErrors] = useState<{
    years?: string;
    beceSubjects?: string;
    wassceSubjects?: string;
    topics?: string;
  }>({});
  
  // Test fetching exam years
  const testExamYears = async () => {
    try {
      setLoading(prev => ({ ...prev, years: true }));
      // Modify the API call to get the raw response
      const response = await api.get('/setups/examyears');
      console.log('Raw API Response:', response); // Log the raw response
      
      // Check if the data has the expected structure
      if (response.data && Array.isArray(response.data)) {
        setExamYears(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setExamYears(response.data.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setErrors(prev => ({ ...prev, years: 'Unexpected API response format' }));
      }
      
    } catch (error) {
      console.error('Failed to fetch exam years:', error);
      setErrors(prev => ({ 
        ...prev, 
        years: error instanceof Error ? error.message : 'An unknown error occurred' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, years: false }));
    }
  };
  
  // Test fetching BECE subjects
  const testBeceSubjects = async () => {
    try {
      setLoading(prev => ({ ...prev, beceSubjects: true }));
      // Use direct API call to check response format
      const response = await api.get('/setups/BECE/subjects');
      console.log('BECE Subjects Raw API Response:', response);
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        setBeceSubjects(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setBeceSubjects(response.data.data);
      } else {
        console.error('Unexpected data format for BECE subjects:', response.data);
        setErrors(prev => ({ ...prev, beceSubjects: 'Unexpected API response format' }));
      }
      
    } catch (error) {
      console.error('Failed to fetch BECE subjects:', error);
      setErrors(prev => ({ 
        ...prev, 
        beceSubjects: error instanceof Error ? error.message : 'An unknown error occurred' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, beceSubjects: false }));
    }
  };
  
  // Test fetching WASSCE subjects
  const testWassceSubjects = async () => {
    try {
      setLoading(prev => ({ ...prev, wassceSubjects: true }));
      // Use direct API call to check response format
      const response = await api.get('/setups/WASSCE/subjects');
      console.log('WASSCE Subjects Raw API Response:', response);
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        setWassceSubjects(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setWassceSubjects(response.data.data);
      } else {
        console.error('Unexpected data format for WASSCE subjects:', response.data);
        setErrors(prev => ({ ...prev, wassceSubjects: 'Unexpected API response format' }));
      }
      
    } catch (error) {
      console.error('Failed to fetch WASSCE subjects:', error);
      setErrors(prev => ({ 
        ...prev, 
        wassceSubjects: error instanceof Error ? error.message : 'An unknown error occurred' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, wassceSubjects: false }));
    }
  };
  
  // Test fetching topics for a specific subject
  const testTopics = async (examType: ExamType = 'BECE', subjectName: string = 'Integrated Science') => {
    try {
      setLoading(prev => ({ ...prev, topics: true }));
      // Use direct API call to check response format
      const encodedSubjectName = encodeURIComponent(subjectName);
      const response = await api.get(`/setups/${examType}/subjects/${encodedSubjectName}/topics`);
      console.log('Topics Raw API Response:', response);
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        setTopics(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setTopics(response.data.data);
      } else {
        console.error('Unexpected data format for topics:', response.data);
        setErrors(prev => ({ ...prev, topics: 'Unexpected API response format' }));
      }
      
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      setErrors(prev => ({ 
        ...prev, 
        topics: error instanceof Error ? error.message : 'An unknown error occurred' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, topics: false }));
    }
  };
  
  // Run all tests
  const runAllTests = () => {
    testExamYears();
    testBeceSubjects();
    testWassceSubjects();
    testTopics();
  };
  
  return {
    examYears,
    beceSubjects,
    wassceSubjects,
    topics,
    loading,
    errors,
    testExamYears,
    testBeceSubjects,
    testWassceSubjects,
    testTopics,
    runAllTests
  };
};

export default ApiTester;
