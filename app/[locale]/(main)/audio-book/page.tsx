"use client";

import BookList from "./components/book-list";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation("audiobook");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("page_title")}</h1>
          <p className="text-muted-foreground">{t("page_description")}</p>
        </div>
        <BookList />
      </div>
    </div>
  );
}
