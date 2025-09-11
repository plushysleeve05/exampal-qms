import { useState } from 'react';
import { ApiTester } from './ApiTester';
import { ExamType } from './types';

/**
 * API Testing Page Component
 * This component provides UI for testing the API endpoints
 */
const ApiTestPage = () => {
  const {
    examYears,
    beceSubjects,
    wassceSubjects,
    topics,
    loading,
    errors,
    testExamYears,
    testBeceSubjects,
    testWassceSubjects,
    testTopics,
    runAllTests
  } = ApiTester();

  const [selectedExamType, setSelectedExamType] = useState<ExamType>('BECE');
  const [selectedSubject, setSelectedSubject] = useState('Integrated Science');

  // Run topic test with selected parameters
  const handleTestTopics = () => {
    testTopics(selectedExamType, selectedSubject);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Testing Page</h1>
      
      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Test Individual Endpoints</h2>
          <div className="space-y-2">
            <button 
              onClick={testExamYears} 
              disabled={loading.years}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading.years ? 'Loading...' : 'Test Exam Years API'}
            </button>
            
            <button 
              onClick={testBeceSubjects} 
              disabled={loading.beceSubjects}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading.beceSubjects ? 'Loading...' : 'Test BECE Subjects API'}
            </button>
            
            <button 
              onClick={testWassceSubjects} 
              disabled={loading.wassceSubjects}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading.wassceSubjects ? 'Loading...' : 'Test WASSCE Subjects API'}
            </button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Test Topics API</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Exam Type:</label>
              <select 
                value={selectedExamType} 
                onChange={(e) => setSelectedExamType(e.target.value as ExamType)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="BECE">BECE</option>
                <option value="WASSCE">WASSCE</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject:</label>
              <input 
                type="text" 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., Integrated Science"
              />
            </div>
            
            <button 
              onClick={handleTestTopics} 
              disabled={loading.topics}
              className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 disabled:opacity-50"
            >
              {loading.topics ? 'Loading...' : 'Test Topics API'}
            </button>
          </div>
        </div>
      </div>
      
      <button 
        onClick={runAllTests} 
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 mb-6"
      >
        Run All Tests
      </button>
      
      {/* Results Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Years Results */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center">
            <span>Exam Years</span>
            {loading.years && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Loading...</span>}
            {errors.years && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Error</span>}
          </h2>
          
          {errors.years ? (
            <div className="text-red-600 mt-2">{errors.years}</div>
          ) : examYears.length > 0 ? (
            <div className="mt-3 overflow-auto max-h-60">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {examYears.map((year, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No data yet. Click the test button to fetch exam years.</p>
          )}
        </div>
        
        {/* BECE Subjects Results */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center">
            <span>BECE Subjects</span>
            {loading.beceSubjects && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Loading...</span>}
            {errors.beceSubjects && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Error</span>}
          </h2>
          
          {errors.beceSubjects ? (
            <div className="text-red-600 mt-2">{errors.beceSubjects}</div>
          ) : beceSubjects.length > 0 ? (
            <div className="mt-3 overflow-auto max-h-60">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {beceSubjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.toLowerCase().replace(/ /g, '-')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No data yet. Click the test button to fetch BECE subjects.</p>
          )}
        </div>
        
        {/* WASSCE Subjects Results */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center">
            <span>WASSCE Subjects</span>
            {loading.wassceSubjects && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Loading...</span>}
            {errors.wassceSubjects && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Error</span>}
          </h2>
          
          {errors.wassceSubjects ? (
            <div className="text-red-600 mt-2">{errors.wassceSubjects}</div>
          ) : wassceSubjects.length > 0 ? (
            <div className="mt-3 overflow-auto max-h-60">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wassceSubjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.toLowerCase().replace(/ /g, '-')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No data yet. Click the test button to fetch WASSCE subjects.</p>
          )}
        </div>
        
        {/* Topics Results */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold flex items-center">
            <span>Topics</span>
            {loading.topics && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Loading...</span>}
            {errors.topics && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Error</span>}
          </h2>
          
          {errors.topics ? (
            <div className="text-red-600 mt-2">{errors.topics}</div>
          ) : topics.length > 0 ? (
            <div className="mt-3 overflow-auto max-h-60">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topics.map((topic, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No data yet. Click the test button to fetch topics.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
