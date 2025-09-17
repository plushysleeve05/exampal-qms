import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useSubjects } from "./hooks/useSubjects";


export default function Home() {
  const [beceExpanded, setBeceExpanded] = useState(false);
  const [wassceExpanded, setWassceExpanded] = useState(false);
  
  // Fetch subjects using our custom hook
  const { beceSubjects, wassceSubjects, isLoading, error } = useSubjects();


  return (
    <>
      <PageMeta
        title="ExamPal QMS Dashboard"
        description="ExamPal Question Management System Dashboard"
      />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Management System</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Create, organize, and manage question banks across multiple exam types
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Exam Question Libraries</h2>

          {/* BECE Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div
              className="p-6 cursor-pointer"
              onClick={() => setBeceExpanded(!beceExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">BECE</h2>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      Basic Education Certificate Examination
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">
                    {isLoading ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : error ? (
                      "Failed to load"
                    ) : (
                      `${beceSubjects.length} subjects`
                    )}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 transition-transform duration-200 ${beceExpanded ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {beceExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
                {isLoading ? (
                  // Loading state
                  Array(8).fill(0).map((_, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-md bg-gray-100 dark:bg-gray-700 animate-pulse h-12"
                    />
                  ))
                ) : error ? (
                  // Error state
                  <div className="col-span-full p-4 text-center text-red-500 dark:text-red-400">
                    <p>Failed to load subjects. Please try again later.</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                ) : beceSubjects.length === 0 ? (
                  // No data state
                  <div className="col-span-full p-4 text-center text-gray-500 dark:text-gray-400">
                    No subjects available
                  </div>
                ) : (
                  // Subjects list
                  beceSubjects.map((subject, index) => (
                    <Link
                      key={index}
                      to={`/BECE/${subject.replace(/\s+/g, '-')}`}
                      className="p-4 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors cursor-pointer"
                    >
                      {subject}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* WASSCE Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div
              className="p-6 cursor-pointer"
              onClick={() => setWassceExpanded(!wassceExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">WASSCE</h2>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      West African Senior School Certificate Examination
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">
                    {isLoading ? (
                      <span className="inline-flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : error ? (
                      "Failed to load"
                    ) : (
                      `${wassceSubjects.length} subjects`
                    )}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 transition-transform duration-200 ${wassceExpanded ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>

            {wassceExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
                {isLoading ? (
                  // Loading state
                  Array(8).fill(0).map((_, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-md bg-gray-100 dark:bg-gray-700 animate-pulse h-12"
                    />
                  ))
                ) : error ? (
                  // Error state
                  <div className="col-span-full p-4 text-center text-red-500 dark:text-red-400">
                    <p>Failed to load subjects. Please try again later.</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                ) : wassceSubjects.length === 0 ? (
                  // No data state
                  <div className="col-span-full p-4 text-center text-gray-500 dark:text-gray-400">
                    No subjects available
                  </div>
                ) : (
                  // Subjects list
                  wassceSubjects.map((subject, index) => (
                    <Link
                      key={index}
                      to={`/WASSCE/${subject.replace(/\s+/g, '-')}`}
                      className="p-4 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors cursor-pointer"
                    >
                      {subject}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Metrics section removed */}

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/BECE/English-Language/questions/add/SectionA" className="flex items-center justify-center px-4 py-6 bg-white dark:bg-gray-800 shadow rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Create Question</span>
            </Link>
            <Link to="/question-types" className="flex items-center justify-center px-4 py-6 bg-white dark:bg-gray-800 shadow rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Question Types</span>
            </Link>
            <Link to="/exam-types" className="flex items-center justify-center px-4 py-6 bg-white dark:bg-gray-800 shadow rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Exam Types</span>
            </Link>
            <button
              onClick={() => alert("Import Questions feature is coming soon. This route needs to be implemented.")}
              className="flex items-center justify-center px-4 py-6 bg-white dark:bg-gray-800 shadow rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Import Questions</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
