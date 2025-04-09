"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Pencil,
  Trash,
  Eye,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { DataTable } from "../components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from "./columns";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
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

// Mock data for courses

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
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

  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const onDelete = (courseId: string) => {
    setCourseToDelete(courseId);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      await handleDelete(courseToDelete);
      setCourseToDelete(null);
    }
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownAction = (courseId: string, action: () => void) => {
    action();
    setOpenDropdown(null);
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id" as const,
      cell: (course: (typeof courses)[0]) => (
        <div className="flex items-center gap-3">
          <span className="font-medium">{course.id}</span>
        </div>
      ),
    },
    {
      header: "Course",
      accessorKey: "title" as const,
      cell: (course: (typeof courses)[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
            🚀
          </div>
          <span className="font-medium">{course.title}</span>
        </div>
      ),
    },

    {
      header: "Image",
      accessorKey: "imageSrc" as const,
      cell: (course: (typeof courses)[0]) => (
        <Image
          src={course.imageSrc}
          alt={course.title}
          width={50}
          height={50}
          className="rounded-lg"
        />
      ),
    },
    {
      header: "Actions",
      accessorKey: "id" as const,
      cell: (course: (typeof courses)[0]) => (
        <DropdownMenu
          open={openDropdown === course.id}
          onOpenChange={(open) => setOpenDropdown(open ? course.id : null)}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-50"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem
              asChild
              className="rounded-lg cursor-pointer"
              onClick={() => setOpenDropdown(null)}
            >
              <Link
                href={`/admin/courses/${course.id}`}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                <span>View Course</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="rounded-lg cursor-pointer"
              onClick={() => setOpenDropdown(null)}
            >
              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="flex items-center"
              >
                <Pencil className="mr-2 h-4 w-4 text-amber-500" />
                <span>Edit Course</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={Number(course.id) === 1}
              onClick={() =>
                Number(course.id) !== 1 &&
                handleDropdownAction(course.id, () => onDelete(course.id))
              }
              className="rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              {Number(course.id) !== 1 ? (
                <span>Delete Course</span>
              ) : (
                <span>Cannot delete default course</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Learning Courses 📚
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage fun learning courses for children
            </p>
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

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-semibold">All Courses</h2>
          </div>
          <DataTable columns={columns} data={courses} loading={loading} />
        </div>
      </div>

      <AlertDialog
        open={!!courseToDelete}
        onOpenChange={(open) => !open && setCourseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this course?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
