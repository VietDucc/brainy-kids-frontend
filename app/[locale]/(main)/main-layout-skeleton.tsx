export function MainLayoutSkeleton() {
  return (
    <>
      {/* Mobile Header Skeleton */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-card animate-pulse">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:z-50 lg:w-[256px]">
        <div className="flex flex-col bg-card border-r animate-pulse">
          <div className="p-6">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>

            {/* Navigation Items */}
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-3">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="h-full lg:pl-[256px]">
        <div className="mx-auto h-full max-w-[1056px] pt-6 animate-pulse">
          <div className="px-6">
            {/* Header */}
            <div className="mb-8">
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
              <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
