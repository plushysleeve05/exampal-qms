import { useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";

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

// Interfaces removed

// Metrics and modal sample data removed

// Recent activity
const recentActivity = [
  { action: "Created new question", subject: "Mathematics", examType: "BECE", time: "2 minutes ago", user: "John Doe" },
  { action: "Updated question bank", subject: "Physics", examType: "WASSCE", time: "20 minutes ago", user: "Sarah Parker" },
  { action: "Imported question set", subject: "English Language", examType: "BECE", time: "1 hour ago", user: "Michael Chen" },
  { action: "Approved questions", subject: "Chemistry", examType: "WASSCE", time: "3 hours ago", user: "Jane Smith" },
];

export default function Home() {
  const [beceExpanded, setBeceExpanded] = useState(false);
  const [wassceExpanded, setWassceExpanded] = useState(false);
  
  // Modal states
  const activityModal = useModal();
  
  // Selected item state for activity view
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);

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
                  <span className="text-sm font-medium text-gray-500">8,245 questions</span>
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
                {beceSubjects.map((subject, index) => (
                  <Link
                    key={index}
                    to={`/BECE/${subject.replace(/\s+/g, '-')}`}
                    className="p-4 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors cursor-pointer"
                  >
                    {subject}
                  </Link>
                ))}
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
                  <span className="text-sm font-medium text-gray-500">7,097 questions</span>
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
                {wassceSubjects.map((subject, index) => (
                  <Link
                    key={index}
                    to={`/WASSCE/${subject.replace(/\s+/g, '-')}`}
                    className="p-4 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors cursor-pointer"
                  >
                    {subject}
                  </Link>
                ))}
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

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
          <div className="mt-3 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivity.map((item, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          <span className="text-xs font-medium leading-none text-gray-700 dark:text-gray-200">{item.user.charAt(0)}</span>
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.action}
                          <span className="font-bold"> • </span>
                          <span className="text-gray-500">{item.subject} ({item.examType})</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.user} • {item.time}
                        </p>
                      </div>
                    </div>
                    <div>
                      <button 
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        onClick={() => {
                          setSelectedActivity(index);
                          activityModal.openModal();
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 text-center">
              <button 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={activityModal.openModal}
              >
                View all activity
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Metrics-related modals removed */}
      
      {/* Activity Detail Modal */}
      <Modal isOpen={activityModal.isOpen} onClose={activityModal.closeModal} className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Detail</h2>
            <button 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={activityModal.closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {selectedActivity !== null && (
            <div>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <span className="text-lg font-medium leading-none text-gray-700 dark:text-gray-200">
                        {recentActivity[selectedActivity].user.charAt(0)}
                      </span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{recentActivity[selectedActivity].user}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{recentActivity[selectedActivity].time}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {recentActivity[selectedActivity].action}
                  </h4>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Subject:</span> {recentActivity[selectedActivity].subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Exam Type:</span> {recentActivity[selectedActivity].examType}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Additional Details</h4>
                  <div className="space-y-2">
                    {recentActivity[selectedActivity].action === "Created new question" && (
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Question Text:</span> Calculate the area of a circle with radius 5cm.
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          <span className="font-medium">Question Type:</span> Multiple Choice
                        </p>
                      </div>
                    )}
                    
                    {recentActivity[selectedActivity].action === "Updated question bank" && (
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Questions Added:</span> 15
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          <span className="font-medium">Bank:</span> WASSCE Physics Test Bank
                        </p>
                      </div>
                    )}
                    
                    {recentActivity[selectedActivity].action === "Imported question set" && (
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Set Name:</span> BECE English Language 2023
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          <span className="font-medium">Questions:</span> 60
                        </p>
                      </div>
                    )}
                    
                    {recentActivity[selectedActivity].action === "Approved questions" && (
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Questions Approved:</span> 25
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          <span className="font-medium">Set:</span> WASSCE Chemistry Prep
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={activityModal.closeModal}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Related Items
                </button>
              </div>
            </div>
          )}
          
          {selectedActivity === null && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Recent Activity</h3>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((item, index) => (
                  <div key={index} className="py-4">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                          <span className="text-xs font-medium leading-none text-gray-700 dark:text-gray-200">{item.user.charAt(0)}</span>
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.action}
                          <span className="font-bold"> • </span>
                          <span className="text-gray-500">{item.subject} ({item.examType})</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.user} • {item.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
