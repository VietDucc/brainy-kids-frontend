"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { ExamHeader } from "@/app/[locale]/(main)/test/components/exam-header";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@/app/api/config";

import type { Exam } from "@/types/exam";
import { Part1Question } from "../components/part1-question";
import { Part2Question } from "../components/part2-question";
import { Part3Question } from "../components/part3-question";
import { Part5Question } from "../components/part5-question";
import { Part6Question } from "../components/part6-question";

interface ExamClientProps {
  examData: Exam;
  examId: string;
}

export function ExamClient({ examData, examId }: ExamClientProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [currentPart, setCurrentPart] = useState<string>("1");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId.toString(),
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const totalQuestions = examData.parts.reduce(
        (acc, part) => acc + part.questions.length,
        0
      );
      const completedQuestions = Object.keys(answers).length;
      const completed = completedQuestions === totalQuestions;

      // Submit exam progress to API
      const token = await getToken({ template: "jwt-clerk" });

      if (token) {
        const response = await fetch(api.examProgressSubmit(parseInt(examId)), {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            examId: parseInt(examId),
            completedQuestions: completedQuestions,
            totalQuestions: totalQuestions,
            completed: completed,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit exam progress");
        }
      }

      // Navigate to result page
      const encodedAnswers = encodeURIComponent(JSON.stringify(answers));
      router.push(`/test/${examId}/result?answers=${encodedAnswers}`);
    } catch (error) {
      console.error("Failed to submit exam progress:", error);
      // Still navigate to result page even if API call fails
      const encodedAnswers = encodeURIComponent(JSON.stringify(answers));
      router.push(`/test/${examId}/result?answers=${encodedAnswers}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextPart = () => {
    const currentPartNum = parseInt(currentPart);
    const nextPart = examData.parts.find(
      (part) => part.partNumber > currentPartNum
    );
    if (nextPart) {
      setCurrentPart(nextPart.partNumber.toString());
    }
  };

  const handlePrevPart = () => {
    const currentPartNum = parseInt(currentPart);
    const prevPart = [...examData.parts]
      .reverse()
      .find((part) => part.partNumber < currentPartNum);
    if (prevPart) {
      setCurrentPart(prevPart.partNumber.toString());
    }
  };

  const totalQuestions = examData.parts.reduce(
    (acc, part) => acc + part.questions.length,
    0
  );
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const currentPartNum = parseInt(currentPart);
  const isLastPart =
    currentPartNum === Math.max(...examData.parts.map((p) => p.partNumber));
  const allQuestionsAnswered = answeredQuestions === totalQuestions;
  const canSubmit = isLastPart || allQuestionsAnswered;

  const isFirstPart =
    currentPartNum === Math.min(...examData.parts.map((p) => p.partNumber));
  const isLastPartAvailable =
    currentPartNum < Math.max(...examData.parts.map((p) => p.partNumber));

  return (
    <div className="container mx-auto px-4 py-8">
      <ExamHeader exam={examData} />
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Progress: {answeredQuestions}/{totalQuestions} questions
              </span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Tabs
            value={currentPart}
            onValueChange={setCurrentPart}
            className="mb-8"
          >
            <TabsList className="grid grid-cols-5 mb-6">
              {examData.parts.map((part) => (
                <TabsTrigger key={part.id} value={part.partNumber.toString()}>
                  Part {part.partNumber}
                </TabsTrigger>
              ))}
            </TabsList>

            {examData.parts.map((part) => (
              <TabsContent key={part.id} value={part.partNumber.toString()}>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">{part.description}</h3>
                  <p className="mb-6 text-gray-600">
                    {part.type === "LISTENING"
                      ? "Listening Section"
                      : "Reading Section"}
                  </p>

                  <div className="space-y-8">
                    {part.questions.map((question) => {
                      switch (question.type) {
                        case "part1":
                          return (
                            <Part1Question
                              key={question.id}
                              question={question}
                              selectedAnswer={answers[question.id]}
                              onAnswerSelect={(answerId) =>
                                handleAnswerSelect(question.id, answerId)
                              }
                              showResults={false}
                            />
                          );
                        case "part2":
                          return (
                            <Part2Question
                              key={question.id}
                              question={question}
                              selectedAnswer={answers[question.id]}
                              onAnswerSelect={(answerId) =>
                                handleAnswerSelect(question.id, answerId)
                              }
                              showResults={false}
                            />
                          );
                        case "part3":
                          return (
                            <Part3Question
                              key={question.id}
                              question={question}
                              selectedAnswer={answers[question.id]}
                              onAnswerSelect={(answerId) =>
                                handleAnswerSelect(question.id, answerId)
                              }
                              showResults={false}
                            />
                          );
                        case "part5":
                          return (
                            <Part5Question
                              key={question.id}
                              question={question}
                              selectedAnswer={answers[question.id]}
                              onAnswerSelect={(answerId) =>
                                handleAnswerSelect(question.id, answerId)
                              }
                              showResults={false}
                            />
                          );
                        case "part6":
                          return (
                            <Part6Question
                              key={question.id}
                              question={question}
                              selectedAnswer={answers[question.id]}
                              onAnswerSelect={(answerId) =>
                                handleAnswerSelect(question.id, answerId)
                              }
                              showResults={false}
                            />
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>

                  {/* Part Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={handlePrevPart}
                      disabled={isFirstPart}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous Part
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Part {part.partNumber} of {examData.parts.length}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {part.questions.filter((q) => answers[q.id]).length}/
                        {part.questions.length} answered
                      </Badge>
                    </div>

                    {isLastPartAvailable ? (
                      <Button
                        onClick={handleNextPart}
                        className="flex items-center gap-2"
                      >
                        Next Part
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="w-[120px]" />
                    )}
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => router.push("/test")}>
              Exit Exam
            </Button>

            {canSubmit && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Answers"}
              </Button>
            )}
          </div>
        </div>

        {/* Question Summary Sidebar */}
        <div className="w-80 flex-shrink-0">
          <Card className="sticky top-4">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Question Summary</h3>
              <p className="text-sm text-gray-600">
                {answeredQuestions} of {totalQuestions} answered
              </p>
            </div>

            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {examData.parts.map((part) => (
                <div key={part.id}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      Part {part.partNumber}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {part.questions.filter((q) => answers[q.id]).length}/
                      {part.questions.length}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-5 gap-1 mb-4">
                    {part.questions.map((question, index) => (
                      <button
                        key={question.id}
                        onClick={() =>
                          setCurrentPart(part.partNumber.toString())
                        }
                        className={`
                          w-8 h-8 rounded text-xs font-medium transition-colors
                          ${
                            answers[question.id]
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : "bg-gray-100 text-gray-600 border border-gray-300"
                          }
                          hover:bg-blue-100 hover:border-blue-300
                        `}
                        title={`Question ${index + 1} ${
                          answers[question.id] ? "(Answered)" : "(Not answered)"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-gray-400" />
                  <span>Not answered</span>
                </div>
              </div>

              <div className="mt-3">
                <Progress value={progress} className="h-2" />
                <div className="text-center text-xs text-gray-600 mt-1">
                  {Math.round(progress)}% Complete
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
