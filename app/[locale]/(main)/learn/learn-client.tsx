"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, PenSquare } from "lucide-react";
import { ChallengeScreen } from "./challenge-screen";
import { transformLessonData } from "@/utils/transform-lesson-data";
import { LessonType, UnitType } from "@/types/learn";
import { api } from "@/app/api/config";

interface LearnClientProps {
  children: React.ReactNode;
  units: UnitType[];
  token: string;
}

export function LearnClient({ children, units, token }: LearnClientProps) {
  const { t } = useTranslation("learn");
  const router = useRouter();
  const [showLearningOptions, setShowLearningOptions] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [loadingLessonId, setLoadingLessonId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLessonClick = async (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setShowLearningOptions(true);
  };

  const handleStartChallenge = async () => {
    if (!selectedLessonId) return;

    try {
      setLoadingLessonId(selectedLessonId);
      setError(null);

      const response = await fetch(api.lessons(selectedLessonId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(t("errors.load_lesson"));
      }

      const data = await response.json();

      if (!data.challenges || data.challenges.length === 0) {
        setError(t("errors.no_challenges"));
        setSelectedLesson(null);
        setShowLearningOptions(false);
        setLoadingLessonId(null);
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

      setSelectedLesson(lessonData);
    } catch (error) {
      console.error("Error loading lesson:", error);
      setError(t("errors.load_lesson"));
      toast.error(t("errors.load_lesson"));
    } finally {
      setLoadingLessonId(null);
      setShowLearningOptions(false);
    }
  };

  const handleStartVocabulary = () => {
    if (!selectedLessonId) return;
    router.push(`/learn/vocab?lessonId=${selectedLessonId}`);
  };

  const updateCompletedLesson = () => {
    toast.success("Bài học đã hoàn thành!", {
      description: "Tiến trình của bạn đã được cập nhật",
      icon: "🎉",
    });
  };

  const handleChallengeComplete = (completedLessonId?: number) => {
    if (completedLessonId) {
      updateCompletedLesson();
    }
    setSelectedLesson(null);
    router.refresh();
  };

  const handleExitChallenge = () => {
    setSelectedLesson(null);
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
            {error}
          </h2>
          <button
            onClick={() => {
              setError(null);
              router.push("/learn");
            }}
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
          token={token}
          challenges={selectedLesson.challenges}
          onComplete={handleChallengeComplete}
          lessonTitle={selectedLesson.title}
          onExit={handleExitChallenge}
          lessonId={selectedLesson.id}
        />
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
              disabled={loadingLessonId !== null}
            >
              <BookOpen className="h-5 w-5" />
              {t("learning_options.vocabulary")}
            </Button>
            <Button
              onClick={handleStartChallenge}
              className="flex items-center gap-2 py-6"
              disabled={loadingLessonId !== null}
            >
              <PenSquare className="h-5 w-5" />
              {loadingLessonId ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang tải...
                </>
              ) : (
                t("learning_options.exercises")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const lessonCard = target.closest("[data-lesson-id]");
          if (lessonCard) {
            const lessonId = parseInt(
              lessonCard.getAttribute("data-lesson-id") || "0"
            );
            const status = lessonCard.getAttribute("data-status");
            if (
              lessonId &&
              status !== "locked" &&
              loadingLessonId !== lessonId
            ) {
              handleLessonClick(lessonId);
            }
          }
        }}
        className={loadingLessonId ? "lesson-loading" : ""}
        style={
          {
            "--loading-lesson-id": loadingLessonId?.toString() || "",
          } as React.CSSProperties & { "--loading-lesson-id": string }
        }
      >
        {children}
      </div>

      <style jsx>{`
        .lesson-loading [data-lesson-id="${loadingLessonId}"] {
          pointer-events: none;
          opacity: 0.7;
        }

        .lesson-loading
          [data-lesson-id="${loadingLessonId}"]
          .lesson-card-content {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
}
