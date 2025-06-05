export function TestSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="h-9 w-80 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2"></div>
        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
      </header>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-card rounded-lg border shadow-sm">
            {/* Card Header */}
            <div className="p-6 pb-3">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-3 flex-grow">
              <div className="flex items-center mb-4">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-6 pt-0">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
