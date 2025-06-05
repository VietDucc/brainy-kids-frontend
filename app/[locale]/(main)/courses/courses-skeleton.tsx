export function CoursesSkeleton() {
  return (
    <div className="mx-auto h-full max-w-[1200px] px-3 py-6 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="relative mb-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300 dark:bg-gray-600 opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            {/* Title skeleton */}
            <div className="h-8 md:h-10 w-80 md:w-96 bg-gray-300 dark:bg-gray-600 rounded-lg mb-2"></div>
            {/* Subtitle skeleton */}
            <div className="h-4 w-72 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          {/* Section Header Skeleton */}
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gray-200 dark:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="h-7 md:h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>

          {/* Separator skeleton */}
          <div className="my-4 h-1 bg-gray-200 dark:bg-gray-700 rounded"></div>

          {/* Courses Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex h-full min-h-[200px] min-w-[200px] flex-col items-center justify-between rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 pb-6 shadow-lg bg-white dark:bg-gray-800"
              >
                {/* Top section for check icon */}
                <div className="flex min-h-[24px] w-full items-center justify-end">
                  <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>

                {/* Image placeholder */}
                <div className="relative flex items-center justify-center w-full h-[100px] mb-4">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full opacity-30 blur-md"></div>
                  <div className="relative z-10 w-28 h-24 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                </div>

                {/* Title skeleton */}
                <div className="mt-4 text-center w-full">
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-1"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Additional floating skeleton elements for visual appeal */}
      <div className="fixed top-20 right-10 opacity-20 pointer-events-none">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
      </div>
      <div className="fixed bottom-32 left-8 opacity-20 pointer-events-none">
        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
      </div>
      <div className="fixed top-1/3 left-16 opacity-20 pointer-events-none">
        <div
          className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
}
