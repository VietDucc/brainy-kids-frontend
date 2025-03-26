"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { LessonCard } from "./lesson-card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ChallengeScreen } from "./challenge-screen";
import { transformLessonData } from "@/utils/transform-lesson-data";
import { LessonType } from "@/types/learn";
import { useAuth } from "@clerk/nextjs";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userProgressData, setUserProgressData] =
    useState<UserProgressData | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [completedLessonId, setCompletedLessonId] = useState<number[]>();
  const { userId } = useAuth();
  const [loadingLessonId, setLoadingLessonId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProgressResponse = await fetch("/api/user-progress");
        if (!userProgressResponse.ok) {
          throw new Error("Failed to fetch user progress");
        }
        const userProgress = await userProgressResponse.json();

        let activeCourse = userProgress.activeCourse;
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
              activeCourse = parsedCourse;
            }
          }
        } catch (error) {
          console.error("Error parsing stored course:", error);
        }

        setUserProgressData({
          ...userProgress,
          activeCourse: activeCourse,
        });

        const clerkUserId = userId;
        const completedLessonResponse = await fetch(
          `/api/lesson-progress/${clerkUserId}`
        );
        if (completedLessonResponse.ok) {
          const completedLessons = await completedLessonResponse.json();
          const lessonIds = completedLessons.map((lesson) => lesson.lessonId);
          setCompletedLessonId(lessonIds);
        }
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
  }, [userId]);

  useEffect(() => {
    const unitId = searchParams.get("unitId");
    if (unitId) {
      setSelectedUnitId(parseInt(unitId, 10));
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-primary border-opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">
          Đang tải bài học...
        </p>
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
    if (completedLessonId && completedLessonId.includes(lesson.id)) {
      return "completed";
    }

    if (!lesson.challenges || lesson.challenges.length === 0) {
      return "locked";
    }

    return "available";
  };

  const getLessonStatusDescription = (
    status: "locked" | "available" | "completed",
    orderIndex: number,
    challengesCount: number
  ): string => {
    switch (status) {
      case "completed":
        return `✅ Completed! ${challengesCount} challenges in lesson! 🌟`;
      case "available":
        return ` ${challengesCount} fun ${
          challengesCount === 1 ? "challenge" : "challenges"
        } 🎮`;
      case "locked":
        return "🔒 Coming soon • New adventures await!";
    }
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

  const handleLessonClick = async (lessonId: number) => {
    try {
      setIsLoadingLesson(true);
      setLoadingLessonId(lessonId);
      setError(null);
      const response = await fetch(`/api/lessons/${lessonId}`);

      if (!response.ok) {
        throw new Error(`Failed to load lesson ${lessonId}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      const lessonData = transformLessonData(data, lessonId);

      if (!lessonData.challenges || lessonData.challenges.length === 0) {
        setError("This lesson doesn't have any challenges yet.");
        setSelectedLesson(null);
      } else {
        setSelectedLesson(lessonData);
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      setError("Failed to load lesson. Please try again.");
    } finally {
      setIsLoadingLesson(false);
      setLoadingLessonId(null);
    }
  };

  const handleBackToUnits = () => {
    router.push("/learn");
    setSelectedUnitId(null);
    setSelectedLesson(null);
  };

  const updateCompletedLesson = (completedLessonId: number) => {
    setCompletedLessonId((prev) => {
      if (prev && prev.includes(completedLessonId)) {
        return prev;
      }
      return prev ? [...prev, completedLessonId] : [completedLessonId];
    });

    setUserProgressData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        points: prev.points + 10,
      };
    });

    toast.success("Bài học đã hoàn thành!", {
      description: "Tiến trình của bạn đã được cập nhật",
      icon: "🎉",
    });
  };

  const handleChallengeComplete = (completedLessonId?: number) => {
    if (completedLessonId) {
      updateCompletedLesson(completedLessonId);
    }

    setSelectedLesson(null);
    window.location.href = "/learn";
  };

  const handleExitChallenge = () => {
    setSelectedLesson(null);
  };

  if (isLoadingLesson) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
            Loading lesson...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
            {error}
          </h2>
          <button
            onClick={handleBackToUnits}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to units
          </button>
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 overflow-auto">
        <ChallengeScreen
          challenges={selectedLesson.challenges}
          onComplete={handleChallengeComplete}
          lessonTitle={selectedLesson.title}
          onExit={handleExitChallenge}
          lessonId={selectedLesson.id}
        />
      </div>
    );
  }

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
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
              {selectedUnit.title}
            </h2>

            {selectedUnit.lessons.map((lesson) => {
              const status = getLessonStatus(lesson);
              const challengesCount = lesson.challenges?.length || 0;
              const statusDescription = getLessonStatusDescription(
                status,
                lesson.orderIndex,
                challengesCount
              );
              const isCurrentLessonLoading = loadingLessonId === lesson.id;

              return (
                <LessonCard
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  description={statusDescription}
                  status={status}
                  icon={getLessonIcon(lesson)}
                  onClick={status !== "locked" ? handleLessonClick : undefined}
                  isLoading={isCurrentLessonLoading}
                />
              );
            })}
          </div>
        </FeedWrapper>
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
                    unit.lessons.map((lesson) => {
                      const status = getLessonStatus(lesson);
                      const challengesCount = lesson.challenges?.length || 0;
                      const statusDescription = getLessonStatusDescription(
                        status,
                        lesson.orderIndex,
                        challengesCount
                      );
                      const isCurrentLessonLoading =
                        loadingLessonId === lesson.id;

                      return (
                        <LessonCard
                          key={lesson.id}
                          id={lesson.id}
                          title={lesson.title}
                          description={statusDescription}
                          status={status}
                          icon={getLessonIcon(lesson)}
                          onClick={
                            status !== "locked"
                              ? () => handleLessonClick(lesson.id)
                              : undefined
                          }
                          isLoading={isCurrentLessonLoading}
                        />
                      );
                    })
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
