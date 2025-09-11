import PageMeta from "../components/common/PageMeta";

export default function ExamSections() {
  return (
    <>
      <PageMeta
        title="ExamPal QMS - Exam Sections"
        description="Manage exam sections in the ExamPal Question Management System"
      />
      
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Sections</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage different sections within exams
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">English Language</h3>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Section A: Grammar | Section B: Comprehension | Section C: Essay</p>
                  </div>
                </div>
              </div>
            </li>
            
            <li>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mathematics</h3>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Section A: Objective | Section B: Theory</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
