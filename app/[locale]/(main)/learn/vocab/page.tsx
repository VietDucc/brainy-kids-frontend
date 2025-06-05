import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { VocabClient } from "./vocab-client";
import { VocabSkeleton } from "./vocab-skeleton";
import { api } from "@/app/api/config";

interface VocabWord {
  id: number;
  eng: string;
  vie: string;
  note?: string;
}

interface VocabPageProps {
  searchParams: {
    lessonId?: string;
  };
}

async function getVocabData(
  lessonId: string,
  token: string
): Promise<VocabWord[]> {
  try {
    const response = await fetch(api.vocab(parseInt(lessonId)), {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vocabulary");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vocabulary:", error);
    return [];
  }
}

export default async function VocabularyPage({ searchParams }: VocabPageProps) {
  const { getToken } = await auth();
  const token = await getToken({ template: "jwt-clerk" });
  const lessonId = searchParams.lessonId;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Unauthorized access</p>
      </div>
    );
  }

  if (!lessonId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No lesson ID provided</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  try {
    const vocabularyData = await getVocabData(lessonId, token);

    return (
      <Suspense fallback={<VocabSkeleton />}>
        <VocabClient vocabularyData={vocabularyData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in VocabularyPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load the vocabulary. Please try again later!
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
