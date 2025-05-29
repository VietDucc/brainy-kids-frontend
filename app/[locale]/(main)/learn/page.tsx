"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { LessonCard } from "./lesson-card";
import { toast } from "sonner";
import { ChallengeScreen } from "./challenge-screen";
import { transformLessonData } from "@/utils/transform-lesson-data";
import { LessonType } from "@/types/learn";
import { useAuth } from "@clerk/nextjs";
import Loading from "@/app/loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, PenSquare } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  orderLesson: number;
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
  const { t } = useTranslation("learn");
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
  const [showLearningOptions, setShowLearningOptions] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

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
        setError(t("errors.load_course"));
        toast.error(t("errors.load_course"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, t]);

  useEffect(() => {
    const unitId = searchParams.get("unitId");
    if (unitId) {
      setSelectedUnitId(parseInt(unitId, 10));
    }
  }, [searchParams]);

  if (isLoading) {
    return <Loading text="courses" />;
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          {t("actions.try_again")}
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

    // Since challenges are no longer part of the initial response,
    // we'll consider all lessons as available by default
    return "available";
  };

  const getLessonStatusDescription = (
    status: "locked" | "available" | "completed",
    orderLesson: number
  ): string => {
    switch (status) {
      case "completed":
        return t("status.completed");
      case "available":
        return `${t("status.lesson")} ${orderLesson}`;
      case "locked":
        return t("status.locked");
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
    setSelectedLessonId(lessonId);
    setShowLearningOptions(true);
  };

  const handleStartChallenge = async () => {
    if (!selectedLessonId) return;

    try {
      setIsLoadingLesson(true);
      setLoadingLessonId(selectedLessonId);
      setError(null);
      const response = await fetch(`/api/lessons/${selectedLessonId}`);

      if (!response.ok) {
        throw new Error(t("errors.load_lesson"));
      }

      const data = await response.json();

      if (!data.challenges || data.challenges.length === 0) {
        setError(t("errors.no_challenges"));
        setSelectedLesson(null);
        setShowLearningOptions(false);
        setLoadingLessonId(null);
        setIsLoadingLesson(false);
        return;
      }

      const lessonData = transformLessonData(
        [
          {
            id: selectedLessonId,
            title:
              units
                .flatMap((u) => u.lessons)
                .find((l) => l.id === selectedLessonId)?.title ||
              `Lesson ${selectedLessonId}`,
            orderLesson:
              units
                .flatMap((u) => u.lessons)
                .find((l) => l.id === selectedLessonId)?.orderLesson || 0,
            challenges: data.challenges,
          },
        ],
        selectedLessonId
      );

      console.log("Transformed Data:", lessonData); // Debug log
      setSelectedLesson(lessonData);
    } catch (error) {
      console.error("Error loading lesson:", error);
      setError(t("errors.load_lesson"));
    } finally {
      setIsLoadingLesson(false);
      setLoadingLessonId(null);
      setShowLearningOptions(false);
    }
  };

  const handleStartVocabulary = () => {
    if (!selectedLessonId) return;
    router.push(`/vocab?lessonId=${selectedLessonId}`);
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
  };

  const handleExitChallenge = () => {
    setSelectedLesson(null);
  };

  if (isLoadingLesson) {
    return <Loading text="lesson" />;
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
            {t("actions.back_to_units")}
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
          <p>{t("errors.unit_not_found")}</p>
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
              const statusDescription = getLessonStatusDescription(
                status,
                lesson.orderLesson
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
    <>
      <Dialog open={showLearningOptions} onOpenChange={setShowLearningOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {t("learning_options.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button
              onClick={handleStartVocabulary}
              className="flex items-center gap-2 py-6"
            >
              <BookOpen className="h-5 w-5" />
              {t("learning_options.vocabulary")}
            </Button>
            <Button
              onClick={handleStartChallenge}
              className="flex items-center gap-2 py-6"
            >
              <PenSquare className="h-5 w-5" />
              {t("learning_options.exercises")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                        const statusDescription = getLessonStatusDescription(
                          status,
                          lesson.orderLesson
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
                        {t("errors.no_lessons")}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-slate-500 dark:text-slate-400">
                  {t("errors.no_units")}
                </p>
              </div>
            )}
          </div>
        </FeedWrapper>
      </div>
    </>
  );
};

export default LearnPage;
