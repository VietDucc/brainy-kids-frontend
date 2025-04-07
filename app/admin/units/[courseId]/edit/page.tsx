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
import { Layers, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for units
const unitsData = [
  {
    id: "1",
    title: "Farm Animals",
    description: "Learn about animals that live on a farm and the sounds they make.",
    courseId: "1",
    courseTitle: "Animals and Their Sounds",
    lessons: 5,
    status: "published",
    createdAt: "2023-06-05T12:00:00Z",
    emoji: "🐮",
  },
  {
    id: "2",
    title: "Wild Animals",
    description: "Discover amazing wild animals from around the world.",
    courseId: "1",
    courseTitle: "Animals and Their Sounds",
    lessons: 4,
    status: "published",
    createdAt: "2023-06-10T10:30:00Z",
    emoji: "🦁",
  },
  {
    id: "3",
    title: "Primary Colors",
    description: "Learn about red, blue, and yellow - the primary colors!",
    courseId: "2",
    courseTitle: "Colors and Shapes Fun",
    lessons: 6,
    status: "published",
    createdAt: "2023-06-15T14:45:00Z",
    emoji: "🎨",
  },
  {
    id: "4",
    title: "Shapes All Around",
    description: "Identify and learn about different shapes in our world.",
    courseId: "2",
    courseTitle: "Colors and Shapes Fun",
    lessons: 3,
    status: "draft",
    createdAt: "2023-06-20T09:15:00Z",
    emoji: "⭐",
  },
  {
    id: "5",
    title: "Counting to 10",
    description: "Learn to count from 1 to 10 with fun activities.",
    courseId: "3",
    courseTitle: "Numbers and Counting",
    lessons: 7,
    status: "published",
    createdAt: "2023-06-25T11:20:00Z",
    emoji: "🔢",
  },
]

// Mock data for courses
const courses = [
  { id: "1", title: "Animals and Their Sounds" },
  { id: "2", title: "Colors and Shapes Fun" },
  { id: "3", title: "Numbers and Counting" },
  { id: "4", title: "Family Members" },
  { id: "5", title: "Food and Fruits" },
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

export default function EditUnitPage() {
  const router = useRouter()
  const params = useParams()
  const unitId = params.id as string
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    status: "",
    emoji: "🐮",
  })

  useEffect(() => {
    // Simulate API fetch
    setIsFetching(true)
    setTimeout(() => {
      const unit = unitsData.find((u) => u.id === unitId)
      if (unit) {
        setFormData({
          title: unit.title,
          description: unit.description,
          courseId: unit.courseId,
          status: unit.status,
          emoji: unit.emoji,
        })
      }
      setIsFetching(false)
    }, 500)
  }, [unitId])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/units")
    }, 1000)

    console.log(formData)
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-bounce text-5xl">🔄</div>
          <p className="text-xl font-medium text-purple-600">Loading unit...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-purple-50 hover:text-purple-600">
          <Link href="/admin/units">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to units</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            Edit Unit 📚
          </h1>
          <p className="text-gray-600 mt-2">Update this learning unit for children</p>
        </div>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500">
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="h-5 w-5" /> Unit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Unit Title
              </Label>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Select value={formData.emoji} onValueChange={(value) => handleChange("emoji", value)}>
                    <SelectTrigger className="w-16 h-16 text-3xl flex items-center justify-center p-0 border-2 border-purple-200 rounded-xl">
                      <SelectValue placeholder="🐮" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 rounded-xl">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {emojis.map((emoji) => (
                          <SelectItem
                            key={emoji}
                            value={emoji}
                            className="flex items-center justify-center text-2xl cursor-pointer h-10 w-10 rounded-lg hover:bg-purple-50"
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
                  placeholder="Enter a fun unit title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="flex-1 border-2 border-purple-200 rounded-xl text-lg"
                />
              </div>
              <p className="text-sm text-purple-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Choose a fun emoji and give your unit an exciting name!
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="What will children learn in this unit? Make it sound fun and exciting!"
                className="min-h-32 border-2 border-purple-200 rounded-xl"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
              <p className="text-sm text-purple-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Describe what children will learn in this unit!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="courseId" className="text-gray-700">
                  Course
                </Label>
                <Select value={formData.courseId} onValueChange={(value) => handleChange("courseId", value)}>
                  <SelectTrigger id="courseId" className="border-2 border-purple-200 rounded-xl">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id} className="rounded-lg">
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-purple-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Choose which course this unit belongs to!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status" className="border-2 border-purple-200 rounded-xl">
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
                <p className="text-sm text-purple-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Publish when you're ready for students to see it!
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-md px-8 py-6 text-lg"
              >
                {isLoading ? "Saving..." : "Save Changes! 🎉"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/units")}
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

