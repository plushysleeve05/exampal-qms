import { Link, useLocation } from "react-router";

export default function ExamNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if current path contains BECE or WASSCE
  const isBECE = currentPath.includes('BECE');
  const isWASSCE = currentPath.includes('WASSCE');
  
  // Extract subject from URL if it exists
  const pathParts = currentPath.split('/');
  const examType = pathParts.length > 1 ? pathParts[1] : null;
  const subject = pathParts.length > 2 ? pathParts[2] : null;
  const formattedSubject = subject ? subject.replace(/-/g, ' ') : null;
  
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
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {isBECE ? 'BECE' : isWASSCE ? 'WASSCE' : 'Exam'} Navigation
        </h2>
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
