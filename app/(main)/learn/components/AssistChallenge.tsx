import { cn } from "@/lib/utils";
import { CheckCircle, Volume2, XCircle } from "lucide-react";
import { ChallengeOption } from "../types";

interface AssistChallengeProps {
  question: string;
  options: ChallengeOption[];
  selectedOptionId: number | null;
  isCorrect: boolean | null;
  onOptionClick: (optionId: number) => void;
}

export function AssistChallenge({
  question,
  options,
  selectedOptionId,
  isCorrect,
  onOptionClick,
}: AssistChallengeProps) {
  const playAudio = (src: string | null) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.play();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
          {question}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Listen to each sound and select the correct one
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "p-6 border rounded-xl transition-all cursor-pointer flex flex-col items-center",
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
            onClick={() => onOptionClick(option.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio(option.audioSrc);
              }}
              className="p-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition group"
            >
              <Volume2 className="h-8 w-8 text-primary group-hover:scale-110 transition" />
            </button>

            <div className="flex justify-center mt-4">
              {selectedOptionId === option.id && isCorrect && (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
              {selectedOptionId === option.id && !isCorrect && (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              {selectedOptionId !== null &&
                selectedOptionId !== option.id &&
                option.correct && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
