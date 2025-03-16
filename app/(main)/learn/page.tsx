"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { LessonCard } from "./lesson-card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Unit } from "./unit";

// Định nghĩa các kiểu dữ liệu dựa trên API response
interface ChallengeOption {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string;
  audioSrc: string;
}

interface ChallengeProgress {
  id: number;
  userId: string;
  completed: boolean;
}

interface Challenge {
  id: number;
  type: string;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
  challengesProgress: ChallengeProgress[];
}

interface Lesson {
  id: number;
  title: string;
  orderIndex: number;
  challenges: Challenge[];
}

interface Unit {
  id: number;
  title: string;
  description: string;
  orderUnit: number;
  lessons: Lesson[];
}

interface UserProgressData {
  activeCourse: {
    id: number;
    title: string;
    imageSrc: string;
  };
  hearts: number;
  points: number;
}

const LearnPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProgressData, setUserProgressData] =
    useState<UserProgressData | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProgressResponse = await fetch("/api/user-progress");
        if (!userProgressResponse.ok) {
          throw new Error("Failed to fetch user progress");
        }
        const userProgress = await userProgressResponse.json();
        setUserProgressData(userProgress);

        const courseId = userProgress.activeCourse.id;
        const unitsResponse = await fetch(`/api/units/${courseId}`);
        if (!unitsResponse.ok) {
          throw new Error("Failed to fetch course units");
        }
        const unitsData = await unitsResponse.json();
        setUnits(unitsData);
      } catch {
        setError("Failed to load course data. Please try again later.");
        toast.error("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userProgressData || !userProgressData.activeCourse) {
    redirect("/courses");
  }

  const getLessonStatus = (
    lesson: Lesson
  ): "locked" | "available" | "completed" => {
    if (!lesson.challenges || lesson.challenges.length === 0) {
      return "locked";
    }

    const allCompleted = lesson.challenges.every(
      (challenge) =>
        challenge.challengesProgress &&
        challenge.challengesProgress.some((progress) => progress.completed)
    );

    if (allCompleted) {
      return "completed";
    }

    return "available";
  };

  const getLessonIcon = (lesson: Lesson): string => {
    if (lesson.title.toLowerCase().includes("noun")) return "📝";
    if (lesson.title.toLowerCase().includes("verb")) return "🏃";
    if (lesson.title.toLowerCase().includes("adjective")) return "🌈";
    if (lesson.title.toLowerCase().includes("pronoun")) return "👤";
    if (lesson.title.toLowerCase().includes("adverb")) return "⏱️";
    if (lesson.title.toLowerCase().includes("preposition")) return "📍";
    if (lesson.title.toLowerCase().includes("conjunction")) return "🔗";
    if (lesson.title.toLowerCase().includes("interjection")) return "😲";

    return "📚";
  };

  const handleLessonClick = (unitId: number, lesson: Lesson) => {
    setSelectedUnitId(unitId);
    if (lesson.challenges && lesson.challenges.length > 0) {
      const completedChallenges = lesson.challenges.filter(
        (challenge) =>
          challenge.challengesProgress &&
          challenge.challengesProgress.some((progress) => progress.completed)
      ).length;

      console.log(
        `Completed ${completedChallenges} out of ${lesson.challenges.length} challenges`
      );
    }
  };

  const handleBackToUnits = () => {
    setSelectedUnitId(null);
  };

  // Nếu đã chọn một unit, hiển thị giao diện unit
  if (selectedUnitId !== null) {
    const selectedUnit = units.find((unit) => unit.id === selectedUnitId);

    if (!selectedUnit) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <p>Unit not found</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:flex-row-reverse gap-[48px] px-6">
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgressData.activeCourse}
            hearts={userProgressData.hearts}
            points={userProgressData.points}
            hasActiveSubscription={false}
          />
        </StickyWrapper>
        <FeedWrapper>
          <Header
            title={userProgressData.activeCourse.title}
            onBack={handleBackToUnits}
            showBackToUnits
          />
          <div className="mt-8">
            <Unit
              id={selectedUnit.id}
              orderUnit={selectedUnit.orderUnit}
              title={selectedUnit.title}
              lessons={selectedUnit.lessons || []}
            />
          </div>
        </FeedWrapper>
      </div>
    );
  }

  // Hiển thị danh sách các unit và lesson
  return (
    <div className="flex flex-col lg:flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgressData.activeCourse}
          hearts={userProgressData.hearts}
          points={userProgressData.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgressData.activeCourse.title} />
        <div className="space-y-8 mt-8">
          {units.length > 0 ? (
            units.map((unit) => (
              <div key={unit.id} className="space-y-3">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                  {unit.title}
                </h3>
                {unit.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {unit.description}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4">
                  {unit.lessons && unit.lessons.length > 0 ? (
                    unit.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        id={lesson.id}
                        title={lesson.title}
                        description={`${
                          lesson.challenges?.length || 0
                        } challenges`}
                        status={getLessonStatus(lesson)}
                        icon={getLessonIcon(lesson)}
                        onClick={() => handleLessonClick(unit.id, lesson)}
                      />
                    ))
                  ) : (
                    <p className="text-sm italic text-slate-500 dark:text-slate-400">
                      No lessons available in this unit yet.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-slate-500 dark:text-slate-400">
                No units available for this course yet.
              </p>
            </div>
          )}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
