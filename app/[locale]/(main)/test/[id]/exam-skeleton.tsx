export function ExamSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-2 mb-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

              {/* Questions */}
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, questionIndex) => (
                  <div key={questionIndex} className="border rounded-lg p-4">
                    <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>

                    {/* Answer Options */}
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-3"
                        >
                          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Part Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, partIndex) => (
                <div key={partIndex}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>

                  <div className="grid grid-cols-5 gap-1 mb-4">
                    {Array.from({ length: 10 }).map((_, qIndex) => (
                      <div
                        key={qIndex}
                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>

              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
