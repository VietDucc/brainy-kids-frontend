"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for lessons
const lessonsData = [
  {
    id: "1",
    title: "Meet the Farm Animals",
    content: "In this lesson, we'll learn about different farm animals and the sounds they make.",
    unitId: "1",
    unitTitle: "Farm Animals",
    courseTitle: "Animals and Their Sounds",
    challenges: 3,
    status: "published",
    createdAt: "2023-06-06T12:00:00Z",
    emoji: "🐮",
  },
  {
    id: "2",
    title: "Animal Homes",
    content: "Learn where different farm animals live and what their homes are called.",
    unitId: "1",
    unitTitle: "Farm Animals",
    courseTitle: "Animals and Their Sounds",
    challenges: 4,
    status: "published",
    createdAt: "2023-06-07T10:30:00Z",
    emoji: "🏡",
  },
  {
    id: "3",
    title: "Baby Animals",
    content: "Discover what baby farm animals are called and how they grow.",
    unitId: "1",
    unitTitle: "Farm Animals",
    courseTitle: "Animals and Their Sounds",
    challenges: 5,
    status: "published",
    createdAt: "2023-06-08T14:45:00Z",
    emoji: "🐣",
  },
  {
    id: "4",
    title: "Animal Sounds",
    content: "Learn the different sounds that farm animals make.",
    unitId: "1",
    unitTitle: "Farm Animals",
    courseTitle: "Animals and Their Sounds",
    challenges: 2,
    status: "draft",
    createdAt: "2023-06-09T09:15:00Z",
    emoji: "🔊",
  },
  {
    id: "5",
    title: "What Animals Eat",
    content: "Learn about what different farm animals like to eat.",
    unitId: "1",
    unitTitle: "Farm Animals",
    courseTitle: "Animals and Their Sounds",
    challenges: 6,
    status: "published",
    createdAt: "2023-06-10T11:20:00Z",
    emoji: "🌾",
  },
]

// Mock data for units
const units = [
  { id: "1", title: "Farm Animals", courseTitle: "Animals and Their Sounds" },
  { id: "2", title: "Wild Animals", courseTitle: "Animals and Their Sounds" },
  { id: "3", title: "Primary Colors", courseTitle: "Colors and Shapes Fun" },
  { id: "4", title: "Shapes All Around", courseTitle: "Colors and Shapes Fun" },
  { id: "5", title: "Counting to 10", courseTitle: "Numbers and Counting" },
]

const emojis = [
  "🐮",
  "🐷",
  "🐔",
  "🐴",
  "🦁",
  "🐯",
  "🐘",
  "🦒",
  "🦓",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🦄",
  "🐢",
  "🐬",
  "🐙",
  "🦋",
  "🌈",
  "⭐",
  "🔢",
  "🎨",
  "📚",
  "🎯",
  "🎮",
  "🎪",
  "🎭",
  "🎤",
  "🎵",
  "🎹",
]

export default function EditLessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    unitId: "",
    status: "",
    emoji: "🐮",
  })

  useEffect(() => {
    // Simulate API fetch
    setIsFetching(true)
    setTimeout(() => {
      const lesson = lessonsData.find((l) => l.id === lessonId)
      if (lesson) {
        setFormData({
          title: lesson.title,
          content: lesson.content,
          unitId: lesson.unitId,
          status: lesson.status,
          emoji: lesson.emoji,
        })
      }
      setIsFetching(false)
    }, 500)
  }, [lessonId])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/lessons")
    }, 1000)

    console.log(formData)
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-bounce text-5xl">🔄</div>
          <p className="text-xl font-medium text-green-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-green-50 hover:text-green-600">
          <Link href="/admin/lessons">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to lessons</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
            Edit Lesson 📖
          </h1>
          <p className="text-gray-600 mt-2">Update this fun learning lesson for children</p>
        </div>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" /> Lesson Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Lesson Title
              </Label>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Select value={formData.emoji} onValueChange={(value) => handleChange("emoji", value)}>
                    <SelectTrigger className="w-16 h-16 text-3xl flex items-center justify-center p-0 border-2 border-green-200 rounded-xl">
                      <SelectValue placeholder="🐮" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 rounded-xl">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {emojis.map((emoji) => (
                          <SelectItem
                            key={emoji}
                            value={emoji}
                            className="flex items-center justify-center text-2xl cursor-pointer h-10 w-10 rounded-lg hover:bg-green-50"
                          >
                            {emoji}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  id="title"
                  placeholder="Enter a fun lesson title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="flex-1 border-2 border-green-200 rounded-xl text-lg"
                />
              </div>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Choose a fun emoji and give your lesson an exciting name!
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-700">
                Lesson Content
              </Label>
              <Textarea
                id="content"
                placeholder="What will children learn in this lesson? Make it fun and engaging!"
                className="min-h-32 border-2 border-green-200 rounded-xl"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                required
              />
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Write content that's easy for children to understand!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unitId" className="text-gray-700">
                  Unit
                </Label>
                <Select value={formData.unitId} onValueChange={(value) => handleChange("unitId", value)}>
                  <SelectTrigger id="unitId" className="border-2 border-green-200 rounded-xl">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id} className="rounded-lg">
                        {unit.title} ({unit.courseTitle})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Choose which unit this lesson belongs to!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status" className="border-2 border-green-200 rounded-xl">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="draft" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✏️</span> Draft - Still working on it
                      </div>
                    </SelectItem>
                    <SelectItem value="published" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🚀</span> Published - Ready for learning!
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Publish when you're ready for students to see it!
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-md px-8 py-6 text-lg"
              >
                {isLoading ? "Saving..." : "Save Changes! 🎉"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/lessons")}
                className="rounded-xl border-2 border-gray-200 px-6 py-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

