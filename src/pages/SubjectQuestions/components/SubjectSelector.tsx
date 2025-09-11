// components/SubjectSelector.tsx
import React from 'react';

interface SubjectSelectorProps {
  subjects: string[];
  currentSubject: string;
  handleSubjectChange: (newSubject: string) => void;
  isLoading: boolean;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  currentSubject,
  handleSubjectChange,
  isLoading
}) => {
  return (
    <div className="relative">
      <button
        id="subject-dropdown-button"
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-lg px-3 py-1.5 transition duration-200 ml-2 border border-indigo-100 dark:border-indigo-800/30"
        onClick={() => document.getElementById('subject-dropdown')?.classList.toggle('hidden')}
        aria-haspopup="true"
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
        Change Subject
        <svg className="w-4 h-4 ml-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
      <div
        id="subject-dropdown"
        className="hidden absolute z-10 mt-2 w-64 rounded-lg bg-white dark:bg-gray-800 shadow-xl max-h-80 overflow-auto border border-gray-200 dark:border-gray-700 right-0"
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Select a subject</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose a subject to view its questions</p>
        </div>
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
          {isLoading ? (
            <li className="flex items-center justify-center p-4">
              <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2">Loading subjects...</span>
            </li>
          ) : subjects.length === 0 ? (
            <li className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No subjects available</li>
          ) : (
            subjects.map((subject) => (
              <li key={subject}>
                <button
                  onClick={() => handleSubjectChange(subject)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    currentSubject === subject
                      ? 'bg-gray-100 dark:bg-gray-700 font-medium'
                      : ''
                  }`}
                >
                  {subject}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default SubjectSelector;
