import React from 'react';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';

const Analytics: React.FC = () => {
  return (
    <div className="w-full">
      <PageBreadCrumb pageTitle="Analytics" />
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h1>
        
        {/* Date Range Filter */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filter Data</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                  <input type="date" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                  <input type="date" className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filters
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white">
                    <option>All Exam Types</option>
                    <option>BECE</option>
                    <option>WASSCE</option>
                    <option>NOVDEC</option>
                  </select>
                </div>
                <div>
                  <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white">
                    <option>All Subjects</option>
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Science</option>
                    <option>Social Studies</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Analytics Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Questions Added Over Time</h3>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Area chart visualization will appear here<br />
                (Implement with chart library like Chart.js)
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Questions by Subject</h3>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Bar chart visualization will appear here<br />
                (Implement with chart library like Chart.js)
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Activity Distribution</h3>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Pie chart visualization will appear here<br />
                (Implement with chart library like Chart.js)
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Peak Usage Hours</h3>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Heat map visualization will appear here<br />
                (Implement with chart library like Chart.js)
              </p>
            </div>
          </div>
        </div>
        
        {/* Data Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Key Metrics Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-base font-medium text-gray-800 dark:text-white mb-4">Content Growth</h4>
              <dl>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Questions added this month</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">246</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Questions updated this month</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">128</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Average questions per day</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">8.2</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Growth rate</dt>
                  <dd className="text-sm font-medium text-green-600 dark:text-green-400">+12.4%</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-800 dark:text-white mb-4">User Engagement</h4>
              <dl>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Active users this month</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">142</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Average session duration</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">24 min</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Most active role</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">Content Managers</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">New users</dt>
                  <dd className="text-sm font-medium text-green-600 dark:text-green-400">+15</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h4 className="text-base font-medium text-gray-800 dark:text-white mb-4">Performance Metrics</h4>
              <dl>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Average response time</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">245 ms</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">API calls per minute</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">124</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Error rate</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">0.3%</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">System uptime</dt>
                  <dd className="text-sm font-medium text-green-600 dark:text-green-400">99.8%</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;