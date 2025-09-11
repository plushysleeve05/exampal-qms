// PaginationTest.tsx
import React, { useState, useEffect } from 'react';
import { fetchFilteredQuestions, QuestionFilterParams } from '../../../api/questionsApi';
import { ExamType } from '../../../api/types';

const PaginationTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [questions, setQuestions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });

  const fetchPageData = async (page: number) => {
    setIsLoading(true);
    try {
      // Sample filter params
      const filterParams: QuestionFilterParams = {
        examtype: 'GCSE' as ExamType,
        subject: 'Mathematics'
      };

      const response = await fetchFilteredQuestions({
        ...filterParams,
        page: page,
        pageSize: itemsPerPage
      });

      setQuestions(response.questions);
      setPagination(response.pagination);
      setCurrentPage(response.pagination.currentPage);
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load first page when component mounts
    fetchPageData(0);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pagination Test</h1>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Page {pagination.currentPage + 1} of {pagination.totalPages} (Total items: {pagination.totalItems})
            </p>
          </div>

          <div className="border rounded-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.examYear}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.examSection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <label className="mr-2 text-sm">Items per page:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  fetchPageData(0);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => fetchPageData(0)}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded ${
                  currentPage === 0 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'
                }`}
              >
                First
              </button>
              <button
                onClick={() => fetchPageData(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-1 rounded ${
                  currentPage === 0 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'
                }`}
              >
                Previous
              </button>
              
              {[...Array(pagination.totalPages)].map((_, idx) => {
                if (
                  idx === 0 ||
                  idx === pagination.totalPages - 1 ||
                  (idx >= currentPage - 1 && idx <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={idx}
                      onClick={() => fetchPageData(idx)}
                      className={`px-3 py-1 rounded ${
                        currentPage === idx ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                } else if (
                  (idx === 1 && currentPage > 2) ||
                  (idx === pagination.totalPages - 2 && currentPage < pagination.totalPages - 3)
                ) {
                  return <span key={idx} className="px-2">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => fetchPageData(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages - 1}
                className={`px-3 py-1 rounded ${
                  currentPage >= pagination.totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'
                }`}
              >
                Next
              </button>
              <button
                onClick={() => fetchPageData(pagination.totalPages - 1)}
                disabled={currentPage >= pagination.totalPages - 1}
                className={`px-3 py-1 rounded ${
                  currentPage >= pagination.totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'
                }`}
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginationTest;
