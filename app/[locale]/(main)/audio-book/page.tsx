import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

import { api } from "@/app/api/config";
import { AudioBookClient } from "./audio-book-client";
import { AudioBookSkeleton } from "./audio-book-skeleton";

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

async function getBooksData(token: string): Promise<Book[]> {
  try {
    const response = await fetch(api.book, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default async function AudioBookPage() {
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
    const booksData = await getBooksData(token);

    return (
      <Suspense fallback={<AudioBookSkeleton />}>
        <AudioBookClient booksData={booksData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in AudioBookPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load the books. Please try again later!
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
