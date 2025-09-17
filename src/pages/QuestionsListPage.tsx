import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';

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

export default function QuestionsListPage() {
  const [beceExpanded, setBeceExpanded] = useState(true);
  const [wassceExpanded, setWassceExpanded] = useState(true);

  return (
    <>
      <PageMeta
        title="Question Management | ExamPal QMS"
        description="Manage all questions across different subjects and exam types"
      />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Question Management</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Create, edit, and manage questions across different exam types and subjects
          </p>
        </div>

        <div className="mt-8 space-y-6">
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
                  <span className="text-sm font-medium text-gray-500">{beceSubjects.length} subjects</span>
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
                  <span className="text-sm font-medium text-gray-500">{wassceSubjects.length} subjects</span>
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
      </div>
    </>
  );
}