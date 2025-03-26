"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, InfinityIcon, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UserProgressProps {
  activeCourse: {
    id: number;
    title: string;
    imageSrc: string;
  };
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
}

export const UserProgress = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}: UserProgressProps) => {
  const [courseInfo, setCourseInfo] = useState(activeCourse);

  useEffect(() => {
    try {
      const storedCourse = localStorage.getItem("activeCourse");
      if (storedCourse) {
        const parsedCourse = JSON.parse(storedCourse);
        if (
          parsedCourse &&
          parsedCourse.id &&
          parsedCourse.title &&
          parsedCourse.imageSrc
        ) {
          setCourseInfo(parsedCourse);
        }
      }
    } catch (error) {
      console.error("Error parsing stored course:", error);
    }
  }, []);

  return (
    <div className="h-full w-full min-w-[270px] max-w-[340px] rounded-xl border-2 border-slate-200 dark:border-slate-700 p-5 shadow-md bg-white dark:bg-slate-900">
      <div className="flex items-center gap-x-2">
        <Image
          src={courseInfo.imageSrc}
          alt={courseInfo.title}
          height={40}
          width={40}
          className="object-cover"
        />
        <div>
          <p className="font-bold text-slate-700 dark:text-slate-200">
            {courseInfo.title}
          </p>
          <div className="flex items-center gap-x-2">
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {points} XP
            </p>
            <div className="h-2 w-2 rounded-full bg-primary" />
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Level 1
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Daily Goal
            </p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              50 / 100 XP
            </p>
          </div>
          <Progress value={50} className="h-3" />
        </div>

        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Hearts</p>
          <div className="flex items-center gap-x-1 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md">
            {hasActiveSubscription ? (
              <InfinityIcon className="h-4 w-4 text-rose-500" />
            ) : (
              <p className="text-rose-600 dark:text-rose-400 font-medium">
                {hearts}
              </p>
            )}
            <Heart className="h-4 w-4 text-rose-500" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Streak</p>
          <div className="flex items-center gap-x-1 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">
            <p className="text-orange-600 dark:text-orange-400 font-medium">
              3
            </p>
            <Image src="/streak.svg" height={20} width={20} alt="Streak" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Achievements
          </p>
          <div className="flex items-center gap-x-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
              12
            </p>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </div>
        </div>

        <Link href="/shop">
          <Button variant="default" className="w-full mt-4" size="sm">
            Visit Shop
          </Button>
        </Link>

        <Link href="/quests">
          <Button className="w-full mt-4" variant="outline" size="sm">
            Daily Quests
          </Button>
        </Link>
      </div>
    </div>
  );
};
