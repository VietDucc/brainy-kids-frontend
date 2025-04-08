"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash, Eye, MoreHorizontal, Sparkles } from "lucide-react"
import { DataTable } from "../components/data-table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for courses
const coursesData = [
  {
    id: "1",
    title: "Animals and Their Sounds",
    level: "Beginner",
    units: 5,
    status: "published",
    createdAt: "2023-06-01T12:00:00Z",
    emoji: "🦁",
  },
  {
    id: "2",
    title: "Colors and Shapes Fun",
    level: "Beginner",
    units: 8,
    status: "published",
    createdAt: "2023-07-15T10:30:00Z",
    emoji: "🌈",
  },
  {
    id: "3",
    title: "Numbers and Counting",
    level: "Beginner",
    units: 6,
    status: "draft",
    createdAt: "2023-08-20T14:45:00Z",
    emoji: "🔢",
  },
  {
    id: "4",
    title: "Family Members",
    level: "Beginner",
    units: 4,
    status: "published",
    createdAt: "2023-09-05T09:15:00Z",
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    id: "5",
    title: "Food and Fruits",
    level: "Beginner",
    units: 7,
    status: "published",
    createdAt: "2023-10-10T11:20:00Z",
    emoji: "🍎",
  },
]

export default function CoursesPage() {
  const [courses, setCourses] = useState(coursesData)

  const handleDelete = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  const columns = [
    {
      header: "Course",
      accessorKey: "title" as const,
      cell: (course: (typeof courses)[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
            {course.emoji}
          </div>
          <span className="font-medium">{course.title}</span>
        </div>
      ),
    },
    {
      header: "Level",
      accessorKey: "level" as const,
      cell: (course: (typeof courses)[0]) => (
        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 rounded-full">
          {course.level}
        </Badge>
      ),
    },
    {
      header: "Units",
      accessorKey: "units" as const,
      cell: (course: (typeof courses)[0]) => <span className="font-semibold text-purple-600">{course.units}</span>,
    },
    {
      header: "Status",
      accessorKey: "status" as const,
      cell: (course: (typeof courses)[0]) => (
        <Badge
          variant={course.status === "published" ? "default" : "secondary"}
          className={`rounded-full ${
            course.status === "published"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
              : "bg-amber-100 text-amber-600 hover:bg-amber-200"
          }`}
        >
          {course.status === "published" ? "Published ✓" : "Draft ✎"}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt" as const,
      cell: (course: (typeof courses)[0]) => (
        <span className="text-gray-500">{new Date(course.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id" as const,
      cell: (course: (typeof courses)[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/admin/courses/${course.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                <span>View Course</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/admin/courses/${course.id}/edit`} className="flex items-center">
                <Pencil className="mr-2 h-4 w-4 text-amber-500" />
                <span>Edit Course</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(course.id)}
              className="rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Course</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Learning Courses 📚
          </h1>
          <p className="text-gray-600 mt-2">Create and manage fun learning courses for children</p>
        </div>
        <Button
          asChild
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
        >
          <Link href="/admin/courses/new" className="flex items-center gap-2 px-6">
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
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  )
}

