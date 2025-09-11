// hooks/useQuestionFilters.ts
import { useState, useCallback, useEffect } from 'react';
import { QuestionData } from '../types';

interface UseQuestionFiltersProps {
  allQuestions: QuestionData[];
}

interface UseQuestionFiltersReturn {
  selectedYears: string[];
  setSelectedYears: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSections: string[];
  setSelectedSections: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDifficulties: string[];
  setSelectedDifficulties: React.Dispatch<React.SetStateAction<string[]>>;
  selectedQuestionType: string;
  setSelectedQuestionType: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  questionCount: string;
  setQuestionCount: React.Dispatch<React.SetStateAction<string>>;
  
  // Pending filter states
  pendingYears: string[];
  setPendingYears: React.Dispatch<React.SetStateAction<string[]>>;
  pendingSections: string[];
  setPendingSections: React.Dispatch<React.SetStateAction<string[]>>;
  pendingTopics: string[];
  setPendingTopics: React.Dispatch<React.SetStateAction<string[]>>;
  pendingDifficulties: string[];
  setPendingDifficulties: React.Dispatch<React.SetStateAction<string[]>>;
  pendingQuestionType: string;
  setPendingQuestionType: React.Dispatch<React.SetStateAction<string>>;
  pendingQuestionCount: string;
  setPendingQuestionCount: React.Dispatch<React.SetStateAction<string>>;

  filteredQuestions: QuestionData[];
  effectiveFilteredQuestions: QuestionData[];
  
  toggleSelection: (value: string, currentSelections: string[], setSelections: React.Dispatch<React.SetStateAction<string[]>>) => void;
  togglePendingSelection: (value: string, currentSelections: string[], setSelections: React.Dispatch<React.SetStateAction<string[]>>) => void;
  applyFilters: () => void;
  clearPendingFilters: () => void;
  resetFilters: () => void;
}

