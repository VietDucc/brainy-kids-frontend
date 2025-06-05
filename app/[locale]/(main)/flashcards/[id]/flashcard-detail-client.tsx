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
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { FlashCard, DeckWithCards, StudyMode } from "../types";
import { useToast } from "@/hooks/use-toast";
import BulkImportDialog from "../components/bulk-import-dialog";
import { api } from "@/app/api/config";

interface FlashCardDetailClientProps {
  initialDeck: DeckWithCards;
  deckId: string;
  isUserDeck: boolean;
  userId: string;
}

export function FlashCardDetailClient({
  initialDeck,
  deckId,
  isUserDeck,
  userId,
}: FlashCardDetailClientProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [deck, setDeck] = useState<DeckWithCards>(initialDeck);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [studyMode, setStudyMode] = useState<StudyMode>("overview");
  const [studyProgress, setStudyProgress] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
    remaining: 0,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<number | null>(null);

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

  const createCard = async () => {
    if (!deck || !newCardFront.trim() || !newCardBack.trim()) return;

    try {
      setIsCreating(true);
      const token = await getToken({ template: "jwt-clerk" });

      const response = await fetch(api.flashcard(userId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          front: newCardFront,
          back: newCardBack,
          deckId: Number(deckId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create card");
      }

      const newCard = await response.json();

      setDeck({
        ...deck,
        flashCards: [...deck.flashCards, newCard],
      });

      setNewCardFront("");
      setNewCardBack("");
      setShowCreateCard(false);

      toast({
        variant: "success",
        title: "Card created",
        description: "Flashcard has been successfully created.",
      });
    } catch (error) {
      console.error("Error creating card:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create card. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteCard = async (cardId: number) => {
    if (!deck) return;

    try {
      setDeletingCardId(cardId);
      const token = await getToken({ template: "jwt-clerk" });

      const response = await fetch(api.cardById(userId, cardId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete card");
      }

      setDeck({
        ...deck,
        flashCards: deck.flashCards.filter((card) => card.id !== cardId),
      });

      if (currentCardIndex >= deck.flashCards.length - 1) {
        setCurrentCardIndex(Math.max(0, deck.flashCards.length - 2));
      }

      toast({
        variant: "success",
        title: "Card deleted",
        description: "Flashcard has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete card. Please try again.",
      });
    } finally {
      setDeletingCardId(null);
    }
  };

  const updateCard = async () => {
    if (!editingCard || !deck || !newCardFront.trim() || !newCardBack.trim())
      return;

    try {
      setIsUpdating(true);
      const token = await getToken({ template: "jwt-clerk" });

      const response = await fetch(api.cardById(userId, editingCard.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          front: newCardFront,
          back: newCardBack,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update card");
      }

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

      toast({
        variant: "success",
        title: "Card updated",
        description: "Flashcard has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating card:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update card. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const startStudySession = () => {
    if (!deck) return;
    setStudyMode("learn");
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStudyProgress({
      correct: 0,
      incorrect: 0,
      skipped: 0,
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
      [status]: prev[status as keyof typeof prev] + 1,
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

  const bulkImportCards = async (
    cards: { front: string; back: string; deckId: number }[]
  ) => {
    try {
      const token = await getToken({ template: "jwt-clerk" });

      const response = await fetch(api.bulkCreateCards(userId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cards),
      });

      if (!response.ok) {
        throw new Error("Failed to import cards");
      }

      await response.json();

      // Refresh deck data
      const deckResponse = await fetch(
        isUserDeck
          ? api.userDeckCardById(userId, Number(deckId))
          : api.deckById(Number(deckId)),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (deckResponse.ok) {
        const deckData = await deckResponse.json();
        setDeck(deckData);
      }

      toast({
        variant: "success",
        title: "Cards imported successfully",
        description: `${cards.length} flashcards have been added to your deck.`,
      });
    } catch (error) {
      console.error("Error importing cards:", error);
      toast({
        variant: "destructive",
        title: "Import failed",
        description: "Failed to import cards. Please try again.",
      });
      throw error;
    }
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
            {isUserDeck && (
              <>
                <Button
                  onClick={() => setShowCreateCard(true)}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
                <Button
                  onClick={() => setShowBulkImport(true)}
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Import
                </Button>
              </>
            )}
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
              {isUserDeck && (
                <Button onClick={() => setShowCreateCard(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Card
                </Button>
              )}
            </CardContent>
          </Card>
        ) : studyMode === "learn" ? (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setStudyMode("overview")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit Study
              </Button>
              <div className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {deck.flashCards.length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{
                  width: `${
                    ((studyProgress.correct +
                      studyProgress.incorrect +
                      studyProgress.skipped) /
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
                Skipped: {studyProgress.skipped}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
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
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {
                      deck.flashCards.filter((c) => c.status === "skipped")
                        .length
                    }
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Skipped
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-muted-foreground">
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
                      card.status === "skipped" && "border-yellow-500",
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
                            {new Date(card.lastReviewed).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {isUserDeck && (
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
                              disabled={deletingCardId === card.id}
                            >
                              {deletingCardId === card.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
                  disabled={isCreating || isUpdating}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="back">Back Side</Label>
                <Textarea
                  id="back"
                  placeholder="Answer or definition"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  disabled={isCreating || isUpdating}
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
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={editingCard ? updateCard : createCard}
                size="sm"
                disabled={
                  isCreating ||
                  isUpdating ||
                  !newCardFront.trim() ||
                  !newCardBack.trim()
                }
              >
                {isCreating || isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingCard ? "Saving..." : "Creating..."}
                  </>
                ) : editingCard ? (
                  "Save Changes"
                ) : (
                  "Create Card"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BulkImportDialog
          open={showBulkImport}
          onOpenChange={setShowBulkImport}
          deckId={Number(deckId)}
          onImport={bulkImportCards}
        />
      </div>
    </div>
  );
}
