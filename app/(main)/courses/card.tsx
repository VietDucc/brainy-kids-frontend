import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  isActive?: boolean;
};

export const Card = ({
  title,
  id,
  imageSrc,
  onClick,
  disabled,
  isActive,
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex h-full min-h-[200px] min-w-[200px] cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-4 pb-6 shadow-lg transition-all duration-300",
        isActive
          ? "border-primary border-b-[6px] bg-blue-50 dark:bg-blue-950/30"
          : "border-gray-200 dark:border-gray-700 border-b-[4px]",
        isHovered &&
          "transform scale-105 rotate-1 bg-yellow-50 dark:bg-yellow-900/20",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex min-h-[24px] w-full items-center justify-end">
        {isActive && (
          <div
            className={`flex items-center justify-center rounded-full bg-primary p-2 ${
              isHovered ? "animate-bounce" : ""
            }`}
          >
            <Check className="h-5 w-5 stroke-[4] text-white" />
          </div>
        )}
      </div>

      <div
        className={`relative flex items-center justify-center w-full h-[100px] transition-transform duration-300 ${
          isHovered ? "scale-110" : ""
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-900 rounded-full opacity-30 blur-md"></div>
        <Image
          src={imageSrc}
          alt={title}
          height={90}
          width={110}
          className="relative z-10 object-contain drop-shadow-md"
        />
      </div>

      <div className="mt-4 text-center">
        <p
          className={`text-lg font-bold transition-all duration-300 ${
            isHovered
              ? "text-primary text-xl"
              : "text-neutral-800 dark:text-neutral-200"
          }`}
        >
          {title}
        </p>
        {isHovered && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 animate-pulse">
            Click to start learning!
          </p>
        )}
      </div>
    </div>
  );
};
