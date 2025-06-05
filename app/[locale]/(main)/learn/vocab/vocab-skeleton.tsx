export function VocabSkeleton() {
  return (
    <div className="h-[calc(100vh-6rem)] bg-[url('/images/kids-pattern.png')] dark:bg-gray-900 flex flex-col relative overflow-hidden p-4 md:p-0 animate-pulse">
      {/* Background decorations skeleton */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="absolute bottom-20 right-10">
          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="absolute top-1/3 right-20">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Title section skeleton */}
        <div className="text-center mb-6">
          <div className="h-9 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
          <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-center mb-6">
          <div className="h-14 w-full max-w-md bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg p-2">
            <div className="grid grid-cols-2 gap-2 h-full">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex flex-col items-center h-full">
              {/* Display mode controls skeleton */}
              <div className="flex items-center gap-3 text-sm mb-4">
                <div className="flex gap-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-md">
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              </div>

              {/* Flashcard skeleton */}
              <div className="flex-1 w-full max-w-lg px-4 flex items-center mt-4">
                <div className="w-full h-[300px] p-8 rounded-3xl shadow-xl bg-white/90 dark:bg-gray-800/90 border-4 border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center">
                  <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              {/* Navigation buttons skeleton */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex justify-center items-center gap-8">
                  <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg"></div>
                  <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative overview skeleton (if overview tab is selected) */}
      <div className="hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/90 dark:bg-gray-800/90 rounded-2xl border-2 border-gray-200 dark:border-gray-600 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicators */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Additional floating elements */}
      <div className="absolute top-1/4 left-4">
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/4">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="absolute top-1/2 right-4">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}
