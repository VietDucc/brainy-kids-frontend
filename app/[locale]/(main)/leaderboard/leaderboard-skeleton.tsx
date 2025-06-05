export function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="relative bg-gray-200 dark:bg-gray-700 rounded-3xl p-12 mb-8">
          <div className="flex justify-around items-end">
            {/* Second Place */}
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-white mb-4"></div>
              <div className="text-center space-y-2">
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              </div>
              <div className="mt-4 h-14 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center -mt-8">
              <div className="h-32 w-32 bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-yellow-400 mb-4"></div>
              <div className="text-center space-y-2">
                <div className="h-6 w-36 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              </div>
              <div className="mt-4 h-16 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 rounded-full border-4 border-white mb-4"></div>
              <div className="text-center space-y-2">
                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
                <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
              </div>
              <div className="mt-4 h-14 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>

        {/* Rest of Users List */}
        <div className="bg-card rounded-3xl shadow-sm">
          <div className="p-6">
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-center p-4 rounded-2xl">
                  <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-4"></div>
                  <div className="flex-grow">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
