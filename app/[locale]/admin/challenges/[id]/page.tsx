"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Volume2, VolumeX, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChallengeOption {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

type UpdateChallengeOption = Omit<ChallengeOption, "id">;

export default function ChallengePage() {
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<ChallengeOption[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [audioElements, setAudioElements] = useState<{
    [key: number]: HTMLAudioElement;
  }>({});
  const [editingOption, setEditingOption] = useState<ChallengeOption | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeletingOption, setIsDeletingOption] = useState<number | null>(null);

  useEffect(() => {
    const fetchChallengeOptions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/challenge-options?challengeId=${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch challenge options");
        }
        const data = await response.json();
        setOptions(data);

        const audioElementsObj: { [key: number]: HTMLAudioElement } = {};
        data.forEach((option: ChallengeOption) => {
          if (option.audioSrc) {
            const audio = new Audio(option.audioSrc);
            audio.addEventListener("ended", () => setPlayingAudio(null));
            audioElementsObj[option.id] = audio;
          }
        });
        setAudioElements(audioElementsObj);
      } catch (error) {
        console.error("Error fetching challenge options:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch challenge options",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeOptions();

    return () => {
      Object.values(audioElements).forEach((audio) => {
        audio.pause();
        audio.removeEventListener("ended", () => setPlayingAudio(null));
      });
    };
  }, [toast, params.id]);

  const handleAudioPlay = (optionId: number) => {
    if (playingAudio !== null && audioElements[playingAudio]) {
      audioElements[playingAudio].pause();
      audioElements[playingAudio].currentTime = 0;
    }

    if (playingAudio !== optionId && audioElements[optionId]) {
      audioElements[optionId].play().catch((error) => {
        console.error("Error playing audio:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to play audio",
        });
      });
      setPlayingAudio(optionId);
    } else {
      setPlayingAudio(null);
    }
  };

  const handleEdit = (option: ChallengeOption) => {
    setEditingOption(option);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (optionId: number) => {
    try {
      const response = await fetch(`/api/challenge-options/${optionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete option");
      }

      setOptions((prev) => prev.filter((opt) => opt.id !== optionId));
      toast({
        title: "Success",
        description: "Option deleted successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting option:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete option",
      });
    } finally {
      setIsDeletingOption(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingOption) return;

    const formData = new FormData(e.currentTarget);
    const updatedOption: UpdateChallengeOption = {
      textOption: formData.get("textOption") as string,
      correct: formData.get("correct") === "true",
      imageSrc: editingOption.imageSrc,
      audioSrc: editingOption.audioSrc,
    };

    try {
      const response = await fetch(
        `/api/challenge-options/${editingOption.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOption),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update option");
      }

      setOptions((prev) =>
        prev.map((opt) =>
          opt.id === editingOption.id
            ? { ...updatedOption, id: editingOption.id }
            : opt
        )
      );

      toast({
        title: "Success",
        description: "Option updated successfully",
        variant: "success",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating option:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update option",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-bounce text-5xl">🎮</div>
          <p className="text-xl font-medium text-blue-600">
            Loading challenge options...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full hover:bg-blue-50 hover:text-blue-600"
        >
          <Link href="/admin/challenges">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to challenges</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Challenge Options
          </h1>
          <p className="text-gray-600 mt-2">
            Manage challenge options and audio
          </p>
        </div>
      </div>

      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
          <CardTitle className="text-white">Options List</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Option Text</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {options.map((option) => (
                <TableRow key={option.id}>
                  <TableCell className="font-medium">
                    {option.textOption}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        option.correct
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {option.correct ? "Correct" : "Incorrect"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {option.audioSrc ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAudioPlay(option.id)}
                        className="rounded-full hover:bg-blue-50"
                      >
                        {playingAudio === option.id ? (
                          <VolumeX className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-blue-500" />
                        )}
                      </Button>
                    ) : (
                      <span className="text-gray-500">No audio</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {option.imageSrc ? (
                      <span className="text-blue-500">Has image</span>
                    ) : (
                      <span className="text-gray-500">No image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(option)}
                        className="rounded-full hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDeletingOption(option.id)}
                        className="rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Option</DialogTitle>
            <DialogDescription>
              Make changes to the option here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="textOption">Option Text</Label>
                <Input
                  id="textOption"
                  name="textOption"
                  defaultValue={editingOption?.textOption}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      value="true"
                      defaultChecked={editingOption?.correct}
                    />
                    <span>Correct</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      value="false"
                      defaultChecked={!editingOption?.correct}
                    />
                    <span>Incorrect</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeletingOption !== null}
        onOpenChange={(open) => !open && setIsDeletingOption(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              option.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => isDeletingOption && handleDelete(isDeletingOption)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
