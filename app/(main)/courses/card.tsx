import { Check } from "lucide-react";
import Image from "next/image";

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
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "flex h-full min-h-[200px] min-w-[200px] cursor-pointer flex-col items-center justify-between rounded-xl border-2 border-b-[4px] p-4 pb-6 shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800 active:border-b-2",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="flex min-h-[24px] w-full items-center justify-end">
        {isActive && (
          <div className="flex items-center justify-center rounded-full bg-primary p-2">
            <Check className="h-5 w-5 stroke-[4] text-white" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-center w-full h-[80px]">
        <Image
          src={imageSrc}
          alt={title}
          height={80}
          width={100}
          className="object-cover"
        />
      </div>

      <p className="mt-4 text-center text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </p>
    </div>
  );
};
