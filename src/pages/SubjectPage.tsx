import { useState } from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../components/common/PageMeta";
import ExamNavigation from "../components/common/ExamNavigation";
import AddQuestionModal from "../components/modals/AddQuestionModal";
import { useSubjectData } from "./hooks/useSubjectData";
import { ExamType } from "../api";

export default function SubjectPage() {
  const { examType, subject } = useParams<{ examType: string; subject: string }>();
  const formattedSubject = subject?.replace(/-/g, ' ');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  
  // Fetch data from API using our custom hook
  const { 
    subjectData, 
    isLoading, 
    error 
  } = useSubjectData({
    examType: examType as ExamType,
    subject: formattedSubject
  });
  
  const openModal = (section: string) => {
    setActiveSection(section);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <PageMeta
        title={`${formattedSubject} | ${examType} | ExamPal QMS`}
        description={`Manage ${formattedSubject} questions for ${examType}`}
      />
      
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <ExamNavigation />
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
                    {formattedSubject}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {examType} - Manage questions and assessments
                  </p>
                </div>
                {!isLoading && (
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <span className="text-xs font-medium bg-gray-50 border border-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-md text-gray-600 dark:text-gray-300">
                      {subjectData.questionCount.total} total questions
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm mb-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">An error occurred</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button 
                        type="button" 
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => window.location.reload()}
                      >
                        <svg className="-ml-0.5 mr-1.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading state */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Question count skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 mr-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full mt-2"></div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 mr-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-full mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Years skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Topics skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
                        </div>
                      ))}
                      <div className="flex justify-center pt-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Subject Overview */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-medium text-gray-900 dark:text-white">Question Count</h2>
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-50 border border-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium">
                      {subjectData.questionCount.total} Total
                    </span>
                  </div>
                  <div className="space-y-6">
                    <div className="pt-2">
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 mr-2">A</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Section A</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-gray-900 dark:text-white text-lg">
                              {subjectData.questionCount.sectionA}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded-md bg-gray-100 dark:bg-gray-700">
                          <div 
                            style={{ width: `${(subjectData.questionCount.sectionA / subjectData.questionCount.total * 100) || 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 dark:bg-indigo-600 rounded-md transition-all duration-300">
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 mr-2">B</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Section B</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-gray-900 dark:text-white text-lg">
                              {subjectData.questionCount.sectionB}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded-md bg-gray-100 dark:bg-gray-700">
                          <div 
                            style={{ width: `${(subjectData.questionCount.sectionB / subjectData.questionCount.total * 100) || 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 dark:bg-purple-600 rounded-md transition-all duration-300">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-medium text-gray-900 dark:text-white">Available Years</h2>
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-50 border border-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium">
                      {subjectData.years.length} Years
                    </span>
                  </div>
                  
                  {subjectData.years.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No exam years available</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {/* Sort years in descending order */}
                      {subjectData.years
                        .sort((a, b) => b - a)
                        .map(year => (
                          <Link
                            to={`/${examType}/${subject}/questions?year=${year}`}
                            key={year} 
                            className="px-3 py-1.5 bg-gray-50 border border-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                          >
                            {year}
                          </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-4 transition-all hover:shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-medium text-gray-900 dark:text-white">Popular Topics</h2>
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-50 border border-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium">
                      {subjectData.topics.length} Total
                    </span>
                  </div>
                  
                  {subjectData.topics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No topic data available</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div 
                        className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar"
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#d1d5db #f3f4f6'
                        }}>
                        <div className="space-y-4">
                          {subjectData.topics.map(topic => {
                            // Calculate percentage of total questions for this topic
                            const percentage = Math.round((topic.count / subjectData.questionCount.total) * 100) || 0;
                            
                            return (
                              <div key={topic.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[70%]">{topic.name}</span>
                                  <span className="text-gray-600 dark:text-gray-400 text-sm">{topic.count} <span className="text-xs">({percentage}%)</span></span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-md h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-md transition-all duration-300" 
                                    style={{ width: `${percentage}%` }}>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none z-10"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Link
                to={`/${examType}/${subject}/questions`}
                className={`flex items-center justify-center px-6 py-3 font-medium rounded-md text-white transition-all ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                onClick={e => isLoading && e.preventDefault()}
              >
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium">Loading...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="font-medium">View All Questions</span>
                    </>
                  )}
                </div>
              </Link>
              <button
                onClick={() => openModal("Section-A")}
                disabled={isLoading}
                className={`flex items-center justify-center px-6 py-3 font-medium rounded-md text-white transition-all ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium">Loading...</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 mr-2">A</span>
                      <span className="font-medium">Add Section A Question</span>
                    </>
                  )}
                </div>
              </button>
              <button
                onClick={() => openModal("Section-B")}
                disabled={isLoading}
                className={`flex items-center justify-center px-6 py-3 font-medium rounded-md text-white transition-all ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium">Loading...</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 mr-2">B</span>
                      <span className="font-medium">Add Section B Question</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Question Modal */}
      <AddQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        section={activeSection}
        onSave={(questionData) => {
          console.log("New question created:", questionData);
          // In a real application, you would send this to an API
          setIsModalOpen(false);
        }}
        years={subjectData.years.map(year => year.toString())}
        topics={subjectData.topics.map(topic => topic.name)}
        difficulties={["Easy", "Hard"]}
      />
    </>
  );
}
