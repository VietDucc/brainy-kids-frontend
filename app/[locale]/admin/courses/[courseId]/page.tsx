"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UnitEditForm } from "./components/UnitEditForm";
import { LessonEditForm } from "./components/LessonEditForm";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Lesson {
  id: number;
  title: string;
  orderLesson: number;
}

interface Unit {
  id: number;
  title: string;
  description: string;
  orderUnit: number;
  lessons: Lesson[];
}

interface DeleteConfirmation {
  type: "unit" | "lesson";
  id: number;
  unitId?: number;
  name: string;
}

interface EditState {
  type: "unit" | "lesson";
  id: number;
  unitId?: number;
  data: {
    title: string;
    description?: string;
    orderUnit?: number;
    orderLesson?: number;
  };
}

interface ChallengeOption {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

interface Challenge {
  id: number;
  type: "SELECT" | "SINGLE" | "MULTI";
  imgSrc: string | null;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
}

interface Vocabulary {
  id: number;
  word: string;
  meaning: string;
  example: string;
}

interface LessonDetail extends Lesson {
  content?: string;
  challenges: Challenge[];
  vocabularies: Vocabulary[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(
    null
  );
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation | null>(null);
  const [editingItem, setEditingItem] = useState<EditState | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/units/${courseId}`);
        const data = await response.json();
        // Sort units by orderUnit
        const sortedUnits = [...data].sort((a, b) => a.orderUnit - b.orderUnit);
        // Sort lessons within each unit by orderLesson
        const unitsWithSortedLessons = sortedUnits.map((unit) => ({
          ...unit,
          lessons: (unit.lessons || []).sort(
            (a, b) => a.orderLesson - b.orderLesson
          ),
        }));
        setUnits(unitsWithSortedLessons);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast({
          title: "Error fetching units",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [courseId]);

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      let endpoint = "";
      switch (deleteConfirmation.type) {
        case "unit":
          endpoint = `/api/units/${deleteConfirmation.id}`;
          break;
        case "lesson":
          endpoint = `/api/lessons/${deleteConfirmation.id}`;
          break;
      }

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setUnits((prevUnits) => {
        switch (deleteConfirmation.type) {
          case "unit":
            return prevUnits.filter(
              (unit) => unit.id !== deleteConfirmation.id
            );
          case "lesson":
            return prevUnits.map((unit) => {
              if (unit.id === deleteConfirmation.unitId) {
                return {
                  ...unit,
                  lessons: unit.lessons.filter(
                    (lesson) => lesson.id !== deleteConfirmation.id
                  ),
                };
              }
              return unit;
            });
          default:
            return prevUnits;
        }
      });

      toast({
        title: `${deleteConfirmation.type} deleted successfully`,
        variant: "success",
      });
    } catch (error) {
      console.error(`Error deleting ${deleteConfirmation.type}:`, error);
      toast({
        title: `Error deleting ${deleteConfirmation.type}`,
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleLessonClick = async (lessonId: number) => {
    if (selectedLesson?.id === lessonId) return;

    try {
      setLoadingLesson(true);
      console.log("Fetching lesson data for ID:", lessonId);
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) throw new Error("Failed to fetch lesson details");

      const data = await response.json();
      console.log("Fetched lesson data:", data);
      setSelectedLesson(data);
      console.log("Updated selectedLesson state");
    } catch (error) {
      console.error("Error fetching lesson details:", error);
      toast({
        title: "Error fetching lesson details",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoadingLesson(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/courses"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <h1 className="text-xl font-semibold">Course Structure</h1>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/courses"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <h1 className="text-xl font-semibold">Course Structure</h1>
        </div>
        <Button asChild>
          <Link href={`/admin/courses/${courseId}/units/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Unit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {units.map((unit) => (
          <Card key={unit.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl">
                  Unit {unit.orderUnit}: {unit.title}
                </CardTitle>
                <CardDescription>{unit.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-blue-500"
                >
                  <Link
                    href={`/admin/courses/${courseId}/units/${unit.id}/lessons/new`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        setEditingItem({
                          type: "unit",
                          id: unit.id,
                          data: {
                            title: unit.title,
                            description: unit.description,
                            orderUnit: unit.orderUnit,
                          },
                        })
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Unit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setDeleteConfirmation({
                          type: "unit",
                          id: unit.id,
                          name: unit.title,
                        })
                      }
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Unit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {(unit.lessons || []).map((lesson) => (
                  <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`}>
                    <AccordionTrigger
                      className="hover:no-underline transition-all duration-200"
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          Lesson {lesson.orderLesson}: {lesson.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 px-1">
                        {loadingLesson ? (
                          <div className="space-y-4">
                            <div className="h-8 bg-gray-100 animate-pulse rounded-md w-1/3" />
                            <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
                            <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
                          </div>
                        ) : selectedLesson ? (
                          <div className="w-full space-y-8">
                            {/* Challenges Section */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Challenges (
                                  {selectedLesson.challenges?.length || 0})
                                </h3>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Challenge
                                </Button>
                              </div>

                              <div className="space-y-4">
                                {selectedLesson.challenges?.map((challenge) => (
                                  <div
                                    key={challenge.id}
                                    className="group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <div className="p-4 space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                                            {challenge.orderChallenge + 1}
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              "font-medium",
                                              challenge.type === "SELECT" &&
                                                "border-purple-200 bg-purple-50 text-purple-700",
                                              challenge.type === "SINGLE" &&
                                                "border-blue-200 bg-blue-50 text-blue-700",
                                              challenge.type === "MULTI" &&
                                                "border-green-200 bg-green-50 text-green-700"
                                            )}
                                          >
                                            {challenge.type}
                                          </Badge>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                              <Pencil className="h-4 w-4 mr-2" />
                                              Edit Challenge
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">
                                              <Trash className="h-4 w-4 mr-2" />
                                              Delete Challenge
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>

                                      {challenge.imgSrc && (
                                        <div className="relative w-full h-48 rounded-md overflow-hidden">
                                          <Image
                                            src={challenge.imgSrc}
                                            alt={challenge.question}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                          />
                                        </div>
                                      )}

                                      <p className="text-gray-900 font-medium">
                                        {challenge.question}
                                      </p>

                                      {challenge.type !== "MULTI" && (
                                        <div className="grid grid-cols-1 gap-2">
                                          {challenge.challengesOption?.map(
                                            (option) => (
                                              <div
                                                key={option.id}
                                                className={cn(
                                                  "p-3 rounded-md border transition-all duration-200",
                                                  option.correct
                                                    ? "border-green-200 bg-green-50 text-green-900"
                                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                )}
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span className="text-sm">
                                                    {option.textOption}
                                                  </span>
                                                  {option.correct && (
                                                    <Badge className="bg-green-600">
                                                      Correct
                                                    </Badge>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}

                                      {challenge.type === "MULTI" && (
                                        <div className="p-4 rounded-md border border-blue-200 bg-blue-50">
                                          <p className="text-sm text-blue-700 font-medium">
                                            Multi-word Translation Challenge
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Vocabularies Section */}
                            {selectedLesson.vocabularies &&
                              selectedLesson.vocabularies.length > 0 && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      Vocabularies (
                                      {selectedLesson.vocabularies.length})
                                    </h3>
                                    <Button variant="outline" size="sm">
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Vocabulary
                                    </Button>
                                  </div>

                                  <div className="grid gap-4 md:grid-cols-2">
                                    {selectedLesson.vocabularies.map(
                                      (vocab) => (
                                        <div
                                          key={vocab.id}
                                          className="p-4 border rounded-lg bg-white space-y-2"
                                        >
                                          <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-900">
                                              {vocab.word}
                                            </h4>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                >
                                                  <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                  <Pencil className="h-4 w-4 mr-2" />
                                                  Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                  <Trash className="h-4 w-4 mr-2" />
                                                  Delete
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                          <p className="text-sm text-gray-600">
                                            {vocab.meaning}
                                          </p>
                                          <p className="text-sm text-gray-500 italic">
                                            Example: {vocab.example}
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4 mr-2" />
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setEditingItem({
                                        type: "lesson",
                                        id: lesson.id,
                                        unitId: unit.id,
                                        data: {
                                          title: lesson.title,
                                          orderLesson: lesson.orderLesson,
                                        },
                                      })
                                    }
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Lesson
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setDeleteConfirmation({
                                        type: "lesson",
                                        id: lesson.id,
                                        unitId: unit.id,
                                        name: lesson.title,
                                      })
                                    }
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Lesson
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Edit {editingItem?.type === "unit" ? "Unit" : "Lesson"}
            </DialogTitle>
          </DialogHeader>
          {editingItem?.type === "unit" ? (
            <UnitEditForm
              unitId={editingItem.id}
              initialData={editingItem.data}
              onCancel={() => setEditingItem(null)}
              onSuccess={(data) => {
                setUnits((prevUnits) =>
                  prevUnits.map((unit) =>
                    unit.id === editingItem.id ? { ...unit, ...data } : unit
                  )
                );
                setEditingItem(null);
              }}
            />
          ) : editingItem?.type === "lesson" ? (
            <LessonEditForm
              lessonId={editingItem.id}
              unitId={editingItem.unitId || 0}
              initialData={editingItem.data}
              onSuccess={(data) => {
                setUnits((prevUnits) =>
                  prevUnits.map((unit) => ({
                    ...unit,
                    lessons: unit.lessons.map((lesson) =>
                      lesson.id === editingItem.id
                        ? { ...lesson, ...data }
                        : lesson
                    ),
                  }))
                );
                setEditingItem(null);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteConfirmation}
        onOpenChange={(open) => !open && setDeleteConfirmation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deleteConfirmation?.type} &quot;
              {deleteConfirmation?.name}&quot;.
              {deleteConfirmation?.type === "unit" &&
                " This will also delete all lessons within this unit."}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete {deleteConfirmation?.type}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
