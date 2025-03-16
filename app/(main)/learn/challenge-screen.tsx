"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Volume2,
  ArrowRight,
  Heart,
  ArrowLeft,
  Trophy,
  Zap,
  Home,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ChallengeOption {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
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
  lessonId: number;
}

export const ChallengeScreen = ({
  challenges,
  onComplete,
  onExit,
}: ChallengeScreenProps) => {
  const router = useRouter();

  const validChallenges = Array.isArray(challenges) ? challenges : [];

  const sortedChallenges = [...validChallenges].sort(
    (a, b) => a.orderChallenge - b.orderChallenge
  );

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
  const [showSummary, setShowSummary] = useState(false);
  const [results, setResults] = useState<{
    correct: number;
    incorrect: number;
    xp: number;
  }>({
    correct: 0,
    incorrect: 0,
    xp: 0,
  });
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);

  // Đảm bảo currentChallenge luôn có giá trị hợp lệ
  const currentChallenge = sortedChallenges[currentChallengeIndex] || null;

  // Khởi tạo audio elements khi component mount
  useEffect(() => {
    correctSoundRef.current = new Audio("/correct.wav");
    incorrectSoundRef.current = new Audio("/incorrect.wav");
    completeSoundRef.current = new Audio("/complete.wav");

    return () => {
      if (correctSoundRef.current) {
        correctSoundRef.current.pause();
        correctSoundRef.current = null;
      }
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.pause();
        incorrectSoundRef.current = null;
      }
      if (completeSoundRef.current) {
        completeSoundRef.current.pause();
        completeSoundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!sortedChallenges || sortedChallenges.length === 0) {
      toast.error("No challenges available for this lesson");
      onExit();
    } else {
      console.log(`Starting with ${sortedChallenges.length} challenges`);
    }
  }, [sortedChallenges, onExit]);

  useEffect(() => {
    setProgress((currentChallengeIndex / sortedChallenges.length) * 100);
  }, [currentChallengeIndex, sortedChallenges.length]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout);
      }
    };
  }, [autoAdvanceTimeout]);

  const handleOptionClick = (optionId: number) => {
    if (selectedOptionId !== null) return; // Prevent changing answer after selection

    setSelectedOptionId(optionId);

    const selectedOption = currentChallenge?.challengesOption.find(
      (option) => option.id === optionId
    );

    if (selectedOption) {
      if (selectedOption.correct) {
        setIsCorrect(true);
        setStreak(streak + 1);
        setFeedbackMessage("Correct!");
        correctSoundRef.current?.play();

        // Cập nhật kết quả
        setResults((prev) => ({
          ...prev,
          correct: prev.correct + 1,
          xp: prev.xp + 10,
        }));

        const timeout = setTimeout(() => {
          handleNext();
        }, 1500);
        setAutoAdvanceTimeout(timeout);
      } else {
        setIsCorrect(false);
        setStreak(0);
        setHearts(hearts - 1);
        setFeedbackMessage("Incorrect!");
        incorrectSoundRef.current?.play();

        // Cập nhật kết quả
        setResults((prev) => ({
          ...prev,
          incorrect: prev.incorrect + 1,
        }));
      }
    }
  };

  const handleNext = () => {
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout);
      setAutoAdvanceTimeout(null);
    }

    if (currentChallengeIndex < sortedChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setSelectedOptionId(null);
      setIsCorrect(null);
      setFeedbackMessage("");
    } else {
      // Completed all challenges
      completeSoundRef.current?.play();
      setShowSummary(true);
    }
  };

  const handleExitClick = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    onExit();
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const handleFinishLesson = () => {
    onComplete();
    router.push("/learn");
  };

  const playAudio = (src: string) => {
    const audio = new Audio(src);
    audio.play();
  };

  // Nếu không có challenges, hiển thị loading
  if (!currentChallenge && !showSummary) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-500">Loading challenges...</p>
      </div>
    );
  }

  // Hiển thị màn hình tổng kết khi hoàn thành
  if (showSummary) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 z-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Lesson Completed!
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Great job! You&apos;ve completed all challenges.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center">
              <StarIcon className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total
              </p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {sortedChallenges.length}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Correct
              </p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {results.correct}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-center">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Incorrect
              </p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {results.incorrect}
              </p>
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-xl flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You earned
              </p>
              <p className="text-2xl font-bold text-primary">{results.xp} XP</p>
            </div>
            <Zap className="h-8 w-8 text-primary" />
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 py-3"
              onClick={() => (window.location.href = "/learn")}
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              className="flex-1 py-3 bg-primary hover:bg-primary/90"
              onClick={handleFinishLesson}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative">
      {/* Header with progress bar and hearts */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-950 border-b dark:border-gray-800 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExitClick}
              className="text-slate-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 mx-4">
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: hearts }).map((_, i) => (
                <Heart
                  key={i}
                  className="h-5 w-5 text-red-500 fill-red-500"
                  strokeWidth={0}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Challenge question */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {currentChallenge.question}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {currentChallenge.type === "SELECT"
                ? "Select the correct answer"
                : "Complete the challenge"}
            </p>
          </div>

          {/* Challenge options */}
          <div className="space-y-4">
            {currentChallenge.challengesOption.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "p-4 border rounded-xl transition-all cursor-pointer flex justify-between items-center",
                  selectedOptionId === null
                    ? "hover:border-primary hover:bg-primary/5"
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
                  selectedOptionId !== null &&
                    selectedOptionId !== option.id &&
                    !option.correct
                    ? "opacity-50"
                    : ""
                )}
                onClick={() => handleOptionClick(option.id)}
              >
                <div className="flex items-center gap-3">
                  {option.audioSrc && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(option.audioSrc!);
                      }}
                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <Volume2 className="h-5 w-5 text-primary" />
                    </button>
                  )}
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {option.textOption}
                  </span>
                </div>

                <div className="flex items-center">
                  {option.imageSrc && (
                    <div className="h-14 w-14 relative mr-3 rounded-md overflow-hidden">
                      <Image
                        src={option.imageSrc}
                        alt={option.textOption}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {selectedOptionId === option.id && isCorrect && (
                    <CheckCircle className="h-6 w-6 text-green-500 ml-2 flex-shrink-0" />
                  )}
                  {selectedOptionId === option.id && !isCorrect && (
                    <XCircle className="h-6 w-6 text-red-500 ml-2 flex-shrink-0" />
                  )}
                  {selectedOptionId !== null &&
                    selectedOptionId !== option.id &&
                    option.correct && (
                      <CheckCircle className="h-6 w-6 text-green-500 ml-2 flex-shrink-0" />
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback message with animation */}
      {feedbackMessage && (
        <div
          className={cn(
            "fixed bottom-24 left-0 right-0 text-center py-3 font-bold text-white animate-fade-in",
            isCorrect ? "bg-green-500" : "bg-red-500"
          )}
        >
          {feedbackMessage}
        </div>
      )}

      {/* Exit confirmation dialog */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full shadow-xl">
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

      {/* Bottom navigation - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t dark:border-gray-800 p-4 z-10">
        <div className="max-w-4xl mx-auto">
          {selectedOptionId === null ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
              Select an answer to continue
            </p>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
            >
              {currentChallengeIndex < sortedChallenges.length - 1
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
