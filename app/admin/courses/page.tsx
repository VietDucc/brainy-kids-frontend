"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Trash,
  Eye,
  MoreHorizontal,
  BookOpen,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
import { CourseEditForm } from "./[courseId]/components/CourseEditForm";

interface Course {
  id: string;
  title: string;
  imageSrc: string;
  description: string;
  progress?: number;
  totalUnits?: number;
  totalLessons?: number;
  totalChallenges?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();

        // Transform data to include statistics
        const coursesWithStats = data.map((course: Course) => ({
          ...course,
          progress: Math.floor(Math.random() * 100), // Replace with actual progress
          totalUnits: 5, // Replace with actual count from units API
          totalLessons: 15,
          totalChallenges: 45,
        }));

        setCourses(coursesWithStats);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error fetching courses",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string) => {
    try {
      await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      toast({
        variant: "success",
        title: "Course deleted successfully",
      });
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        variant: "error",
        title: "Error deleting course",
      });
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Learning Courses
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <BookOpen className="h-4 w-4" />
              <span>Manage and organize your educational content</span>
            </div>
          </div>
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
          >
            <Link
              href="/admin/courses/new"
              className="flex items-center gap-2 px-6"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Course</span>
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-gray-100 rounded-t-lg" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-100 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col"
              >
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="flex-shrink-0"
                >
                  <CardHeader className="relative h-36 p-0">
                    <Image
                      src={
                        (course.imageSrc !== "string" && course.imageSrc) ||
                        "/images/course-placeholder.jpg"
                      }
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/course-placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {course.title}
                      </h3>
                    </div>
                  </CardHeader>
                </Link>
                <CardContent className="p-3 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {course.description}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      <div className="flex items-center justify-center gap-1 text-blue-600">
                        <div className="font-semibold">{course.totalUnits}</div>
                        <div className="opacity-80">Units</div>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-purple-600">
                        <div className="font-semibold">
                          {course.totalLessons}
                        </div>
                        <div className="opacity-80">Lessons</div>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <div className="font-semibold">
                          {course.totalChallenges}
                        </div>
                        <div className="opacity-80">Tasks</div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">
                          Progress
                        </span>
                        <span className="font-semibold text-blue-600">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View Course
                      </Link>
                      <DropdownMenu
                        open={openDropdownId === course.id}
                        onOpenChange={(open) => {
                          setOpenDropdownId(open ? course.id : null);
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingCourse(course);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit Course</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCourseToDelete(course.id);
                              setOpenDropdownId(null);
                            }}
                            className="text-red-500 focus:text-red-500 cursor-pointer"
                            disabled={course.id == "1"}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>
                              {course.id == "1"
                                ? "Cannot delete default"
                                : "Delete"}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={!!editingCourse}
        onOpenChange={(open) => !open && setEditingCourse(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <CourseEditForm
              courseId={editingCourse.id}
              initialData={{
                title: editingCourse.title,
                description: editingCourse.description,
                imageSrc: editingCourse.imageSrc,
              }}
              onCancel={() => setEditingCourse(null)}
              onSuccess={(data) => {
                setCourses((prevCourses) =>
                  prevCourses.map((course) =>
                    course.id === editingCourse.id
                      ? { ...course, ...data }
                      : course
                  )
                );
                setEditingCourse(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!courseToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCourseToDelete(null);
            setOpenDropdownId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course and all its associated
              units, lessons, and challenges. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (courseToDelete) {
                  handleDelete(courseToDelete);
                  setCourseToDelete(null);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
