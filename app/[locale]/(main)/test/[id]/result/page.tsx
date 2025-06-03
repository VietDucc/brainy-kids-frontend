"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";

import type { Exam, Question } from "@/types/exam";
import { ExamHeader } from "@/app/[locale]/(main)/test/components/exam-header";
import { TestStatistics } from "@/app/[locale]/(main)/test/components/test-statistics";

interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  score: number;
  timeSpent?: string;
  partResults: PartResult[];
}

interface PartResult {
  partNumber: number;
  partName: string;
  totalQuestions: number;
  correctAnswers: number;
  questions: QuestionResult[];
}

interface QuestionResult {
  questionId: number;
  question: Question;
  userAnswer?: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [activeTab, setActiveTab] = useState("0");

  useEffect(() => {
    const fetchExamAndCalculateResults = async () => {
      try {
        if (params.id) {
          // Fetch exam data
          const response = await fetch(`/api/exam/${params.id}`);
          const examData = await response.json();
          setExam(examData);

          // Get user answers from URL params or localStorage
          const answersParam = searchParams.get("answers");
          const userAnswers = answersParam
            ? JSON.parse(decodeURIComponent(answersParam))
            : {};

          // Calculate results
          const result = calculateTestResults(examData, userAnswers);
          setTestResult(result);
        }
      } catch (error) {
        console.error("Failed to fetch exam:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamAndCalculateResults();
  }, [params.id, searchParams]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!testResult) return;

      const currentIndex = parseInt(activeTab);
      const maxIndex = testResult.partResults.length - 1;

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setActiveTab((currentIndex - 1).toString());
      } else if (e.key === "ArrowRight" && currentIndex < maxIndex) {
        setActiveTab((currentIndex + 1).toString());
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeTab, testResult]);

  const calculateTestResults = (
    examData: Exam,
    userAnswers: Record<string, string>
  ): TestResult => {
    let totalQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    const partResults: PartResult[] = [];

    examData.parts.forEach((part) => {
      const partResult: PartResult = {
        partNumber: part.partNumber,
        partName: part.description,
        totalQuestions: part.questions.length,
        correctAnswers: 0,
        questions: [],
      };

      part.questions.forEach((question) => {
        totalQuestions++;
        const userAnswerId = userAnswers[question.id];
        const correctOption = question.questionOptions.find(
          (opt) => opt.correct
        );
        const userOption = question.questionOptions.find(
          (opt) => opt.id.toString() === userAnswerId
        );

        const isCorrect =
          userAnswerId &&
          correctOption &&
          userAnswerId === correctOption.id.toString();

        if (!userAnswerId) {
          unanswered++;
        } else if (isCorrect) {
          correctAnswers++;
          partResult.correctAnswers++;
        } else {
          wrongAnswers++;
        }

        partResult.questions.push({
          questionId: question.id,
          question,
          userAnswer: userOption?.answers,
          correctAnswer: correctOption?.answers || "",
          isCorrect: !!isCorrect,
        });
      });

      partResults.push(partResult);
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      unanswered,
      score,
      partResults,
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Calculating results...</p>
        </div>
      </div>
    );
  }

  if (!exam || !testResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Results not found</h2>
          <Button onClick={() => router.push("/test")}>Back to Test</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ExamHeader exam={exam} />
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Test Complete!
            </h2>
            <p className="text-sm text-gray-600">
              {exam.name} • {testResult.totalQuestions} questions •{" "}
              {Math.round(
                (testResult.correctAnswers / testResult.totalQuestions) * 100
              )}
              % accuracy
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {testResult.score}%
            </div>
            <div className="text-xs text-gray-500">Final Score</div>
          </div>
        </div>
      </div>
      {/* Overall Results Card */}
      <TestStatistics
        totalQuestions={testResult.totalQuestions}
        correctAnswers={testResult.correctAnswers}
        wrongAnswers={testResult.wrongAnswers}
        unanswered={testResult.unanswered}
        score={testResult.score}
        className="mb-8"
      />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Part-wise Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResult.partResults.map((partResult) => (
              <div
                key={partResult.partNumber}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">
                    Part {partResult.partNumber} - {partResult.partName}
                  </h4>
                  <Badge variant="outline">
                    {partResult.correctAnswers}/{partResult.totalQuestions}
                  </Badge>
                </div>
                <Progress
                  value={
                    (partResult.correctAnswers / partResult.totalQuestions) *
                    100
                  }
                  className="h-2"
                />
                <div className="text-sm text-gray-600 mt-1">
                  {Math.round(
                    (partResult.correctAnswers / partResult.totalQuestions) *
                      100
                  )}
                  % correct
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Question Review</span>
            <div className="text-sm text-gray-500 font-normal">
              Use ← → arrow keys to navigate parts
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              {testResult.partResults.map((part, index) => (
                <TabsTrigger key={part.partNumber} value={index.toString()}>
                  Part {part.partNumber}
                </TabsTrigger>
              ))}
            </TabsList>

            {testResult.partResults.map((partResult, partIndex) => (
              <TabsContent
                key={partResult.partNumber}
                value={partIndex.toString()}
              >
                <div className="space-y-4">
                  {partResult.questions.map((questionResult, questionIndex) => (
                    <div
                      key={questionResult.questionId}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {questionResult.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : questionResult.userAnswer ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-2">
                            Question {questionIndex + 1}
                          </div>
                          {questionResult.question.question && (
                            <div className="mb-3 text-gray-700">
                              {questionResult.question.question}
                            </div>
                          )}
                          {questionResult.question.imgSrc && (
                            <img
                              src={questionResult.question.imgSrc}
                              alt="Question"
                              className="mb-3 max-w-md rounded border"
                            />
                          )}
                          <div className="space-y-2">
                            {questionResult.userAnswer && (
                              <div
                                className={`text-sm ${
                                  questionResult.isCorrect
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                <strong>Your answer:</strong>{" "}
                                {questionResult.userAnswer}
                              </div>
                            )}
                            <div className="text-sm text-green-600">
                              <strong>Correct answer:</strong>{" "}
                              {questionResult.correctAnswer}
                            </div>
                            {!questionResult.userAnswer && (
                              <div className="text-sm text-gray-500">
                                <strong>Not answered</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Part Navigation */}
                  <div className="flex justify-between items-center pt-6 border-t bg-gray-50 rounded-lg p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={partIndex === 0}
                      onClick={() => setActiveTab((partIndex - 1).toString())}
                      className="flex items-center gap-2"
                    >
                      ← Previous Part
                      {partIndex > 0 && (
                        <span className="text-xs text-gray-500">(←)</span>
                      )}
                    </Button>

                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">
                        Part {partResult.partNumber} of{" "}
                        {testResult.partResults.length}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {partResult.correctAnswers}/{partResult.totalQuestions}{" "}
                        correct
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={partIndex === testResult.partResults.length - 1}
                      onClick={() => setActiveTab((partIndex + 1).toString())}
                      className="flex items-center gap-2"
                    >
                      Next Part →
                      {partIndex < testResult.partResults.length - 1 && (
                        <span className="text-xs text-gray-500">(→)</span>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/test")}>
          Back to Test List
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/test/${params.id}`)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Test
          </Button>
          <Button onClick={() => router.push("/test")}>
            Take Another Test
          </Button>
        </div>
      </div>
    </div>
  );
}
