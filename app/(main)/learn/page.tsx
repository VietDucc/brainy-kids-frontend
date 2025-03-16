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
import { Unit } from "./unit";
import { ChallengeScreen } from "./challenge-screen";
import { transformLessonData } from "@/utils/transform-lesson-data";
import { LessonType } from "@/types/learn";
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

  useEffect(() => {
    const unitId = searchParams.get("unitId");
    if (unitId) {
      setSelectedUnitId(parseInt(unitId, 10));
    }
  }, [searchParams]);

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

  const handleLessonClick = async (lessonId: number) => {
    try {
      setIsLoadingLesson(true);
      setError(null);

      // Gọi API để lấy dữ liệu lesson
      const response = await fetch(`/api/lessons/${lessonId}`);

      if (!response.ok) {
        throw new Error(`Failed to load lesson ${lessonId}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      // Chuyển đổi dữ liệu
      const lessonData = transformLessonData(data, lessonId);

      // Kiểm tra xem có challenges không
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
    }
  };

  const handleBackToUnits = () => {
    router.push("/learn");
    setSelectedUnitId(null);
    setSelectedLesson(null);
  };

  const handleChallengeComplete = () => {
    toast.success("Lesson completed!", {
      description: "You've earned 10 XP!",
      icon: "🎉",
    });

    setSelectedLesson(null);
  };

  const handleExitChallenge = () => {
    setSelectedLesson(null);
  };

  // Hiển thị loading state
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

  // Hiển thị thông báo lỗi nếu có
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

  // Hiển thị ChallengeScreen nếu đã chọn lesson
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
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
              {selectedUnit.title}
            </h2>

            {selectedUnit.lessons.map((lesson) => {
              // Xác định trạng thái của lesson
              const isCompleted = lesson.challenges?.every(
                (challenge) =>
                  challenge.challengesProgress &&
                  challenge.challengesProgress.some(
                    (progress) => progress.completed
                  )
              );

              let status: "locked" | "available" | "completed" = "available";
              if (isCompleted) {
                status = "completed";
              } else if (false) {
                // Logic để xác định lesson bị khóa
                status = "locked";
              }

              return (
                <LessonCard
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  description={`Lesson ${lesson.orderIndex + 1}`}
                  status={status}
                  icon="🎓"
                  onClick={handleLessonClick}
                  isLoading={isLoadingLesson}
                />
              );
            })}
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
                        onClick={() => handleLessonClick(lesson.id)}
                        isLoading={isLoadingLesson}
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
