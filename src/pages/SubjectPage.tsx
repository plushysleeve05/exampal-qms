import { useState } from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../components/common/PageMeta";
import ExamNavigation from "../components/common/ExamNavigation";
import AddQuestionModal from "../components/modals/AddQuestionModal";

export default function SubjectPage() {
  const { examType, subject } = useParams<{ examType: string; subject: string }>();
  const formattedSubject = subject?.replace(/-/g, ' ');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  
  const openModal = (section: string) => {
    setActiveSection(section);
    setIsModalOpen(true);
  };
  
  // Mock data - would come from API in a real application
  const subjectData = {
    questionCount: {
      total: 250,
      sectionA: 150,
      sectionB: 100
    },
    years: [2025, 2024, 2023, 2022, 2021],
    topics: [
      { name: "Grammar", count: 80 },
      { name: "Comprehension", count: 60 },
      { name: "Essay", count: 70 },
      { name: "Literature", count: 40 }
    ]
  };
  
  return (
    <>
      <PageMeta
        title={`${formattedSubject} | ${examType} | ExamPal QMS`}
        description={`Manage ${formattedSubject} questions for ${examType}`}
      />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation sidebar */}
          <div className="md:col-span-1">
            <ExamNavigation />
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formattedSubject}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {examType} - Manage questions and assessments
              </p>
            </div>
            
            {/* Subject Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Question Count</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Total Questions</span>
                    <span className="text-xl font-medium text-gray-900 dark:text-white">{subjectData.questionCount.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Section A</span>
                    <span className="text-gray-900 dark:text-white">{subjectData.questionCount.sectionA}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Section B</span>
                    <span className="text-gray-900 dark:text-white">{subjectData.questionCount.sectionB}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Years</h2>
                <div className="flex flex-wrap gap-2">
                  {subjectData.years.map(year => (
                    <span 
                      key={year} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-200"
                    >
                      {year}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Topics</h2>
                <div className="space-y-3">
                  {subjectData.topics.map(topic => (
                    <div key={topic.name} className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">{topic.name}</span>
                      <span className="text-gray-900 dark:text-white">{topic.count} questions</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to={`/${examType}/${subject}/questions`}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center"
              >
                View Questions
              </Link>
              <button
                onClick={() => openModal("Section-A")}
                className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md text-center"
              >
                Add Section-A Question
              </button>
              <button
                onClick={() => openModal("Section-B")}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-center"
              >
                Add Section-B Question
              </button>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 dark:text-white">
                        <span className="font-medium">10 new questions</span> added to Section A
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Today at 9:42 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600 dark:text-green-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 dark:text-white">
                        <span className="font-medium">Question paper</span> generated for 2023 exam
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Yesterday at 4:30 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-600 dark:text-yellow-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-900 dark:text-white">
                        <span className="font-medium">15 questions</span> updated with new explanations
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">June 12, 2023</p>
                    </div>
                  </div>
                </div>
              </div>
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
        difficulties={["Easy", "Medium", "Hard"]}
      />
    </>
  );
}
