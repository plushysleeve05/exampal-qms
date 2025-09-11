// Skeleton loader for the question table
export default function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 mb-2 rounded-md"></div>
      
      {/* Row skeletons */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex space-x-2 mb-3">
          <div className="h-16 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-16 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-16 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-16 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-16 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-16 flex-1 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-16 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      ))}
    </div>
  );
}
