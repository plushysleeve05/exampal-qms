// components/QuestionsTable.tsx
import React from 'react';
import { QuestionData } from '../types';

interface QuestionsTableProps {
  paginatedQuestions: QuestionData[];
  sortConfig: {
    key: keyof QuestionData;
    direction: 'asc' | 'desc';
  };
  handleSort: (key: keyof QuestionData) => void;
  selectedRows: number[];
  handleSelectRow: (id: number) => void;
  handleSelectAllRows: (checked: boolean) => void;
  handleEdit: (question: QuestionData) => void;
  handleView: (question: QuestionData) => void;
  handleDeleteQuestion: (question: QuestionData) => void;
  isLoading: boolean;
  initialDataLoaded?: boolean;
}

// Helper function to check if a question has solution materials
const hasSolutionMaterials = (question: QuestionData): boolean => {
  return !!(
    question.solutions && 
    (question.solutions.videoUrl || 
     question.solutions.imagePreview || 
     question.solutions.markingSchemePreview || 
     question.solutions.teachersNotePreview)
  );
};

const QuestionsTable: React.FC<QuestionsTableProps> = ({
  paginatedQuestions,
  sortConfig,
  handleSort,
  selectedRows,
  handleSelectRow,
  handleSelectAllRows,
  handleEdit,
  handleView,
  handleDeleteQuestion,
  isLoading,
  initialDataLoaded
}) => {
  return (
    <div className="overflow-x-auto relative">
      {isLoading ? (
        <div className="px-6 py-5">
          <div className="animate-pulse">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <th key={i} scope="col" className="px-3 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr key={row} className="border-b dark:border-gray-700">
                    {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                      <td key={`${row}-${col}`} className="px-3 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <table className="w-full min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              {/* Select all checkbox column */}
              <th scope="col" className="relative w-12 px-4 py-4 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800 transition-all duration-200"
                    onChange={(e) => handleSelectAllRows(e.target.checked)}
                    checked={paginatedQuestions.length > 0 && selectedRows.length === paginatedQuestions.length}
                    aria-label="Select all questions"
                  />
                  <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {selectedRows.length > 0 && `${selectedRows.length}/${paginatedQuestions.length}`}
                  </div>
                </div>
              </th>

              {/* Question Number column */}
              <th scope="col" className="px-3 py-3 w-24 text-left">
                <div
                  className="group inline-flex items-center cursor-pointer"
                  onClick={() => handleSort('questionNumber')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Sort by Question Number ${sortConfig.key === 'questionNumber' ? (sortConfig.direction === 'asc' ? '(ascending)' : '(descending)') : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort('questionNumber');
                    }
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200 mr-1.5">Question No.</span>
                  <div className="flex flex-col">
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'questionNumber' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L16 10H0L8 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'questionNumber' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 10L0 0H16L8 10Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>

              {/* Year column */}
              <th scope="col" className="px-4 py-4 w-24 text-left">
                <div
                  className="group inline-flex items-center cursor-pointer"
                  onClick={() => handleSort('year')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Sort by Year ${sortConfig.key === 'year' ? (sortConfig.direction === 'asc' ? '(ascending)' : '(descending)') : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort('year');
                    }
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200 mr-1.5">Year</span>
                  <div className="flex flex-col">
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'year' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L16 10H0L8 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'year' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 10L0 0H16L8 10Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>

              {/* Section column */}
              <th scope="col" className="px-4 py-4 w-28 text-left">
                <div
                  className="group inline-flex items-center cursor-pointer"
                  onClick={() => handleSort('section')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Sort by Section ${sortConfig.key === 'section' ? (sortConfig.direction === 'asc' ? '(ascending)' : '(descending)') : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort('section');
                    }
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200 mr-1.5">Section</span>
                  <div className="flex flex-col">
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'section' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L16 10H0L8 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'section' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 10L0 0H16L8 10Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>

              {/* Question Type column */}
              <th scope="col" className="px-3 py-3 w-32 text-left">
                <div
                  className="group inline-flex items-center cursor-pointer"
                  onClick={() => handleSort('questionType')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Sort by Question Type ${sortConfig.key === 'questionType' ? (sortConfig.direction === 'asc' ? '(ascending)' : '(descending)') : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort('questionType');
                    }
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200 mr-1.5">Question Type</span>
                  <div className="flex flex-col">
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'questionType' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L16 10H0L8 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'questionType' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 10L0 0H16L8 10Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>

              {/* Topic column */}
              <th scope="col" className="px-3 py-3 w-24 text-left">
                <div
                  className="group inline-flex items-center cursor-pointer"
                  onClick={() => handleSort('topic')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Sort by Topic ${sortConfig.key === 'topic' ? (sortConfig.direction === 'asc' ? '(ascending)' : '(descending)') : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort('topic');
                    }
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200 mr-1.5">Topic</span>
                  <div className="flex flex-col">
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'topic' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L16 10H0L8 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'topic' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 10L0 0H16L8 10Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>

              {/* Difficulty column */}
              <th scope="col" className="px-3 py-3 w-24 text-left">
                <div
                  className="group inline-flex items-center cursor-pointer"
                  onClick={() => handleSort('difficultyLevel')}
                  role="button"
                  tabIndex={0}
                  aria-label={`Sort by Difficulty ${sortConfig.key === 'difficultyLevel' ? (sortConfig.direction === 'asc' ? '(ascending)' : '(descending)') : ''}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort('difficultyLevel');
                    }
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200 mr-1.5">Difficulty</span>
                  <div className="flex flex-col">
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'difficultyLevel' && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 0L16 10H0L8 0Z" fill="currentColor" />
                    </svg>
                    <svg
                      className={`h-2 w-2 ${sortConfig.key === 'difficultyLevel' && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                      viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 10L0 0H16L8 10Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </th>

              {/* Actions column */}
              <th scope="col" className="px-3 py-3 w-20 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-200">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedQuestions.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  No questions found. Try adjusting your filters or loading all questions.
                </td>
              </tr>
            ) : (
              paginatedQuestions.map((question) => (
                <tr
                  key={question.id}
                  className={`transition-colors duration-150 group cursor-pointer ${
                    selectedRows.includes(question.id)
                      ? 'bg-blue-50/50 dark:bg-blue-900/10'
                      : hasSolutionMaterials(question)
                        ? 'bg-green-50/50 dark:bg-green-900/10 hover:bg-green-100/50 dark:hover:bg-green-800/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/70'
                  }`}
                  title={
                    hasSolutionMaterials(question)
                      ? "This question has solution materials"
                      : ""
                  }
                  tabIndex={0}
                  role="row"
                  aria-selected={selectedRows.includes(question.id)}
                  onKeyDown={(e) => {
                    // Handle keyboard navigation
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleView(question);
                    } else if (e.key === 'e') {
                      e.preventDefault();
                      handleEdit(question);
                    }
                  }}
                  onClick={(e) => {
                    // Don't open view modal if clicking on checkbox or action buttons
                    if (
                      e.target instanceof HTMLInputElement ||
                      (e.target instanceof Element && e.target.closest('button'))
                    ) {
                      return;
                    }
                    handleView(question);
                  }}
                >
                  {/* Checkbox cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-800 transition-all duration-200"
                        onChange={() => handleSelectRow(question.id)}
                        checked={selectedRows.includes(question.id)}
                      />
                    </div>
                  </td>

                  {/* Question Number cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="inline-flex items-center justify-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {question.questionNumber}
                    </div>
                  </td>

                  {/* Year cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {question.year}
                    </div>
                  </td>

                  {/* Section cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        question.section === 'Section A'
                          ? 'bg-blue-400 dark:bg-blue-500'
                          : 'bg-green-400 dark:bg-green-500'
                      }`}></span>
                      <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                        {question.section}
                        {hasSolutionMaterials(question) && (
                          <span 
                            className="ml-2 text-green-600 dark:text-green-400 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30" 
                            title="This question has solution materials"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Question Type cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <div className="font-medium">{question.questionType}</div>
                      </div>
                    </div>
                  </td>

                  {/* Topic cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-800/30">
                      {question.topic}
                    </div>
                  </td>

                  {/* Difficulty cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full ${
                      question.difficultyLevel === 1
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-100 dark:border-green-800/30'
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-100 dark:border-red-800/30'
                    }`}>
                      {question.difficultyLevel === 1 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {question.difficultyLevel === 2 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                      )}
                      {question.difficultyLevel === 1 ? 'Easy' : 'Hard'}
                    </span>
                  </td>

                  {/* Actions cell */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {/* View action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(question);
                        }}
                        className="p-1.5 rounded-md text-green-600 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 transition-colors duration-200"
                        title="View question"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Edit action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(question);
                        }}
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-colors duration-200"
                        title="Edit question"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>

                      {/* Delete action */}
                      <button
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleDeleteQuestion(question);
                        }}
                        title="Delete question"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuestionsTable;
