import React from 'react';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';

// Icon components for statistics cards
const UserIcon = () => (
  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

const ParentIcon = () => (
  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  </div>
);

const PrincipalIcon = () => (
  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  </div>
);

const StudentIcon = () => (
  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  </div>
);

const SchoolIcon = () => (
  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  </div>
);

const TeacherIcon = () => (
  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

const ChildrenIcon = () => (
  <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  </div>
);

interface StatisticCardProps {
  title: string;
  count: number;
  change: { value: number; isUp: boolean };
  icon: React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ title, count, change, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{count.toLocaleString()}</p>
          <div className="flex items-center mt-1">
            <span className={`text-xs ${change.isUp ? 'text-green-500' : 'text-red-500'} font-medium`}>
              {change.isUp ? `↑ ${change.value}% Up` : `↓ ${change.value}% Down`} from yesterday
            </span>
          </div>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const UsersList: React.FC = () => {
  return (
    <div className="w-full">
      <PageBreadCrumb pageTitle="Users List" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all User activities here</p>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatisticCard 
            title="Total User" 
            count={40689} 
            change={{value: 5, isUp: true}} 
            icon={<UserIcon />} 
          />
          <StatisticCard 
            title="Total Parents" 
            count={40689} 
            change={{value: 3, isUp: true}} 
            icon={<ParentIcon />} 
          />
          <StatisticCard 
            title="Total Principals" 
            count={86756} 
            change={{value: 2.9, isUp: false}} 
            icon={<PrincipalIcon />} 
          />
          <StatisticCard 
            title="Total Ex Students" 
            count={89000} 
            change={{value: 9, isUp: true}} 
            icon={<StudentIcon />} 
          />
          <StatisticCard 
            title="Total Schools" 
            count={56789} 
            change={{value: 5, isUp: true}} 
            icon={<SchoolIcon />} 
          />
          <StatisticCard 
            title="Total Teachers" 
            count={34678} 
            change={{value: 1.5, isUp: false}} 
            icon={<TeacherIcon />} 
          />
          <StatisticCard 
            title="Total Students" 
            count={78905} 
            change={{value: 8.5, isUp: true}} 
            icon={<StudentIcon />} 
          />
          <StatisticCard 
            title="Total Children" 
            count={40689} 
            change={{value: 5, isUp: true}} 
            icon={<ChildrenIcon />} 
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">User List</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
              Add New User
            </button>
          </div>
          
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative w-full md:w-96 bg-gray-100 dark:bg-gray-700 rounded-full">
              <input 
                type="text" 
                placeholder="Search User list..." 
                className="w-full pl-5 pr-10 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    First Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    School
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Phone No
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Index No
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Account Type
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Sample data - would be replaced with real data */}
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">1</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Alice</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Brown</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">alice.brown@example.com</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Greenwood High</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">10A</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">+1234567890</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">STU12345</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Student</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Basic</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">2</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">John</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Doe</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">john.doe@example.com</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Riverview Academy</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">5B</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">+9876543210</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">PAR67890</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Parent</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Standard</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">3</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Grace</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Hill</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">grace.hill@example.com</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"></td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"></td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">+5566778899</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"></td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Principal</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Enterprise</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">4</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Emma</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Clark</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">emma.clark@example.com</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Bright Futures Academy</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">7C</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">+1230984567</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">PARSTU123</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Parent_Student</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Standard</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">5</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Henry</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Adams</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">henry.adams@example.com</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">16/09/2025</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Academy of Excellence</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white"></td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">+1234509876</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">EXAM67890</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Examiner</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">Basic</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                Rows per page:
              </label>
              <select className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700">
                <option>100</option>
                <option>50</option>
                <option>25</option>
                <option>10</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page <span className="font-medium">1</span> of <span className="font-medium">1</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="p-1 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;