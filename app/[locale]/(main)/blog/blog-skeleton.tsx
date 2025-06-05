export function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="mt-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border shadow-sm overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>

                {/* Content lines */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>

                {/* Author and date */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
