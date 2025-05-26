"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { useAuth } from "@clerk/nextjs";
import { FlashCard, DeckWithCards, StudyMode } from "../types";

export default function FlashCardDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "user" | "public" }>;
}) {
  const unwrappedParams = React.use(params);
  const unwrappedSearchParams = React.use(searchParams);
  const router = useRouter();
  const { userId } = useAuth();
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [studyMode, setStudyMode] = useState<StudyMode>("overview");
  const [studyProgress, setStudyProgress] = useState({
    correct: 0,
    incorrect: 0,
    remaining: 0,
  });

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const response = await fetch(
          unwrappedSearchParams.type === "user"
            ? `/api/user-deck/${unwrappedParams.id}`
            : `/api/deck/${unwrappedParams.id}`
        );

        if (!response.ok) {
          setDeck(null);
          return;
        }

        const deckData = await response.json();
        setDeck(deckData);
      } catch (error) {
        console.error("Failed to fetch deck:", error);
        setDeck(null);
      } finally {
        setLoading(false);
      }
    };
    loadDeck();
  }, [unwrappedParams.id, userId, unwrappedSearchParams.type]);

  const canEdit = deck?.authorId === userId;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (studyMode !== "learn" || !deck?.flashCards) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case "ArrowLeft":
          if (currentCardIndex > 0) {
            setCurrentCardIndex((prev) => prev - 1);
            setIsFlipped(false);
          }
          break;
        case "ArrowRight":
          if (isFlipped && currentCardIndex < deck.flashCards.length - 1) {
            setCurrentCardIndex((prev) => prev + 1);
            setIsFlipped(false);
          }
          break;
        case "Digit1":
        case "Numpad1":
          if (isFlipped) handleCardResponse("incorrect");
          break;
        case "Digit2":
        case "Numpad2":
          if (isFlipped) handleCardResponse("skipped");
          break;
        case "Digit3":
        case "Numpad3":
          if (isFlipped) handleCardResponse("correct");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFlipped, currentCardIndex, studyMode, deck?.flashCards?.length]);

  if (loading) {
    return <Loading text="flashcards" />;
  }

  if (!deck || !deck.flashCards) {
    return (
      <div className="container px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/flashcards")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-center mt-8">
            <p className="text-muted-foreground">Deck not found</p>
          </div>
        </div>
      </div>
    );
  }

  const createCard = () => {
    if (!deck || !newCardFront.trim() || !newCardBack.trim() || !canEdit)
      return;

    const newCard: FlashCard = {
      id: Math.max(0, ...deck.flashCards.map((c) => c.id)) + 1,
      front: newCardFront,
      back: newCardBack,
    };

    setDeck({
      ...deck,
      flashCards: [...deck.flashCards, newCard],
    });
    setNewCardFront("");
    setNewCardBack("");
    setShowCreateCard(false);
  };

  const deleteCard = (cardId: number) => {
    if (!deck || !canEdit) return;
    setDeck({
      ...deck,
      flashCards: deck.flashCards.filter((card) => card.id !== cardId),
    });
    if (currentCardIndex >= deck.flashCards.length - 1) {
      setCurrentCardIndex(Math.max(0, deck.flashCards.length - 2));
    }
  };

  const updateCard = () => {
    if (
      !editingCard ||
      !deck ||
      !newCardFront.trim() ||
      !newCardBack.trim() ||
      !canEdit
    )
      return;

    setDeck({
      ...deck,
      flashCards: deck.flashCards.map((card) =>
        card.id === editingCard.id
          ? { ...card, front: newCardFront, back: newCardBack }
          : card
      ),
    });
    setEditingCard(null);
    setNewCardFront("");
    setNewCardBack("");
  };

  const startStudySession = () => {
    if (!deck) return;
    setStudyMode("learn");
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyProgress({
      correct: 0,
      incorrect: 0,
      remaining: deck.flashCards.length,
    });
    setDeck({
      ...deck,
      flashCards: deck.flashCards.map((card) => ({
        ...card,
        status: undefined,
      })),
    });
  };

  const handleCardResponse = (status: "correct" | "incorrect" | "skipped") => {
    if (!deck) return;

    const updatedCards = [...deck.flashCards];
    updatedCards[currentCardIndex] = {
      ...updatedCards[currentCardIndex],
      status,
      lastReviewed: new Date(),
    };

    setStudyProgress((prev) => ({
      ...prev,
      [status]: prev[status] + 1,
      remaining: prev.remaining - 1,
    }));

    if (currentCardIndex < deck.flashCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setStudyMode("overview");
    }

    setDeck({
      ...deck,
      flashCards: updatedCards,
    });
  };

  return (
    <div className="container px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8 mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/flashcards")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold break-all">
              {deck.name}
            </h1>
            <Badge variant="secondary" className="whitespace-nowrap">
              {deck.flashCards.length} cards
            </Badge>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              onClick={() => setShowCreateCard(true)}
              variant="outline"
              size="sm"
              className="h-9"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
            {studyMode === "overview" && deck.flashCards.length > 0 && (
              <Button onClick={startStudySession} size="sm" className="h-9">
                Start Learning
              </Button>
            )}
          </div>
        </div>

        {deck.flashCards.length === 0 ? (
          <Card className="text-center p-6 sm:p-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">No cards yet</p>
              <Button onClick={() => setShowCreateCard(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Card
              </Button>
            </CardContent>
          </Card>
        ) : studyMode === "learn" ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Progress Bar */}
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{
                  width: `${
                    ((studyProgress.correct + studyProgress.incorrect) /
                      deck.flashCards.length) *
                    100
                  }%`,
                }}
              />
            </div>

            {/* Study Progress */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                Correct: {studyProgress.correct}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Incorrect: {studyProgress.incorrect}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                Remaining: {studyProgress.remaining}
              </Badge>
            </div>

            {/* Current Card */}
            <div className="flex justify-center px-2 sm:px-0">
              <Card
                className="w-full max-w-2xl cursor-pointer relative group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="min-h-[180px] sm:min-h-[200px] flex items-center justify-center">
                    <div className="text-center w-full px-4">
                      <div className="mb-4 flex items-center justify-center gap-2">
                        {isFlipped ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-lg sm:text-xl break-words">
                        {isFlipped
                          ? deck.flashCards[currentCardIndex]?.back
                          : deck.flashCards[currentCardIndex]?.front}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Keyboard shortcuts hint */}
                <div className="absolute bottom-2 left-2 opacity-50 text-xs space-x-2">
                  <span>Space: Flip</span>
                  <span>←→: Navigate</span>
                  {isFlipped && <span>1-2-3: Rate</span>}
                </div>
              </Card>
            </div>

            {/* Study Controls */}
            {isFlipped && (
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCardResponse("incorrect")}
                  className="h-9"
                >
                  Incorrect (1)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCardResponse("skipped")}
                  className="h-9"
                >
                  Skip (2)
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleCardResponse("correct")}
                  className="h-9"
                >
                  Correct (3)
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-600">
                    {
                      deck.flashCards.filter((c) => c.status === "correct")
                        .length
                    }
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Correct
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-red-600">
                    {
                      deck.flashCards.filter((c) => c.status === "incorrect")
                        .length
                    }
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Incorrect
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-600">
                    {deck.flashCards.filter((c) => !c.status).length}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Not Studied
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* All Cards List */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold">All Cards</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {deck.flashCards.map((card) => (
                  <Card
                    key={card.id}
                    className={cn(
                      "h-auto",
                      card.status === "correct" && "border-green-500",
                      card.status === "incorrect" && "border-red-500",
                      !card.status && "hover:border-primary/50"
                    )}
                  >
                    <CardContent className="flex items-start justify-between p-3 sm:p-4">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium text-sm break-words">
                          {card.front}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 break-words">
                          {card.back}
                        </p>
                        {card.lastReviewed && (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            Last reviewed:{" "}
                            {card.lastReviewed.toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 flex-shrink-0"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCard(card);
                              setNewCardFront(card.front);
                              setNewCardBack(card.back);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteCard(card.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        <Dialog
          open={showCreateCard || !!editingCard}
          onOpenChange={(open) => {
            if (!open) {
              setShowCreateCard(false);
              setEditingCard(null);
              setNewCardFront("");
              setNewCardBack("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCard ? "Edit Card" : "Create New Card"}
              </DialogTitle>
              <DialogDescription>
                {editingCard
                  ? "Edit your flashcard content"
                  : "Add a new flashcard to your deck"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="front">Front Side</Label>
                <Textarea
                  id="front"
                  placeholder="Question or term"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="back">Back Side</Label>
                <Textarea
                  id="back"
                  placeholder="Answer or definition"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateCard(false);
                  setEditingCard(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingCard ? updateCard : createCard}>
                {editingCard ? "Save Changes" : "Create Card"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
