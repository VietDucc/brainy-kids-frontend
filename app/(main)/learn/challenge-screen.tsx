"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Volume2,
  ArrowRight,
  Heart,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChallengeOption {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string;
  audioSrc: string;
}

interface Challenge {
  id: number;
  type: string;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
  challengesProgress: {
    id: number;
    userId: string;
    completed: boolean;
  }[];
}

interface ChallengeScreenProps {
  challenges: Challenge[];
  onComplete: () => void;
  lessonTitle: string;
  onExit: () => void;
}

export const ChallengeScreen = ({
  challenges,
  onComplete,
  lessonTitle,
  onExit,
}: ChallengeScreenProps) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(0);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [autoAdvanceTimeout, setAutoAdvanceTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const currentChallenge = challenges[currentChallengeIndex];

  useEffect(() => {
    // Cập nhật progress khi chuyển challenge
    setProgress((currentChallengeIndex / challenges.length) * 100);
  }, [currentChallengeIndex, challenges.length]);

  // Xử lý cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
      }
    };
  }, [autoAdvanceTimeout]);

  const handleOptionSelect = (optionId: number, isCorrect: boolean) => {
    if (selectedOptionId !== null) return; // Đã chọn đáp án rồi

    setSelectedOptionId(optionId);
    setIsCorrect(isCorrect);

    // Cập nhật streak và hearts
    if (isCorrect) {
      setStreak((prev) => prev + 1);
      setFeedbackMessage(
        streak > 0 ? `Correct! ${streak + 1} in a row! 🔥` : "Correct!"
      );

      // Tự động chuyển sang câu tiếp theo sau 1.5 giây nếu trả lời đúng
      const timeout = setTimeout(() => {
        handleNext();
      }, 1500);

      setAutoAdvanceTimeout(timeout);
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
      setStreak(0);
      setFeedbackMessage("Incorrect. Try again!");
    }

    // Phát âm thanh phản hồi
    const audio = new Audio(isCorrect ? "/correct.wav" : "/incorrect.wav");
    audio.play().catch((e) => console.error("Could not play audio", e));
  };

  const handleNext = () => {
    // Hủy timeout nếu người dùng bấm nút next thủ công
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      setAutoAdvanceTimeout(null);
    }

    setFeedbackMessage("");

    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsCorrect(null);
    } else {
      // Hoàn thành tất cả challenges
      onComplete();
    }
  };

  const playAudio = (audioSrc: string) => {
    const audio = new Audio(audioSrc);
    audio.play().catch((e) => console.error("Could not play audio", e));
  };

  const handleExitClick = () => {
    // Hủy timeout nếu đang có
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      setAutoAdvanceTimeout(null);
    }

    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    onExit();
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  if (!currentChallenge) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No challenges available.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="py-4 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 -ml-2"
              onClick={handleExitClick}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span className="text-sm font-medium">{hearts}</span>
              </div>
            </div>
          </div>
          <div className="relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="font-medium text-slate-700 dark:text-slate-200">
              {currentChallengeIndex + 1}/{challenges.length}
            </div>
            <div className="font-medium text-slate-700 dark:text-slate-200">
              {lessonTitle}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 pt-28 pb-24">
        {/* Challenge question */}
        <div className="w-full max-w-2xl mx-auto mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-800 dark:text-slate-100">
            {currentChallenge.question}
          </h2>

          {/* Feedback message */}
          {feedbackMessage && (
            <div
              className={cn(
                "mb-6 p-3 rounded-lg text-center animate-fade-in font-medium",
                isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              )}
            >
              {feedbackMessage}
            </div>
          )}

          {/* Challenge options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentChallenge.challengesOption.map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option.id, option.correct)}
                className={cn(
                  "p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between",
                  selectedOptionId === null
                    ? "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-transform"
                    : "",
                  selectedOptionId === option.id && isCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "",
                  selectedOptionId === option.id && !isCorrect
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "",
                  selectedOptionId !== null &&
                    selectedOptionId !== option.id &&
                    option.correct
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "",
                  selectedOptionId !== null && selectedOptionId !== option.id
                    ? "opacity-70"
                    : ""
                )}
              >
                <div className="flex-1">
                  {option.imageSrc && option.imageSrc !== "url" && (
                    <div className="mb-3">
                      <Image
                        src={option.imageSrc}
                        alt={option.textOption}
                        className="w-full h-32 object-contain rounded-lg"
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {option.textOption}
                    </span>
                    {option.audioSrc && option.audioSrc !== "url" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(option.audioSrc);
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {selectedOptionId === option.id && isCorrect && (
                  <CheckCircle className="h-6 w-6 text-green-500 ml-2" />
                )}
                {selectedOptionId === option.id && !isCorrect && (
                  <XCircle className="h-6 w-6 text-red-500 ml-2" />
                )}
                {selectedOptionId !== null &&
                  selectedOptionId !== option.id &&
                  option.correct && (
                    <CheckCircle className="h-6 w-6 text-green-500 ml-2" />
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exit confirmation dialog */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Exit lesson?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Your progress in this lesson will be lost. Are you sure you want
              to exit?
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancelExit}
              >
                Continue learning
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmExit}
              >
                Exit lesson
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t dark:border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          {selectedOptionId === null ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">
              Select an answer to continue
            </p>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {currentChallengeIndex < challenges.length - 1
                ? "Next"
                : "Complete"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
