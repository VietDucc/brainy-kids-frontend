"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash, Eye, MoreHorizontal } from "lucide-react"
import { DataTable } from "../components/data-table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for units
const unitsData = [
  {
    id: "1",
    title: "Greetings and Introductions",
    courseTitle: "Basic English for Kids",
    lessons: 5,
    status: "published",
    createdAt: "2023-06-05T12:00:00Z",
  },
  {
    id: "2",
    title: "Numbers and Counting",
    courseTitle: "Basic English for Kids",
    lessons: 4,
    status: "published",
    createdAt: "2023-06-10T10:30:00Z",
  },
  {
    id: "3",
    title: "Colors and Shapes",
    courseTitle: "Basic English for Kids",
    lessons: 6,
    status: "published",
    createdAt: "2023-06-15T14:45:00Z",
  },
  {
    id: "4",
    title: "Family Members",
    courseTitle: "Basic English for Kids",
    lessons: 3,
    status: "draft",
    createdAt: "2023-06-20T09:15:00Z",
  },
  {
    id: "5",
    title: "Animals and Pets",
    courseTitle: "Basic English for Kids",
    lessons: 7,
    status: "published",
    createdAt: "2023-06-25T11:20:00Z",
  },
]

export default function UnitsPage() {
  const [units, setUnits] = useState(unitsData)

  const handleDelete = (id: string) => {
    setUnits(units.filter((unit) => unit.id !== id))
  }

  const columns = [
    {
      header: "Title",
      accessorKey: "title" as const,
    },
    {
      header: "Course",
      accessorKey: "courseTitle" as const,
    },
    {
      header: "Lessons",
      accessorKey: "lessons" as const,
    },
    {
      header: "Status",
      accessorKey: "status" as const,
      cell: (unit: (typeof units)[0]) => (
        <Badge variant={unit.status === "published" ? "default" : "secondary"}>
          {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as const,
      cell: (unit: (typeof units)[0]) => <span>{new Date(unit.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      accessorKey: "id" as const,
      cell: (unit: (typeof units)[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/units/${unit.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/units/${unit.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(unit.id)}>
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
          <h1 className="text-3xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground">Manage your course units</p>
        </div>
        <Button asChild>
          <Link href="/admin/units/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Unit
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={units} />
    </div>
  )
}

