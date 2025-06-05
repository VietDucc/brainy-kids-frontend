import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { FlashCardDetailClient } from "./flashcard-detail-client";
import { FlashCardDetailSkeleton } from "./flashcard-detail-skeleton";
import { api } from "@/app/api/config";
import { DeckWithCards } from "../types";

interface FlashCardDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "user" | "public" }>;
}

export default async function FlashCardDetailPage({
  params,
  searchParams,
}: FlashCardDetailPageProps) {
  const { id } = await params;
  const { type } = await searchParams;

  const authData = await auth();
  const { userId, getToken } = authData;

  if (!userId) {
    redirect("/sign-in");
  }

  const isUserDeck = type === "user";

  try {
    const token = await getToken({ template: "jwt-clerk" });

    // Fetch deck data
    const response = await fetch(
      isUserDeck
        ? api.userDeckCardById(userId, Number(id))
        : api.deckById(Number(id)),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error("Failed to fetch deck");
    }

    const deck: DeckWithCards = await response.json();

    return (
      <FlashCardDetailClient
        initialDeck={deck}
        deckId={id}
        isUserDeck={isUserDeck}
        userId={userId}
      />
    );
  } catch (error) {
    console.error("Error fetching deck data:", error);
    notFound();
  }
}

// Wrap with Suspense for better UX
export function FlashCardDetailPageWithSuspense(
  props: FlashCardDetailPageProps
) {
  return (
    <Suspense fallback={<FlashCardDetailSkeleton />}>
      <FlashCardDetailPage {...props} />
    </Suspense>
  );
}
