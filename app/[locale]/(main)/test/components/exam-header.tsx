"use client";

import type { Exam } from "@/types/exam";
import { AudioPlayer } from "./audio-player";

interface ExamHeaderProps {
  exam: Exam;
}

export function ExamHeader({ exam }: ExamHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{exam.name}</h1>
      <p className="text-gray-600 mb-4">{exam.description}</p>

      {exam.voice && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Audio Instructions:</h3>
          <AudioPlayer src={exam?.voice} />
        </div>
      )}
    </div>
  );
}
