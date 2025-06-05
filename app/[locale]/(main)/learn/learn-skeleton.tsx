export function LearnSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row-reverse gap-[48px] px-6 animate-pulse">
      {/* Sticky Wrapper - Right Side */}
      <div className="lg:w-[368px] lg:sticky lg:self-start lg:top-6">
        <div className="min-h-[calc(100vh-48px)] lg:min-h-fit space-y-4">
          {/* User Progress Card */}
          <div className="bg-card rounded-2xl border-2 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Additional Sidebar Content */}
          <div className="bg-card rounded-2xl border-2 shadow-sm p-4">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feed Wrapper - Left Side */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 mb-8 pb-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Unit Title */}
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

          {/* Lesson Cards */}
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl border-2 p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              >
                {/* Lesson Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>

                {/* Lesson Content */}
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                {/* Status Icon */}
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Unit Grid (for units view) */}
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Section */}
          <div className="bg-card rounded-xl border-2 p-6 mt-8">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
