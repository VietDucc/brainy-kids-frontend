import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { TestClient } from "./test-client";
import { TestSkeleton } from "./test-skeleton";
import { api } from "@/app/api/config";

interface Exam {
  id: number;
  name: string;
  description: string;
  voice: string;
}

async function getExamsData(token: string): Promise<Exam[]> {
  try {
    const response = await fetch(api.exams, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exams");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exams:", error);
    return [];
  }
}

export default async function TestPage() {
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
    const examsData = await getExamsData(token);

    return (
      <Suspense fallback={<TestSkeleton />}>
        <TestClient examsData={examsData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in TestPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load the exams. Please try again later!
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
