export function GamesSkeleton() {
  return (
    <div className="h-full p-6 space-y-8 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Games Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="p-6 space-y-4">
              {/* Icon skeleton */}
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

              {/* Content skeleton */}
              <div className="space-y-2">
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="space-y-1">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>

            {/* Coming soon badge skeleton (for some cards) */}
            {index >= 2 && (
              <div className="absolute top-3 right-3">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional floating skeleton elements for visual appeal */}
      <div className="fixed top-32 right-8 opacity-20 pointer-events-none">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
      </div>
      <div className="fixed bottom-40 left-12 opacity-20 pointer-events-none">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
      </div>
      <div className="fixed top-1/2 right-20 opacity-20 pointer-events-none">
        <div
          className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}
