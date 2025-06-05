import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import Link from "next/link";
import { ExamSkeleton } from "./exam-skeleton";
import { api } from "@/app/api/config";
import type { Exam } from "@/types/exam";
import { ExamClient } from "./exam-client";

interface ExamPageProps {
  params: {
    id: string;
  };
}

async function getExamData(
  examId: string,
  token: string
): Promise<Exam | null> {
  try {
    const response = await fetch(api.examById(parseInt(examId)), {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exam");
    }

    const examData = await response.json();

    // Sort questions by order
    examData.parts.forEach(
      (part: { questions: { questionOrder: number }[] }) => {
        part.questions.sort(
          (a: { questionOrder: number }, b: { questionOrder: number }) =>
            a.questionOrder - b.questionOrder
        );
      }
    );

    return examData;
  } catch (error) {
    console.error("Error fetching exam:", error);
    return null;
  }
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { getToken } = await auth();
  const token = await getToken({ template: "jwt-clerk" });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Unauthorized access</p>
      </div>
    );
  }

  try {
    const examData = await getExamData(params.id, token);

    if (!examData) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Exam not found</h2>
            <Link href="/test" className="text-primary hover:underline">
              Back to Test
            </Link>
          </div>
        </div>
      );
    }

    return (
      <Suspense fallback={<ExamSkeleton />}>
        <ExamClient examData={examData} examId={params.id} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in ExamPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load the exam. Please try again later!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
