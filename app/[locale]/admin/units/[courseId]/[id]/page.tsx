"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash, ArrowLeft } from "lucide-react";
import Link from "next/link";
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
import Loading from "@/app/loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
type ChallengeOption = {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
};

type Challenge = {
  id: number;
  type: "SELECT" | "ASSIST" | "INPUT";
  imgSrc: string | null;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
  challengesProgress: [];
};

type Vocabulary = {
  id: number;
  note: string;
  orderVocabulary: number;
  eng: string;
  vie: string;
};

type Lesson = {
  id: number;
  title: string;
  difficulty: string | null;
  orderIndex: number;
  challenges: Challenge[];
  vocabularies: Vocabulary[];
};

type Unit = {
  id: number;
  title: string;
  description: string;
  orderUnit: number;
  lessons: Lesson[];
};

export default function UnitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const unitId = params.id as string;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch(`/api/units/${params.courseId}`);
        if (!response.ok) throw new Error("Failed to fetch unit");
        const units: Unit[] = await response.json();
        const currentUnit = units.find((u) => u.id === Number(params.id));
        setUnit(currentUnit || null);
      } catch (error) {
        console.error("Error fetching unit:", error);
        toast({
          variant: "error",
          title: "Error fetching unit",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [params.courseId, params.id, toast]);

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      const response = await fetch(
        `/api/units/${params.courseId}/lessons/${lessonId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete lesson");
      }

      if (unit) {
        setUnit({
          ...unit,
          lessons: unit.lessons.filter((lesson) => lesson.id !== lessonId),
        });
        toast({
          variant: "success",
          title: "Lesson deleted successfully",
        });
      }
      setLessonToDelete(null);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast({
        variant: "error",
        title: "Error deleting lesson",
      });
    }
  };

  const handleDeleteUnit = async () => {
    try {
      const response = await fetch(`/api/units/${unitId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete unit");
      }

      router.push("/admin/units");
      toast({
        variant: "success",
        title: "Unit deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast({
        variant: "error",
        title: "Error deleting unit",
      });
    }
  };

  if (loading) {
    return <Loading text="unit" />;
  }

  if (!unit) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl">😢</div>
          <p className="text-xl font-medium text-gray-600">Unit not found</p>
          <Button asChild className="mt-4">
            <Link href="/admin/units">Back to Units</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/units">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{unit.title}</h1>
            <p className="text-muted-foreground">{unit.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/units/${unitId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Unit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => handleDeleteUnit()}>
            <Trash className="h-4 w-4 mr-2" />
            Delete Unit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unit Information</CardTitle>
          <CardDescription>
            Order: {unit.orderUnit} | Total Lessons: {unit.lessons.length}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {unit.lessons.map((lesson) => (
              <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <span>{lesson.title}</span>
                    <Badge variant="outline">Order: {lesson.orderIndex}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {/* Challenges Section */}
                    {lesson.challenges.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Challenges</h4>
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                          {lesson.challenges.map((challenge) => (
                            <div
                              key={challenge.id}
                              className="mb-4 p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge>{challenge.type}</Badge>
                                <Badge variant="outline">
                                  Order: {challenge.orderChallenge}
                                </Badge>
                              </div>
                              <p className="font-medium mb-2">
                                {challenge.question}
                              </p>
                              <div className="grid gap-2">
                                {challenge.challengesOption.map((option) => (
                                  <div
                                    key={option.id}
                                    className={`p-2 rounded-md ${
                                      option.correct
                                        ? "bg-green-100"
                                        : "bg-gray-100"
                                    }`}
                                  >
                                    <p>{option.textOption}</p>
                                    {option.audioSrc && (
                                      <audio
                                        controls
                                        src={option.audioSrc}
                                        className="mt-2"
                                      />
                                    )}
                                    {option.imageSrc && (
                                      <img
                                        src={option.imageSrc}
                                        alt={option.textOption}
                                        className="mt-2 max-w-[200px] rounded"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}

                    {/* Vocabularies Section */}
                    {lesson.vocabularies.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Vocabularies</h4>
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                          <div className="space-y-2">
                            {lesson.vocabularies.map((vocab) => (
                              <div
                                key={vocab.id}
                                className="p-4 border rounded-lg"
                              >
                                <div className="flex justify-between mb-2">
                                  <span className="font-medium">
                                    {vocab.eng}
                                  </span>
                                  <span>{vocab.vie}</span>
                                </div>
                                {vocab.note && (
                                  <p className="text-sm text-muted-foreground">
                                    Note: {vocab.note}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <AlertDialog
        open={lessonToDelete !== null}
        onOpenChange={(open) => !open && setLessonToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lesson and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                lessonToDelete && handleDeleteLesson(lessonToDelete)
              }
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete Lesson
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
