"use client";

import type { Exam } from "@/types/exam";
import { AudioPlayer } from "./audio-player";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, FileText, Headphones } from "lucide-react";

interface ExamHeaderProps {
  exam: Exam;
}

export function ExamHeader({ exam }: ExamHeaderProps) {
  const totalQuestions = exam.parts.reduce(
    (acc, part) => acc + part.questions.length,
    0
  );

  return (
    <div className="mb-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/test">
          <Button variant="ghost" size="sm" className="group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Test
          </Button>
        </Link>
      </div>

      {/* Main Header Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-32 translate-x-32" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  {exam.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  {exam.description}
                </p>
              </div>

              {/* Exam Stats */}
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {totalQuestions} Questions
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {exam.parts.length} Parts
                </Badge>
                {exam.voice && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1.5 text-sm font-medium"
                  >
                    <Headphones className="w-4 h-4 mr-2" />
                    Audio Available
                  </Badge>
                )}
              </div>
            </div>

            {/* Right Content - Parts Overview */}
            <div className="lg:w-80">
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Exam Structure
                </h3>
                <div className="space-y-2">
                  {exam.parts.map((part) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        Part {part.partNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {part.type === "LISTENING" ? "Listening" : "Reading"}
                        </Badge>
                        <span className="text-gray-500 text-xs">
                          {part.questions.length} Q
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Audio Player Section */}
          {exam.voice && (
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Headphones className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Audio Instructions
                  </h3>
                </div>
                <Badge variant="outline" className="text-xs">
                  Listen before starting
                </Badge>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <AudioPlayer src={exam.voice} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
