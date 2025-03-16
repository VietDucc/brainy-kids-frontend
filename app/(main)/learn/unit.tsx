import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ChallengeScreen } from "./challenge-screen";
import { transformLessonData } from "@/utils/transform-lesson-data";

interface Challenge {
  id: number;
  type: string;
  question: string;
  orderChallenge: number;
  challengesOption: {
    id: number;
    textOption: string;
    correct: boolean;
    imageSrc: string | null;
    audioSrc: string | null;
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
  lessons: Lesson[];
};

export const Unit = ({ title, lessons }: UnitProps) => {
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Tự động chọn bài học đầu tiên khi component mount
  useEffect(() => {
    if (lessons && lessons.length > 0) {
      const firstLesson = lessons[0];
      handleLessonLoad(firstLesson.id);
    }
  }, [lessons]);

  const handleLessonLoad = async (lessonId: number) => {
    try {
      setIsLoadingLesson(true);

      const response = await fetch(`/api/lessons/${lessonId}`);

      if (!response.ok) {
        throw new Error(`Failed to load lesson ${lessonId}`);
      }

      const data = await response.json();

      // Chuyển đổi dữ liệu thành cấu trúc lesson
      const lesson = transformLessonData(data, lessonId);

      setSelectedLesson(lesson);
    } catch {
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

    if (selectedLesson && lessons) {
      const currentIndex = lessons.findIndex(
        (lesson) => lesson.id === selectedLesson.id
      );
      if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        handleLessonLoad(nextLesson.id);
      }
    }
  };

  const handleBackToUnit = () => {
    window.location.href = "/learn";
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

  // Hiển thị ChallengeScreen nếu đã tải xong dữ liệu
  if (
    selectedLesson &&
    selectedLesson.challenges &&
    selectedLesson.challenges.length > 0
  ) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 overflow-auto">
        <ChallengeScreen
          challenges={selectedLesson.challenges}
          onComplete={handleChallengeComplete}
          lessonTitle={title}
          onExit={handleBackToUnit}
          lessonId={selectedLesson.id}
        />
      </div>
    );
  }

  // Hiển thị thông báo nếu không có challenges
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
          No challenges available
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          This lesson doesn&apos;t have any challenges yet. Please try another
          lesson.
        </p>
        <button
          onClick={handleBackToUnit}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to lessons
        </button>
      </div>
    </div>
  );
};
