// components/FilterSection.tsx
import React, { useRef, useEffect, useState } from 'react';
interface FilterSectionProps {
  years: string[];
  topics: string[];
  difficulties: string[];
  questionTypes: string[];
  sections: string[];
  pendingYears: string[];
  setPendingYears: React.Dispatch<React.SetStateAction<string[]>>;
  pendingQuestionTypes: string[];
  setPendingQuestionTypes: (types: string[] | ((prevTypes: string[]) => string[])) => void;
  pendingTopics: string[];
  setPendingTopics: React.Dispatch<React.SetStateAction<string[]>>;
  pendingDifficulties: string[];
  setPendingDifficulties: React.Dispatch<React.SetStateAction<string[]>>;
  
  selectedYears: string[];
  selectedTopics: string[];
  selectedDifficulties: string[];
  
  applyFilters: () => void;
  clearPendingFilters: () => void;
  loadAllData: () => void;
  togglePendingSelection: (value: string, currentSelections: string[], setSelections: React.Dispatch<React.SetStateAction<string[]>>) => void;
  
  isLoading: boolean;
  initialDataLoaded: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  years,
  topics,
  difficulties,
  questionTypes,
  pendingYears,
  setPendingYears,
  pendingQuestionTypes,
  setPendingQuestionTypes,
  pendingTopics,
  setPendingTopics,
  pendingDifficulties,
  setPendingDifficulties,
  selectedYears,
  selectedTopics,
  selectedDifficulties,
  applyFilters,
  clearPendingFilters,
  loadAllData,
  togglePendingSelection,
  isLoading,
  initialDataLoaded
}) => {
  // Track active dropdown
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // References to dropdown elements
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const questionTypeDropdownRef = useRef<HTMLDivElement>(null);
  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const difficultyDropdownRef = useRef<HTMLDivElement>(null);
  const yearButtonRef = useRef<HTMLButtonElement>(null);
  const questionTypeButtonRef = useRef<HTMLButtonElement>(null);
  const topicButtonRef = useRef<HTMLButtonElement>(null);
  const difficultyButtonRef = useRef<HTMLButtonElement>(null);

  // Handle opening and closing dropdowns
  const toggleDropdown = (id: string) => {
    if (activeDropdown === id) {
      // Close the active dropdown if clicked again
      setActiveDropdown(null);
    } else {
      // Close any open dropdown and open the new one
      setActiveDropdown(id);
    }
  };
  
  // Handle dropdown menu item click

  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Escape') {
      // Close dropdown when Escape is pressed
      setActiveDropdown(null);
    } else if (e.key === 'Enter' || e.key === ' ') {
      // Toggle dropdown when Enter or Space is pressed
      e.preventDefault();
      toggleDropdown(id);
    } else if (e.key === 'ArrowDown' && activeDropdown === id) {
      // Focus first checkbox in dropdown
      e.preventDefault();
      const dropdownItems = document.querySelectorAll(`#${id} .px-3.py-2.hover\\:bg-gray-100 input`);
      if (dropdownItems.length > 0) {
        (dropdownItems[0] as HTMLElement).focus();
      }
    }
  };
  
  // Handle clicking outside to close dropdown and keyboard interactions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Early return if no dropdown is active
      if (!activeDropdown) return;
      
      // Check if click is outside of the active dropdown
      const isOutsideClick = (
        (activeDropdown === 'year-dropdown' && 
          !yearDropdownRef.current?.contains(event.target as Node) && 
          !yearButtonRef.current?.contains(event.target as Node)) ||
        (activeDropdown === 'question-type-dropdown' && 
          !questionTypeDropdownRef.current?.contains(event.target as Node) && 
          !questionTypeButtonRef.current?.contains(event.target as Node)) ||
        (activeDropdown === 'topic-dropdown' && 
          !topicDropdownRef.current?.contains(event.target as Node) && 
          !topicButtonRef.current?.contains(event.target as Node)) ||
        (activeDropdown === 'difficulty-dropdown' && 
          !difficultyDropdownRef.current?.contains(event.target as Node) && 
          !difficultyButtonRef.current?.contains(event.target as Node))
      );
      
      if (isOutsideClick) {
        setActiveDropdown(null);
      }
    };
    
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeDropdown) {
        setActiveDropdown(null);
      }
    };
    
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && activeDropdown) {
        const activeElement = document.activeElement;
        const dropdownRef = 
          activeDropdown === 'year-dropdown' ? yearDropdownRef.current :
          activeDropdown === 'question-type-dropdown' ? questionTypeDropdownRef.current :
          activeDropdown === 'topic-dropdown' ? topicDropdownRef.current :
          activeDropdown === 'difficulty-dropdown' ? difficultyDropdownRef.current : null;
        
        // Check if the focus is moving outside the dropdown
        if (dropdownRef && !dropdownRef.contains(activeElement) && 
            !event.shiftKey && activeElement === document.querySelector(`#${activeDropdown}-button`)) {
          // If tabbing from the button, focus the first element in dropdown
          event.preventDefault();
          const firstElement = dropdownRef.querySelector('input') as HTMLElement;
          if (firstElement) firstElement.focus();
        } else if (dropdownRef && !dropdownRef.contains(activeElement?.nextElementSibling as Node) && event.shiftKey) {
          // Check if we're tabbing backwards out of the dropdown
          setActiveDropdown(null);
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleTabKey);
    
    // Set focus to the dropdown button when it opens
    if (activeDropdown === 'year-dropdown' && yearButtonRef.current) {
      yearButtonRef.current.focus();
    } else if (activeDropdown === 'question-type-dropdown' && questionTypeButtonRef.current) {
      questionTypeButtonRef.current.focus();
    } else if (activeDropdown === 'topic-dropdown' && topicButtonRef.current) {
      topicButtonRef.current.focus();
    } else if (activeDropdown === 'difficulty-dropdown' && difficultyButtonRef.current) {
      difficultyButtonRef.current.focus();
    }
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [activeDropdown]);

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filter Questions</h3>
      
      {/* Filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Year filter dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Exam Year
          </label>
          <div className="relative">
            <button
              id="year-dropdown-button"
              ref={yearButtonRef}
              onClick={() => toggleDropdown('year-dropdown')}
              onKeyDown={(e) => handleKeyDown(e, 'year-dropdown')}
              className={`w-full bg-white dark:bg-gray-700 border ${activeDropdown === 'year-dropdown' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-md py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-colors duration-200`}
              aria-expanded={activeDropdown === 'year-dropdown'}
              aria-haspopup="true"
              tabIndex={0}
            >
              <span className="block truncate">
                {pendingYears.length > 0 
                  ? `${pendingYears.length} year${pendingYears.length > 1 ? 's' : ''} selected` 
                  : 'Select years'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg 
                  className={`h-5 w-5 ${activeDropdown === 'year-dropdown' ? 'text-blue-500' : 'text-gray-400'} transition-transform duration-200 ${activeDropdown === 'year-dropdown' ? 'transform rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            <div
              id="year-dropdown"
              className={`absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md max-h-60 overflow-auto py-1 text-sm transition-all duration-200 ease-in-out transform origin-top ${
                activeDropdown === 'year-dropdown' 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}
              ref={yearDropdownRef}
            >
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setPendingYears(years.map(year => year))}
                  >
                    Select All
                  </button>
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setPendingYears([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              {years.map((year, index) => (
                <div 
                  key={`${year}-${index}`} 
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => togglePendingSelection(year, pendingYears, setPendingYears)}
                >
                  <label className="inline-flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pendingYears.includes(year)}
                      onChange={() => togglePendingSelection(year, pendingYears, setPendingYears)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span 
                      className="ml-2 text-gray-700 dark:text-gray-200 flex-grow"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent double firing with parent onClick
                        togglePendingSelection(year, pendingYears, setPendingYears);
                      }}
                    >
                      {year}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Type filter dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Type
          </label>
          <div className="relative">
            <button
              id="question-type-dropdown-button"
              ref={questionTypeButtonRef}
              onClick={() => toggleDropdown('question-type-dropdown')}
              onKeyDown={(e) => handleKeyDown(e, 'question-type-dropdown')}
              className={`w-full bg-white dark:bg-gray-700 border ${activeDropdown === 'question-type-dropdown' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-md py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-colors duration-200`}
              aria-expanded={activeDropdown === 'question-type-dropdown'}
              aria-haspopup="true"
              tabIndex={0}
            >
              <span className="block truncate">
                {pendingQuestionTypes.length > 0 
                  ? `${pendingQuestionTypes.length} type${pendingQuestionTypes.length > 1 ? 's' : ''} selected` 
                  : 'Select question types'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg 
                  className={`h-5 w-5 ${activeDropdown === 'question-type-dropdown' ? 'text-blue-500' : 'text-gray-400'} transition-transform duration-200 ${activeDropdown === 'question-type-dropdown' ? 'transform rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            <div
              id="question-type-dropdown"
              className={`absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md max-h-60 overflow-auto py-1 text-sm transition-all duration-200 ease-in-out transform origin-top ${
                activeDropdown === 'question-type-dropdown' 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}
              ref={questionTypeDropdownRef}
            >
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => {
                      // Only select the first question type when "Select All" is clicked
                      // since we're using single selection in the parent component
                      if (questionTypes.length > 0) {
                        setPendingQuestionTypes([questionTypes[0]]);
                      }
                    }}
                  >
                    Select First
                  </button>
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setPendingQuestionTypes([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              {questionTypes.map((questionType, index) => (
                <div 
                  key={`${questionType}-${index}`} 
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => togglePendingSelection(questionType, pendingQuestionTypes, setPendingQuestionTypes)}
                >
                  <label className="inline-flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pendingQuestionTypes.includes(questionType)}
                      onChange={() => togglePendingSelection(questionType, pendingQuestionTypes, setPendingQuestionTypes)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span 
                      className="ml-2 text-gray-700 dark:text-gray-200 flex-grow"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent double firing with parent onClick
                        togglePendingSelection(questionType, pendingQuestionTypes, setPendingQuestionTypes);
                      }}
                    >
                      {questionType}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topic filter dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Topic
          </label>
          <div className="relative">
            <button
              id="topic-dropdown-button"
              ref={topicButtonRef}
              onClick={() => toggleDropdown('topic-dropdown')}
              onKeyDown={(e) => handleKeyDown(e, 'topic-dropdown')}
              className={`w-full bg-white dark:bg-gray-700 border ${activeDropdown === 'topic-dropdown' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-md py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-colors duration-200`}
              aria-expanded={activeDropdown === 'topic-dropdown'}
              aria-haspopup="true"
              tabIndex={0}
            >
              <span className="block truncate">
                {pendingTopics.length > 0 
                  ? `${pendingTopics.length} topic${pendingTopics.length > 1 ? 's' : ''} selected` 
                  : 'Select topics'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg 
                  className={`h-5 w-5 ${activeDropdown === 'topic-dropdown' ? 'text-blue-500' : 'text-gray-400'} transition-transform duration-200 ${activeDropdown === 'topic-dropdown' ? 'transform rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            <div
              id="topic-dropdown"
              className={`absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md max-h-60 overflow-auto py-1 text-sm transition-all duration-200 ease-in-out transform origin-top ${
                activeDropdown === 'topic-dropdown' 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}
              ref={topicDropdownRef}
            >
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setPendingTopics([...topics])}
                  >
                    Select All
                  </button>
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setPendingTopics([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              {topics.map((topic, index) => (
                <div 
                  key={`${topic}-${index}`} 
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => togglePendingSelection(topic, pendingTopics, setPendingTopics)}
                >
                  <label className="inline-flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pendingTopics.includes(topic)}
                      onChange={() => togglePendingSelection(topic, pendingTopics, setPendingTopics)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span 
                      className="ml-2 text-gray-700 dark:text-gray-200 flex-grow"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent double firing with parent onClick
                        togglePendingSelection(topic, pendingTopics, setPendingTopics);
                      }}
                    >
                      {topic}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty filter dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <div className="relative">
            <button
              id="difficulty-dropdown-button"
              ref={difficultyButtonRef}
              onClick={() => toggleDropdown('difficulty-dropdown')}
              onKeyDown={(e) => handleKeyDown(e, 'difficulty-dropdown')}
              className={`w-full bg-white dark:bg-gray-700 border ${activeDropdown === 'difficulty-dropdown' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300 dark:border-gray-600'} rounded-md py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-colors duration-200`}
              aria-expanded={activeDropdown === 'difficulty-dropdown'}
              aria-haspopup="true"
              tabIndex={0}
            >
              <span className="block truncate">
                {pendingDifficulties.length > 0 
                  ? `${pendingDifficulties.length} level${pendingDifficulties.length > 1 ? 's' : ''} selected` 
                  : 'Select difficulty'}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg 
                  className={`h-5 w-5 ${activeDropdown === 'difficulty-dropdown' ? 'text-blue-500' : 'text-gray-400'} transition-transform duration-200 ${activeDropdown === 'difficulty-dropdown' ? 'transform rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
            <div
              id="difficulty-dropdown"
              className={`absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md max-h-60 overflow-auto py-1 text-sm transition-all duration-200 ease-in-out transform origin-top ${
                activeDropdown === 'difficulty-dropdown' 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-95 invisible pointer-events-none'
              }`}
              ref={difficultyDropdownRef}
            >
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setPendingDifficulties([...difficulties])}
                  >
                    Select All
                  </button>
                  <button 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => setPendingDifficulties([])}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              {difficulties.map((difficulty, index) => (
                <div 
                  key={`${difficulty}-${index}`} 
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  onClick={() => togglePendingSelection(difficulty, pendingDifficulties, setPendingDifficulties)}
                >
                  <label className="inline-flex items-center w-full cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pendingDifficulties.includes(difficulty)}
                      onChange={() => togglePendingSelection(difficulty, pendingDifficulties, setPendingDifficulties)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span 
                      className="ml-2 text-gray-700 dark:text-gray-200 flex-grow"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent double firing with parent onClick
                        togglePendingSelection(difficulty, pendingDifficulties, setPendingDifficulties);
                      }}
                    >
                      {difficulty}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter action buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center shadow-sm"
          onClick={applyFilters}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Apply Filters
            </>
          )}
        </button>

        <button
          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
          onClick={clearPendingFilters}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>

        <button
          className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
          onClick={loadAllData}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Load All Data
        </button>
      </div>

      {/* Active filter tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedYears.length > 0 && (
          <div className="text-xs bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30 px-2 py-1 rounded-full">
            Years: {selectedYears.join(", ")}
          </div>
        )}
        {selectedTopics.length > 0 && (
          <div className="text-xs bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/30 px-2 py-1 rounded-full">
            Topics: {selectedTopics.join(", ")}
          </div>
        )}
        {selectedDifficulties.length > 0 && (
          <div className="text-xs bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/30 px-2 py-1 rounded-full">
            Difficulties: {selectedDifficulties.join(", ")}
          </div>
        )}
        {pendingQuestionTypes.length > 0 && (
          <div className="text-xs bg-purple-50 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30 px-2 py-1 rounded-full">
            Question Types: {pendingQuestionTypes.join(", ")}
          </div>
        )}
      </div>

      {/* Initial state message */}
      {!initialDataLoaded && !isLoading && (
        <div className="mt-4 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium mb-1">No questions loaded yet</p>
              <p>Use the filters above to search for specific questions or click "Load All Data" to see all questions for this subject.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
