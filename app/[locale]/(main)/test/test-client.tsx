"use client";

import { ExamCard } from "./components/exam-card";

interface Exam {
  id: number;
  name: string;
  description: string;
  voice: string;
}

interface TestClientProps {
  examsData: Exam[];
}

export function TestClient({ examsData }: TestClientProps) {
  if (examsData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">English Exam Platform</h1>
          <p className="text-gray-600">
            Practice your English skills with TOEIC-style exams
          </p>
        </header>

        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No exams available
            </h3>
            <p className="text-gray-500">
              There are currently no exams available. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">English Exam Platform</h1>
        <p className="text-gray-600">
          Practice your English skills with TOEIC-style exams
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examsData.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
