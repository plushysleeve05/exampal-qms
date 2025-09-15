import { Link, useLocation, useNavigate } from "react-router";
import { useState, useRef, useEffect } from 'react';

export default function ExamNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Check if current path contains BECE or WASSCE
  const isBECE = currentPath.includes('BECE');
  const isWASSCE = currentPath.includes('WASSCE');
  
  // Extract subject from URL if it exists
  const pathParts = currentPath.split('/');
  const examType = pathParts.length > 1 ? pathParts[1] : null;
  const subject = pathParts.length > 2 ? pathParts[2] : null;
  const formattedSubject = subject ? subject.replace(/-/g, ' ') : null;
  
  // For exam type selector dropdown
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExamDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle changing exam type
  const handleExamTypeChange = (newExamType: string) => {
    if (newExamType !== examType && subject) {
      navigate(`/${newExamType}/${subject}`);
    } else if (newExamType !== examType) {
      // If no subject, navigate to English Language as default
      navigate(`/${newExamType}/English-Language`);
    }
    setIsExamDropdownOpen(false);
  };
  
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
  
  // Get subjects based on current exam type
  const subjects = isBECE ? beceSubjects : isWASSCE ? wassceSubjects : [];
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            {isBECE ? 'BECE' : isWASSCE ? 'WASSCE' : 'Exam'} Navigation
          </h2>
          
          {(isBECE || isWASSCE) && examType && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
                className="flex items-center px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {examType}
                <svg className="ml-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isExamDropdownOpen && (
                <div className="absolute right-0 z-10 mt-1 w-24 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    {['BECE', 'WASSCE'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleExamTypeChange(type)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          type === examType
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        role="menuitem"
                      >
                        {type}
                        {type === examType && (
                          <span className="ml-2 text-blue-600 dark:text-blue-400">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-1">
          {isBECE || isWASSCE ? (
            <>
              <div className="mb-3">
                <Link 
                  to="/"
                  className={`block px-3 py-2 rounded-md ${currentPath === '/' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                >
                  ← Back to All Exams
                </Link>
              </div>
              
              <div className="mb-2">
                <span className="block px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isBECE ? 'BECE' : 'WASSCE'} Subjects
                </span>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {subjects.map((subj, index) => (
                  <Link 
                    key={index}
                    to={`/${isBECE ? 'BECE' : 'WASSCE'}/${subj.replace(/\s+/g, '-')}`}
                    className={`block px-3 py-2 rounded-md ${subject === subj.replace(/\s+/g, '-') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                  >
                    {subj}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <span className="block px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Exam Types
                </span>
              </div>
              
              <Link 
                to="/BECE/English-Language"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                BECE
              </Link>
              
              <Link 
                to="/WASSCE/English-Language"
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                WASSCE
              </Link>
            </>
          )}
        </div>
      </div>
      
      {formattedSubject && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <div className="mb-2">
              <span className="block px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                {formattedSubject} Options
              </span>
            </div>
            
            <Link 
              to={`/${examType}/${subject}`}
              className={`block px-3 py-2 rounded-md ${currentPath === `/${examType}/${subject}` ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              Subject Overview
            </Link>
            
            <Link 
              to={`/${examType}/${subject}/questions`}
              className={`block px-3 py-2 rounded-md ${currentPath === `/${examType}/${subject}/questions` ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              Questions
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
