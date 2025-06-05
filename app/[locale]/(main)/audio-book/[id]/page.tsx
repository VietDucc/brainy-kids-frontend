import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { BookDetailClient } from "./book-detail-client";
import { BookDetailSkeleton } from "./book-detail-skeleton";
import { api } from "@/app/api/config";

interface Voice {
  id: number;
  voiceUrl: string;
  pageIndex: number;
}

interface Book {
  id: number;
  title: string;
  pdfUrl: string;
  voices: Voice[];
}

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

async function getBookData(
  bookId: string,
  token: string
): Promise<Book | null> {
  try {
    const response = await fetch(`${api.book}/${bookId}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch book");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
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
    const bookData = await getBookData(params.id, token);

    return (
      <div className="min-h-screen bg-background">
        <Suspense fallback={<BookDetailSkeleton />}>
          <BookDetailClient bookData={bookData} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error in BookDetailPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load the book. Please try again later!
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
