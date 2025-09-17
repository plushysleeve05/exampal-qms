import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import { fetchQuestionCounts, QuestionCountsResponse, ExamType } from '../api';

// Subject statistics interface
interface SubjectStats {
  [subject: string]: QuestionCountsResponse | null;
}

// BECE subjects
const beceSubjects = [
  "English Language",
  "Mathematics",
  "Integrated Science",
  "Social Studies",
  "Religious And Moral Education",
  "Home Economics",
  "Pre Technical Skills",
  "Akuapem Twi",
  "Asante Twi",
  "Ga",
  "French",
  "Career Technology",
  "Computing",
  "Creative Arts And Designs"
];

// WASSCE subjects
const wassceSubjects = [
  "English Language",
  "Core Mathematics",
  "Elective Mathematics",
  "Biology",
  "Physics",
  "Economics",
  "Social Studies",
  "Chemistry",
  "Geography",
  "Integrated Science",
  "Elective ICT",
  "Cost Accounting",
  "Food and Nutrition",
  "French",
  "General Science",
  "Additional Mathematics"
];

export default function SubjectsListPage() {
  // State for selected exam type
  const [selectedExamType, setSelectedExamType] = useState<ExamType>("BECE");
  // State for subject statistics
  const [subjectStats, setSubjectStats] = useState<SubjectStats>({});
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get subjects based on selected exam type
  const subjects = selectedExamType === "BECE" ? beceSubjects : wassceSubjects;
  
  // Fetch statistics for the selected exam type and subjects
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Create a new stats object
        const newStats: SubjectStats = {};
        
        // Fetch stats for up to 4 subjects concurrently (to avoid overloading the API)
        const batchSize = 4;
        for (let i = 0; i < subjects.length; i += batchSize) {
          const batch = subjects.slice(i, i + batchSize);
          const promises = batch.map(subject => 
            fetchQuestionCounts(selectedExamType, subject)
              .then(data => ({ subject, data }))
              .catch(() => ({ subject, data: null }))
          );
          
          const results = await Promise.all(promises);
          results.forEach(({ subject, data }) => {
            newStats[subject] = data;
          });
        }
        
        setSubjectStats(newStats);
      } catch (error) {
        console.error('Error fetching subject statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [selectedExamType, subjects]);

  return (
    <>
      <PageMeta
        title="Subjects | ExamPal QMS"
        description="Browse and manage subjects across exam types"
      />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
            <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
              Browse and manage subjects across exam types
            </p>
          </div>
          
          {/* Exam Type Selector */}
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setSelectedExamType("BECE")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  selectedExamType === "BECE"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                } border border-r-0`}
              >
                BECE
              </button>
              <button
                type="button"
                onClick={() => setSelectedExamType("WASSCE")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  selectedExamType === "WASSCE"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                } border`}
              >
                WASSCE
              </button>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mt-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {selectedExamType} Subjects
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subjects.length} subjects available
              </p>
            </div>
            {isLoading && (
              <div className="p-6 flex justify-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
                {subjects.map((subject, index) => {
                  const stats = subjectStats[subject];
                  const totalQuestions = stats?.sectionCounts?.total || 0;
                  const topTopics = stats?.topicCounts?.slice(0, 3) || [];
                  
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white text-lg">{subject}</h3>
                      
                      <div className="mt-3 flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                          {selectedExamType}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          {totalQuestions} Questions
                        </span>
                      </div>
                      
                      {stats && (
                        <div className="mt-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                              <span className="block text-gray-500 dark:text-gray-400 text-xs">Section A</span>
                              <span className="font-medium">{stats.sectionCounts.sectionA} Questions</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                              <span className="block text-gray-500 dark:text-gray-400 text-xs">Section B</span>
                              <span className="font-medium">{stats.sectionCounts.sectionB} Questions</span>
                            </div>
                          </div>
                          
                          {topTopics.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Top Topics</h4>
                              <ul className="space-y-1">
                                {topTopics.map((topic, idx) => (
                                  <li key={idx} className="text-sm flex justify-between">
                                    <span className="text-gray-700 dark:text-gray-300 truncate mr-2" title={topic.name}>{topic.name}</span>
                                    <span className="text-gray-500 dark:text-gray-400">{topic.count}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-between">
                        <Link
                          to={`/${selectedExamType}/${subject.replace(/\s+/g, '-')}`}
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
                        >
                          View Subject
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        
                        <Link
                          to={`/${selectedExamType}/${subject.replace(/\s+/g, '-')}/questions`}
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                        >
                          View Questions
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}