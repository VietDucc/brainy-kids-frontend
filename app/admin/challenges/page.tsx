"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Pencil, Trash, Eye, MoreHorizontal, Sparkles } from "lucide-react"
import { DataTable } from "../components/data-table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for challenges
const challengesData = [
  {
    id: "1",
    title: "Animal Sounds Quiz",
    type: "multiple-choice",
    lessonTitle: "Farm Animals",
    unitTitle: "Animals",
    status: "published",
    createdAt: "2023-06-06T14:00:00Z",
    emoji: "🐮",
  },
  {
    id: "2",
    title: "Match Colors with Objects",
    type: "matching",
    lessonTitle: "Primary Colors",
    unitTitle: "Colors and Shapes",
    status: "published",
    createdAt: "2023-06-06T15:30:00Z",
    emoji: "🌈",
  },
  {
    id: "3",
    title: "Complete the Sentence",
    type: "fill-in-blanks",
    lessonTitle: "Simple Sentences",
    unitTitle: "Basic Grammar",
    status: "published",
    createdAt: "2023-06-07T11:45:00Z",
    emoji: "📝",
  },
  {
    id: "4",
    title: "Say the Word",
    type: "speaking",
    lessonTitle: "Pronunciation",
    unitTitle: "Speaking Skills",
    status: "draft",
    createdAt: "2023-06-08T16:15:00Z",
    emoji: "🗣️",
  },
  {
    id: "5",
    title: "Listen and Choose",
    type: "listening",
    lessonTitle: "Sound Recognition",
    unitTitle: "Listening Skills",
    status: "published",
    createdAt: "2023-06-09T10:20:00Z",
    emoji: "👂",
  },
]

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState(challengesData)

  const handleDelete = (id: string) => {
    setChallenges(challenges.filter((challenge) => challenge.id !== id))
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "multiple-choice": "bg-blue-100 text-blue-600 border-blue-200",
      matching: "bg-purple-100 text-purple-600 border-purple-200",
      "fill-in-blanks": "bg-green-100 text-green-600 border-green-200",
      speaking: "bg-orange-100 text-orange-600 border-orange-200",
      listening: "bg-pink-100 text-pink-600 border-pink-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-600 border-gray-200"
  }

  const columns = [
    {
      header: "Challenge",
      accessorKey: "title" as const,
      cell: (challenge: (typeof challenges)[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
            {challenge.emoji}
          </div>
          <span className="font-medium">{challenge.title}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type" as const,
      cell: (challenge: (typeof challenges)[0]) => (
        <Badge variant="outline" className={`rounded-full ${getTypeColor(challenge.type)}`}>
          {challenge.type
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Badge>
      ),
    },
    {
      header: "Lesson",
      accessorKey: "lessonTitle" as const,
    },
    {
      header: "Status",
      accessorKey: "status" as const,
      cell: (challenge: (typeof challenges)[0]) => (
        <Badge
          variant={challenge.status === "published" ? "default" : "secondary"}
          className={`rounded-full ${
            challenge.status === "published"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
              : "bg-amber-100 text-amber-600 hover:bg-amber-200"
          }`}
        >
          {challenge.status === "published" ? "Published ✓" : "Draft ✎"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id" as const,
      cell: (challenge: (typeof challenges)[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/admin/challenges/${challenge.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                <span>Preview Challenge</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={`/admin/challenges/${challenge.id}/edit`} className="flex items-center">
                <Pencil className="mr-2 h-4 w-4 text-amber-500" />
                <span>Edit Challenge</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(challenge.id)}
              className="rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Challenge</span>
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
            Fun Challenges 🎮
          </h1>
          <p className="text-gray-600 mt-2">Create interactive activities to make learning enjoyable</p>
        </div>
        <Button
          asChild
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
        >
          <Link href="/admin/challenges/new" className="flex items-center gap-2 px-6">
            <PlusCircle className="h-4 w-4" />
            <span>Create New Challenge</span>
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold">All Challenges</h2>
        </div>
        <DataTable columns={columns} data={challenges} />
      </div>
    </div>
  )
}

