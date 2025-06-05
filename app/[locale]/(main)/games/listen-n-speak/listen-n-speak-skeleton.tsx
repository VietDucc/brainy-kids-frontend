export function ListenNSpeakSkeleton() {
  return (
    <div className="h-full p-4 sm:p-6 space-y-6 sm:space-y-8 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="space-y-2">
        <div className="text-center mb-8 sm:mb-12">
          {/* Back button skeleton */}
          <div className="flex justify-center mb-4">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Title skeleton */}
          <div className="h-10 sm:h-12 w-80 sm:w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-2 sm:mb-4"></div>

          {/* Subtitle skeleton */}
          <div className="h-5 sm:h-6 w-72 sm:w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
        </div>
      </div>

      {/* Categories Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[180px] sm:h-[220px] lg:h-[250px] p-4 sm:p-6"
          >
            {/* Icon skeleton */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 dark:bg-gray-600 rounded-lg mb-2 sm:mb-4"></div>

            {/* Title skeleton */}
            <div className="h-6 sm:h-7 lg:h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-1 sm:mb-2"></div>

            {/* Description skeleton */}
            <div className="space-y-1 sm:space-y-2">
              <div className="h-4 sm:h-5 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 sm:h-5 w-2/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>

            {/* Words count skeleton */}
            <div className="mt-2 sm:mt-4">
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional floating skeleton elements */}
      <div className="fixed top-28 right-6 opacity-20 pointer-events-none">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
      </div>
      <div className="fixed bottom-36 left-8 opacity-20 pointer-events-none">
        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
