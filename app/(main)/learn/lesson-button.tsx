"use client";

import { Check, Crown, Star } from "lucide-react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

export type LessonButtonProps = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
  onClick?: () => void;
};

export const LessonButton = ({
  index,
  totalCount,
  locked,
  current,
  percentage,
  onClick,
}: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  const Icon = isCompleted ? Check : isLast ? Crown : Star;

  const handleClick = () => {
    if (locked) return;
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer",
        locked && "cursor-not-allowed opacity-70"
      )}
      style={{
        right: `${rightPosition}px`,
        marginTop: isFirst && !isCompleted ? 60 : 24,
      }}
    >
      {current ? (
        <div className="relative h-[102px] w-[102px]">
          <div className="absolute -top-6 left-2.5 z-10 animate-bounce rounded-xl border-2 bg-white px-3 py-2.5 font-bold uppercase tracking-wide text-green-500">
            Start
            <div
              className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 transform border-x-8 border-t-8 border-x-transparent"
              aria-hidden
            />
          </div>
          <CircularProgressbarWithChildren
            value={Number.isNaN(percentage) ? 0 : percentage}
            styles={{
              path: {
                stroke: "#4ade80",
              },
              trail: {
                stroke: "#e5e7eb",
              },
            }}
          >
            <Button
              variant={locked ? "outline" : "default"}
              className="h-[70px] w-[70px] border-b-8 rounded-full"
            >
              <Icon
                className={cn(
                  "h-10 w-10",
                  locked
                    ? "fill-neutral-400 stroke-neutral-400 text-neutral-400"
                    : "fill-primary-foreground text-primary-foreground",
                  isCompleted && "fill-none stroke-[4]"
                )}
              />
            </Button>
          </CircularProgressbarWithChildren>
        </div>
      ) : (
        <Button
          variant={locked ? "outline" : "default"}
          className="h-[70px] w-[70px] border-b-8 rounded-full"
        >
          <Icon
            className={cn(
              "h-10 w-10",
              locked
                ? "fill-neutral-400 stroke-neutral-400 text-neutral-400"
                : "fill-primary-foreground text-primary-foreground",
              isCompleted && "fill-none stroke-[4]"
            )}
          />
        </Button>
      )}
    </div>
  );
};
