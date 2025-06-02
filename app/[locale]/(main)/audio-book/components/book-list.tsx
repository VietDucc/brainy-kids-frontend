"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Headphones, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation("audiobook");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/book");
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast({
          variant: "destructive",
          title: t("error.load_books"),
          description: t("error.try_again"),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [toast, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{t("list.loading_books")}</span>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{t("list.no_books")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span className="truncate max-w-[200px] block">{book.title}</span>
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
              <Link href={`/audio-book/${book.id}`}>
                <Button size="sm" className="w-full">
                  {t("list.read_book")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
