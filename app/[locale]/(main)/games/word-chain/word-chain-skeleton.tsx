export function WordChainSkeleton() {
  return (
    <main className="flex min-h-screen flex-col animate-pulse">
      {/* Back button skeleton */}
      <div className="p-4">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Game content skeleton */}
      <div className="flex-1 p-4 sm:p-6">
        {/* Title skeleton */}
        <div className="text-center mb-8">
          <div className="h-10 w-80 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4"></div>
          <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
        </div>

        {/* Game board skeleton */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current word display */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 text-center">
            <div className="h-8 w-40 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
          </div>

          {/* Input area */}
          <div className="space-y-4">
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          </div>

          {/* Word history */}
          <div className="space-y-2">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>

          {/* Score display */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-8 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="fixed top-24 right-8 opacity-20 pointer-events-none">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
      </div>
      <div className="fixed bottom-32 left-12 opacity-20 pointer-events-none">
        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
      </div>
    </main>
  );
}
