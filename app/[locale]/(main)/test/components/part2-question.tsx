"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/exam";

interface Part2QuestionProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answerId: number) => void;
  showResults: boolean;
}

export function Part2Question({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResults,
}: Part2QuestionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Question</CardTitle>
        {question.question && (
          <div className="text-sm text-gray-700 mt-2">{question.question}</div>
        )}
      </CardHeader>
      <CardContent>
        {/* <div className="mb-6">
          <AudioPlayer
            src={question.questionOptions[0]?.audioSrc || "/audio/default.mp3"}
          />
        </div> */}

        <RadioGroup value={selectedAnswer} className="grid grid-cols-1 gap-4">
          {question.questionOptions.map((option, index) => {
            const isCorrect = option.correct;
            const isSelected = selectedAnswer === option.id.toString();
            const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

            return (
              <div
                key={option.id}
                className={cn(
                  "flex items-center space-x-2 rounded-md border p-4 transition-colors",
                  isSelected && "border-primary",
                  showResults &&
                    isSelected &&
                    isCorrect &&
                    "bg-green-50 border-green-500",
                  showResults &&
                    isSelected &&
                    !isCorrect &&
                    "bg-red-50 border-red-500",
                  showResults &&
                    !isSelected &&
                    isCorrect &&
                    "bg-green-50 border-green-500"
                )}
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${question.id}-${option.id}`}
                  disabled={showResults}
                  onClick={() => onAnswerSelect(option.id)}
                />
                <Label
                  htmlFor={`option-${question.id}-${option.id}`}
                  className="flex-grow cursor-pointer flex items-center gap-3"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {optionLabel}
                  </span>
                  {/* <span>{option.answers}</span> */}
                </Label>

                {showResults && (
                  <div className="ml-auto">
                    {isCorrect ? (
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : isSelected ? (
                      <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
