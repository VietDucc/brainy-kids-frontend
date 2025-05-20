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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

interface Challenge {
  id: number;
  type: string;
  question: string;
  orderChallenge: number;
}

interface Lesson {
  id: number;
  title: string;
  difficulty: string | null;
  orderIndex: number;
  challenges: Challenge[];
}

interface Unit {
  id: number;
  title: string;
  description: string;
  orderUnit: number;
  lessons: Lesson[];
}

interface DeleteConfirmation {
  type: "unit" | "lesson" | "challenge";
  id: number;
  unitId?: number;
  lessonId?: number;
  name: string;
}

interface EditState {
  type: "unit" | "lesson";
  id: number;
  data: any;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
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
        setUnits(data);
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

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toUpperCase()) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
        case "challenge":
          endpoint = `/api/challenges/${deleteConfirmation.id}`;
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
          case "challenge":
            return prevUnits.map((unit) => {
              if (unit.id === deleteConfirmation.unitId) {
                return {
                  ...unit,
                  lessons: unit.lessons.map((lesson) => {
                    if (lesson.id === deleteConfirmation.lessonId) {
                      return {
                        ...lesson,
                        challenges: lesson.challenges.filter(
                          (challenge) => challenge.id !== deleteConfirmation.id
                        ),
                      };
                    }
                    return lesson;
                  }),
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Skeleton className="h-8 w-48" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32" />
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
                {unit.lessons.map((lesson) => (
                  <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4">
                        <span>
                          Lesson {lesson.orderIndex}: {lesson.title}
                        </span>
                        <Badge
                          className={getDifficultyColor(lesson.difficulty)}
                        >
                          {lesson.difficulty || "No Difficulty"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex items-center justify-between pt-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">
                            {lesson.challenges.length} Challenges
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-blue-500"
                          >
                            <Link
                              href={`/admin/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}/challenges/new`}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Challenge
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
                                    type: "lesson",
                                    id: lesson.id,
                                    data: {
                                      title: lesson.title,
                                      difficulty: lesson.difficulty || "EASY",
                                      orderIndex: lesson.orderIndex,
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
                                className="text-red-500 focus:text-red-500"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Lesson
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {lesson.challenges.map((challenge) => (
                          <div
                            key={challenge.id}
                            className="flex items-center justify-between p-4 rounded-lg border"
                          >
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">{challenge.type}</Badge>
                              <span className="text-sm">
                                {challenge.question}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/admin/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}/challenges/${challenge.id}/edit`}
                                    className="flex items-center"
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Challenge
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-500 focus:text-red-500"
                                  onClick={() =>
                                    setDeleteConfirmation({
                                      type: "challenge",
                                      id: challenge.id,
                                      unitId: unit.id,
                                      lessonId: lesson.id,
                                      name: challenge.question,
                                    })
                                  }
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete Challenge
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
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
              unitId={1}
              initialData={editingItem.data}
              onSuccess={() => {
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
                " This will also delete all lessons and challenges within this unit."}
              {deleteConfirmation?.type === "lesson" &&
                " This will also delete all challenges within this lesson."}
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
