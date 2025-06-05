"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

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

interface AudioBookClientProps {
  booksData: Book[];
}

export function AudioBookClient({ booksData }: AudioBookClientProps) {
  const { t } = useTranslation("audiobook");
  const router = useRouter();
  const [navigatingToId, setNavigatingToId] = useState<number | null>(null);

  const handleBookClick = async (bookId: number) => {
    setNavigatingToId(bookId);
    // Add a small delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push(`/audio-book/${bookId}`);
  };

  if (booksData.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">{t("page_title")}</h1>
            <p className="text-muted-foreground">{t("page_description")}</p>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No audio books available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                There are currently no audio books available. Please check back
                later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("page_title")}</h1>
          <p className="text-muted-foreground">{t("page_description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booksData.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="truncate max-w-[200px] block">
                    {book.title}
                  </span>
                </CardTitle>

                <CardDescription className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  {book.voices.length} {t("list.pages_with_audio")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="text-sm text-muted-foreground">
                    {t("list.available_pages")}{" "}
                    {book.voices.map((v) => v.pageIndex).join(", ")}
                  </div>
                  <Button
                    onClick={() => handleBookClick(book.id)}
                    disabled={navigatingToId === book.id}
                    className="w-full"
                  >
                    {navigatingToId === book.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      t("list.read_book")
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