export const useQuestionFilters = ({ allQuestions }: UseQuestionFiltersProps): UseQuestionFiltersReturn => {
  // Active filter states
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [questionCount, setQuestionCount] = useState("");
  
  // Pending filter states
  const [pendingYears, setPendingYears] = useState<string[]>([]);
  const [pendingSections, setPendingSections] = useState<string[]>([]);
  const [pendingTopics, setPendingTopics] = useState<string[]>([]);
  const [pendingDifficulties, setPendingDifficulties] = useState<string[]>([]);
  const [pendingQuestionType, setPendingQuestionType] = useState<string>("");
  const [pendingQuestionCount, setPendingQuestionCount] = useState<string>("");
  
  // Results after filtering
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionData[]>(allQuestions);
  const [effectiveFilteredQuestions, setEffectiveFilteredQuestions] = useState<QuestionData[]>(allQuestions);
  
  // Update filtered questions when allQuestions changes
  useEffect(() => {
    setFilteredQuestions(allQuestions);
    setEffectiveFilteredQuestions(allQuestions);
  }, [allQuestions]);
  
  // Initialize pending filters when component mounts or filters change
  useEffect(() => {
    setPendingYears(selectedYears);
    setPendingSections(selectedSections);
    setPendingTopics(selectedTopics);
    setPendingDifficulties(selectedDifficulties);
    setPendingQuestionType(selectedQuestionType);
    setPendingQuestionCount(questionCount);
  }, [selectedYears, selectedSections, selectedTopics, selectedDifficulties, selectedQuestionType, questionCount]);
  
  // Handle client-side search 
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      // Apply both search query and question type filter
      const query = searchQuery.toLowerCase().trim();
      const searchResults = filteredQuestions.filter(question => {
        // First check if question type matches the filter
        const questionTypeMatch = !selectedQuestionType || question.questionType.includes(selectedQuestionType);
        
        // Then apply search query if needed
        const searchMatch = !query || (
          question.topic?.toLowerCase().includes(query) ||
          question.section?.toLowerCase().includes(query) ||
          question.questionType?.toLowerCase().includes(query) ||
          question.questionNumber?.toString().includes(query) ||
          question.difficulty?.toLowerCase().includes(query)
        );
        
        return questionTypeMatch && searchMatch;
      });
      
      // Update effective filtered questions for pagination calculation
      setEffectiveFilteredQuestions(searchResults);
    } else {
      setEffectiveFilteredQuestions(filteredQuestions);
    }
  }, [searchQuery, selectedQuestionType, filteredQuestions]);
  
  // Toggle selection for multi-select fields
  const toggleSelection = useCallback((value: string, currentSelections: string[], setSelections: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentSelections.includes(value)) {
      setSelections(currentSelections.filter(item => item !== value));
    } else {
      setSelections([...currentSelections, value]);
    }
  }, []);
  
  // Toggle selection for pending filter values
  const togglePendingSelection = useCallback((
    value: string, 
    currentSelections: string[], 
    setSelections: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentSelections.includes(value)) {
      setSelections(currentSelections.filter(item => item !== value));
    } else {
      setSelections([...currentSelections, value]);
    }
  }, []);
  
  // Apply pending filters
  const applyFilters = useCallback(() => {
    // Update the actual filter states
    setSelectedYears(pendingYears);
    setSelectedSections(pendingSections);
    setSelectedTopics(pendingTopics);
    setSelectedDifficulties(pendingDifficulties);
    setSelectedQuestionType(pendingQuestionType);
    setQuestionCount(pendingQuestionCount);
    
    // Apply client-side filtering to the allQuestions
    let filtered = allQuestions.filter(question => {
      // If no filters are selected, include all questions
      const yearMatch = pendingYears.length === 0 || pendingYears.includes(question.year);
      const sectionMatch = pendingSections.length === 0 || pendingSections.includes(question.section);
      const topicMatch = pendingTopics.length === 0 || pendingTopics.includes(question.topic);
      const difficultyMatch = pendingDifficulties.length === 0 || pendingDifficulties.includes(question.difficulty);
      const questionTypeMatch = !pendingQuestionType || question.questionType.includes(pendingQuestionType);
      
      return yearMatch && sectionMatch && topicMatch && difficultyMatch && questionTypeMatch;
    });
    
    // If question count is specified, limit the number of results
    if (pendingQuestionCount && !isNaN(parseInt(pendingQuestionCount)) && parseInt(pendingQuestionCount) > 0) {
      filtered = filtered.slice(0, parseInt(pendingQuestionCount));
    }
    
    setFilteredQuestions(filtered);
    setEffectiveFilteredQuestions(filtered);
  }, [pendingYears, pendingSections, pendingTopics, pendingDifficulties, pendingQuestionType, pendingQuestionCount, allQuestions]);
  
  // Clear all pending filters
  const clearPendingFilters = useCallback(() => {
    setPendingYears([]);
    setPendingSections([]);
    setPendingTopics([]);
    setPendingDifficulties([]);
    setPendingQuestionType("");
    setPendingQuestionCount("");
  }, []);
  
  // Reset all filters and load all data
  const resetFilters = useCallback(() => {
    // Clear all active filters
    setSelectedYears([]);
    setSelectedSections([]);
    setSelectedTopics([]);
    setSelectedDifficulties([]);
    setSelectedQuestionType("");
    setQuestionCount("");
    
    // Clear pending filters as well
    clearPendingFilters();
    
    // Reset to all questions
    setFilteredQuestions(allQuestions);
    setEffectiveFilteredQuestions(allQuestions);
  }, [allQuestions, clearPendingFilters]);
  
  return {
    selectedYears,
    setSelectedYears,
    selectedSections,
    setSelectedSections,
    selectedTopics,
    setSelectedTopics,
    selectedDifficulties,
    setSelectedDifficulties,
    selectedQuestionType,
    setSelectedQuestionType,
    searchQuery,
    setSearchQuery,
    questionCount,
    setQuestionCount,
    
    pendingYears,
    setPendingYears,
    pendingSections,
    setPendingSections,
    pendingTopics,
    setPendingTopics,
    pendingDifficulties,
    setPendingDifficulties,
    pendingQuestionType,
    setPendingQuestionType,
    pendingQuestionCount,
    setPendingQuestionCount,
    
    filteredQuestions,
    effectiveFilteredQuestions,
    
    toggleSelection,
    togglePendingSelection,
    applyFilters,
    clearPendingFilters,
    resetFilters
  };
};
