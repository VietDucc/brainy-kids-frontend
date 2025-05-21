import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { ChallengeOption } from "../types";

interface SingleChallengeProps {
  question: string;
  imgSrc: string;
  options: ChallengeOption[];
  selectedOptionId: number | null;
  isCorrect: boolean | null;
  onOptionClick: (optionId: number) => void;
}

export function SingleChallenge({
  question,
  imgSrc,
  options,
  selectedOptionId,
  isCorrect,
  onOptionClick,
}: SingleChallengeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
          <Image
            src={imgSrc}
            alt={question}
            fill
            className="object-cover"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
          {question}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Choose the sentence that matches this picture
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
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
            onClick={() => onOptionClick(option.id)}
          >
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {option.textOption}
            </span>

            <div className="flex items-center">
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
  );
}
