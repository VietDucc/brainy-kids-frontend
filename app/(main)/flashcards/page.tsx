"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  BookOpen,
  Edit,
  Trash2,
  MoreVertical,
  Folder,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Deck {
  id: number;
  name: string;
  flashCards?: { id: number }[];
}

export default function FlashCardApp() {
  const router = useRouter();
  const [publicDecks, setPublicDecks] = useState<Deck[]>([]);
  const [userDecks, setUserDecks] = useState<Deck[]>([]);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [newDeckName, setNewDeckName] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDecks = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/deck");
        if (!response.ok) {
          throw new Error("Failed to fetch decks");
        }
        const publicDecks = await response.json();

        const userResponse = await fetch("/api/user-deck");
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user decks");
        }
        const userDecks = await userResponse.json();

        const publicDecksArray = Array.isArray(publicDecks) ? publicDecks : [];
        const userDecksArray = Array.isArray(userDecks) ? userDecks : [];
        setPublicDecks(publicDecksArray);
        setUserDecks(userDecksArray);
      } catch (error) {
        console.error("Error fetching decks:", error);
        setPublicDecks([]);
        setUserDecks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  const createDeck = async () => {
    if (!newDeckName.trim()) return;

    try {
      const response = await fetch("/api/user-deck", {
        method: "POST",
        body: JSON.stringify({ name: newDeckName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create deck");
      }

      const newDeck = await response.json();
      toast({
        variant: "success",
        title: "Deck created successfully",
        description: "Your new deck has been created",
      });
      setUserDecks((prev) => [...prev, newDeck]);
      setNewDeckName("");
      setShowCreateDeck(false);
    } catch (error) {
      console.error("Error creating deck:", error);
      toast({
        variant: "destructive",
        title: "Error creating deck",
        description: "Please try again",
      });
    }
  };

  const updateDeck = async () => {
    if (!editingDeck || !newDeckName.trim()) return;

    try {
      const response = await fetch(`/api/deck/${editingDeck.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newDeckName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update deck");
      }

      const updatedDeck = await response.json();
      setUserDecks((prev) =>
        prev.map((deck) => (deck.id === editingDeck.id ? updatedDeck : deck))
      );
      setEditingDeck(null);
      setNewDeckName("");
    } catch (error) {
      console.error("Error updating deck:", error);
    }
  };

  const deleteDeck = async (deckId: number) => {
    try {
      const response = await fetch(`/api/deck/${deckId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete deck");
      }

      toast({
        variant: "success",
        title: "Deck deleted successfully",
        description: "Your deck has been deleted",
      });

      setUserDecks((prev) => prev.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast({
        variant: "destructive",
        title: "Error deleting deck",
        description: "Please try again",
      });
    }
  };

  if (loading) {
    return <Loading text="flashcards" />;
  }

  return (
    <div className="container px-6 md:px-0 py-2 sm:py-6 space-y-4 sm:space-y-8 max-w-7xl mx-auto">
      <div className="space-y-1 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              Create and manage your flashcard decks
            </p>
          </div>
        </div>
        <Separator className="my-2 sm:my-6" />
      </div>

      <Dialog open={showCreateDeck} onOpenChange={setShowCreateDeck}>
        <DialogContent className="sm:max-w-[425px] mx-2 sm:mx-0">
          <DialogHeader>
            <DialogTitle>Create New Deck</DialogTitle>
            <DialogDescription>
              Give your new flashcard deck a name. You can add cards to it
              later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-left">
                Deck Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., English Vocabulary"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDeck(false)}>
              Cancel
            </Button>
            <Button onClick={createDeck} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Deck
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-2 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-semibold">My Decks</h2>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-4">
          {userDecks.map((deck) => (
            <div key={deck.id} className="group relative">
              <div
                className="aspect-square rounded-lg sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-1.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center group-hover:scale-105 group-hover:border-blue-300 dark:group-hover:border-blue-700 cursor-pointer"
                onClick={() => router.push(`/flashcards/${deck.id}`)}
              >
                <Folder className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mb-1 sm:mb-3 group-hover:text-blue-600 flex-shrink-0" />
                <div className="w-full">
                  <p className="text-[10px] sm:text-sm font-medium text-center truncate">
                    {deck.name}
                  </p>
                  <p className="text-[8px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 text-center">
                    {deck.flashCards?.length || 0} cards
                  </p>
                </div>
              </div>

              <div className="absolute top-0.5 right-0.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 sm:h-8 sm:w-8 p-0"
                    >
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingDeck(deck);
                        setNewDeckName(deck.name);
                      }}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Rename
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400 gap-2"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Deck</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deck.name}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteDeck(deck.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          <div
            className="aspect-square rounded-lg sm:rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-1.5 sm:p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer flex flex-col items-center justify-center"
            onClick={() => setShowCreateDeck(true)}
          >
            <Plus className="w-6 h-6 sm:w-12 sm:h-12 text-gray-400 mb-1 sm:mb-2" />
            <p className="text-[10px] sm:text-sm font-medium text-muted-foreground text-center">
              Create New Deck
            </p>
          </div>

          {userDecks.length === 0 && (
            <div className="col-span-full text-center p-4 sm:p-8">
              <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-2 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-4">
                You haven&apos;t created any decks yet
              </p>
              <Button
                onClick={() => setShowCreateDeck(true)}
                size="sm"
                className="h-8 sm:h-9 gap-2"
              >
                <Plus className="w-4 h-4" />
                Create First Deck
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Public Decks Section */}
      <div className="space-y-2 sm:space-y-6">
        <h2 className="text-base sm:text-xl font-semibold">Public Decks</h2>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-4">
          {publicDecks.map((deck) => (
            <div
              key={deck.id}
              className="group relative cursor-pointer"
              onClick={() => router.push(`/flashcards/${deck.id}`)}
            >
              <div className="aspect-square rounded-lg sm:rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-1.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center group-hover:scale-105 group-hover:border-green-300 dark:group-hover:border-green-700">
                <Folder className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mb-1 sm:mb-3 group-hover:text-green-600 flex-shrink-0" />
                <div className="w-full">
                  <p className="text-[10px] sm:text-sm font-medium text-center truncate">
                    {deck.name}
                  </p>
                  <p className="text-[8px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 text-center">
                    {deck.flashCards?.length || 0} cards
                  </p>
                </div>
              </div>
            </div>
          ))}

          {publicDecks.length === 0 && (
            <div className="col-span-full text-center p-4 sm:p-8">
              <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-2 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                No public decks available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Deck Dialog */}
      <Dialog open={!!editingDeck} onOpenChange={() => setEditingDeck(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Deck</DialogTitle>
            <DialogDescription>
              Enter a new name for your deck
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Deck Name</Label>
              <Input
                id="edit-name"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDeck(null)}>
              Cancel
            </Button>
            <Button onClick={updateDeck}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
