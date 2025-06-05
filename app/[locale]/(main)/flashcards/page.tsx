import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { FlashcardClient } from "./flashcard-client";
import { FlashcardSkeleton } from "./flashcard-skeleton";
import { api } from "@/app/api/config";

interface Deck {
  id: number;
  name: string;
  flashCards?: { id: number }[];
  authorId: number;
}

export default async function FlashCardPage() {
  const authData = await auth();
  const { userId, getToken } = authData;

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const token = await getToken({ template: "jwt-clerk" });

    // Fetch both public decks and user decks in parallel
    const [publicDecksResponse, userDecksResponse] = await Promise.all([
      fetch(api.deck, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
      fetch(api.userDeck(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }),
    ]);

    let publicDecks: Deck[] = [];
    let userDecks: Deck[] = [];

    if (publicDecksResponse.ok) {
      const publicDecksData = await publicDecksResponse.json();
      publicDecks = Array.isArray(publicDecksData) ? publicDecksData : [];
    }

    if (userDecksResponse.ok) {
      const userDecksData = await userDecksResponse.json();
      userDecks = Array.isArray(userDecksData) ? userDecksData : [];
    }

    return (
      <FlashcardClient
        initialPublicDecks={publicDecks}
        initialUserDecks={userDecks}
      />
    );
  } catch (error) {
    console.error("Error fetching flashcard data:", error);

    // Fallback data in case of API error
    return <FlashcardClient initialPublicDecks={[]} initialUserDecks={[]} />;
  }
}

// Wrap with Suspense in layout or use loading.tsx for better UX
export function FlashCardPageWithSuspense() {
  return (
    <Suspense fallback={<FlashcardSkeleton />}>
      <FlashCardPage />
    </Suspense>
  );
}
