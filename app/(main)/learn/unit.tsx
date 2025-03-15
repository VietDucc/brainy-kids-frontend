import { LessonButton } from "./lesson-button";
import { UnitBanner } from "./unit-banner";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { ChallengeScreen } from "./challenge-screen";
import { Button } from "@/components/ui/button";

interface Challenge {
  id: number;
  type: string;
  question: string;
  orderChallenge: number;
  challengesOption: {
    id: number;
    textOption: string;
    correct: boolean;
    imageSrc: string;
    audioSrc: string;
  }[];
  challengesProgress: {
    id: number;
    userId: string;
    completed: boolean;
  }[];
}

interface Lesson {
  id: number;
  title: string;
  orderIndex: number;
  challenges: Challenge[];
}

type UnitProps = {
  id: number;
  orderUnit: number;
  title: string;
  description: string;
  lessons: Lesson[];
  activeLesson?: Lesson;
  activeLessonPercentage: number;
};

export const Unit = ({
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: UnitProps) => {
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showChallenges, setShowChallenges] = useState(false);

  const isLessonCompleted = (lesson: Lesson) => {
    if (!lesson.challenges || lesson.challenges.length === 0) return false;

    return lesson.challenges.every(
      (challenge) =>
        challenge.challengesProgress &&
        challenge.challengesProgress.some((progress) => progress.completed)
    );
  };

  const handleLessonClick = async (lessonId: number) => {
    try {
      setIsLoadingLesson(true);

      // Gọi API để lấy chi tiết bài học
      const response = await fetch(`/api/lessons/${lessonId}`);

      if (!response.ok) {
        throw new Error(`Failed to load lesson ${lessonId}`);
      }

      const lessonData = await response.json();
      setSelectedLesson(lessonData[0]); // Lấy phần tử đầu tiên từ mảng

      // Nếu có challenges, hiển thị màn hình challenges
      if (lessonData[0]?.challenges && lessonData[0].challenges.length > 0) {
        setShowChallenges(true);
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      toast.error("Failed to load lesson. Please try again.");
    } finally {
      setIsLoadingLesson(false);
    }
  };

  const handleChallengeComplete = () => {
    toast.success("Lesson completed!", {
      description: "You've earned 10 XP!",
      icon: "🎉",
    });
    setShowChallenges(false);
    setSelectedLesson(null);
  };

  const handleBackToUnit = () => {
    setShowChallenges(false);
    setSelectedLesson(null);
  };

  if (
    showChallenges &&
    selectedLesson &&
    selectedLesson.challenges.length > 0
  ) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 overflow-auto">
        <ChallengeScreen
          challenges={selectedLesson.challenges}
          onComplete={handleChallengeComplete}
          lessonTitle={selectedLesson.title}
          onExit={handleBackToUnit}
        />
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
          <Button
            onClick={handleBackToUnit}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {selectedLesson.challenges && selectedLesson.challenges.length > 0 ? (
          <div className="space-y-6">
            <p className="text-slate-600 dark:text-slate-300">
              This lesson contains {selectedLesson.challenges.length}{" "}
              challenges.
            </p>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
                Ready to practice?
              </h3>
              <p className="mb-6 text-blue-600 dark:text-blue-400">
                Complete all challenges to master this lesson.
              </p>
              <Button
                onClick={() => setShowChallenges(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Practice
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">
            No challenges available for this lesson yet.
          </p>
        )}
      </div>
    );
  }

  // Hiển thị loading state
  if (isLoadingLesson) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Hiển thị danh sách các bài học trong unit
  return (
    <>
      <UnitBanner title={title} description={description} />

      <div className="relative flex flex-col items-center">
        {lessons.map((lesson, i) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !isLessonCompleted(lesson) && !isCurrent;

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={i}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
              onClick={() => handleLessonClick(lesson.id)}
            />
          );
        })}
      </div>
    </>
  );
};
