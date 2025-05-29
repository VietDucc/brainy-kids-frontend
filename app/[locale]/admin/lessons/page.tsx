"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash, Eye, MoreHorizontal } from "lucide-react"
import { DataTable } from "../components/data-table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for lessons
const lessonsData = [
  {
    id: "1",
    title: "Saying Hello",
    unitTitle: "Greetings and Introductions",
    courseTitle: "Basic English for Kids",
    challenges: 3,
    status: "published",
    createdAt: "2023-06-06T12:00:00Z",
  },
  {
    id: "2",
    title: "Introducing Yourself",
    unitTitle: "Greetings and Introductions",
    courseTitle: "Basic English for Kids",
    challenges: 4,
    status: "published",
    createdAt: "2023-06-07T10:30:00Z",
  },
  {
    id: "3",
    title: "Asking Names",
    unitTitle: "Greetings and Introductions",
    courseTitle: "Basic English for Kids",
    challenges: 5,
    status: "published",
    createdAt: "2023-06-08T14:45:00Z",
  },
  {
    id: "4",
    title: "Saying Goodbye",
    unitTitle: "Greetings and Introductions",
    courseTitle: "Basic English for Kids",
    challenges: 2,
    status: "draft",
    createdAt: "2023-06-09T09:15:00Z",
  },
  {
    id: "5",
    title: "Polite Expressions",
    unitTitle: "Greetings and Introductions",
    courseTitle: "Basic English for Kids",
    challenges: 6,
    status: "published",
    createdAt: "2023-06-10T11:20:00Z",
  },
]

export default function LessonsPage() {
  const [lessons, setLessons] = useState(lessonsData)

  const handleDelete = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id))
  }

  const columns = [
    {
      header: "Title",
      accessorKey: "title" as const,
    },
    {
      header: "Unit",
      accessorKey: "unitTitle" as const,
    },
    {
      header: "Course",
      accessorKey: "courseTitle" as const,
    },
    {
      header: "Challenges",
      accessorKey: "challenges" as const,
    },
    {
      header: "Status",
      accessorKey: "status" as const,
      cell: (lesson: (typeof lessons)[0]) => (
        <Badge variant={lesson.status === "published" ? "default" : "secondary"}>
          {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as const,
      cell: (lesson: (typeof lessons)[0]) => <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      accessorKey: "id" as const,
      cell: (lesson: (typeof lessons)[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/lessons/${lesson.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/lessons/${lesson.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(lesson.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
          <p className="text-muted-foreground">Manage your unit lessons</p>
        </div>
        <Button asChild>
          <Link href="/admin/lessons/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Lesson
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={lessons} />
    </div>
  )
}

