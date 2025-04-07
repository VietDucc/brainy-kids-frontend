import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center flex-col gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary border-opacity-20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">
        Đang tải bài học...
      </p>
    </div>
  );
};

export default Loading;
