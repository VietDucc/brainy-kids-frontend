import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBackToUnits?: boolean;
}

export const Header = ({ title, onBack, showBackToUnits }: HeaderProps) => {
  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-950 pb-3 text-neutral-400 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      {showBackToUnits ? (
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <ArrowLeft className="h-5 w-5 stroke-2" />
          <span>Back to Units</span>
        </Button>
      ) : (
        <Link href="/courses">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ArrowLeft className="h-5 w-5 stroke-2" />
            <span>Courses</span>
          </Button>
        </Link>
      )}
      <h1 className="text-lg font-bold text-slate-700 dark:text-slate-200">
        {title}
      </h1>
      <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md">
        <Heart className="h-4 w-4 text-rose-500" />
        <span className="text-rose-600 dark:text-rose-400 font-medium">5</span>
      </div>
    </div>
  );
};
