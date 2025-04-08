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
import { BookOpen, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for courses
const coursesData = [
  {
    id: "1",
    title: "Animals and Their Sounds",
    description:
      "Learn about different animals and the sounds they make. Perfect for young learners to explore the animal kingdom!",
    level: "beginner",
    units: 5,
    status: "published",
    createdAt: "2023-06-01T12:00:00Z",
    emoji: "🦁",
  },
  {
    id: "2",
    title: "Colors and Shapes Fun",
    description: "Discover the wonderful world of colors and shapes through interactive lessons and games.",
    level: "beginner",
    units: 8,
    status: "published",
    createdAt: "2023-07-15T10:30:00Z",
    emoji: "🌈",
  },
  {
    id: "3",
    title: "Numbers and Counting",
    description: "Learn to count and recognize numbers through fun activities and games.",
    level: "beginner",
    units: 6,
    status: "draft",
    createdAt: "2023-08-20T14:45:00Z",
    emoji: "🔢",
  },
  {
    id: "4",
    title: "Family Members",
    description: "Learn vocabulary related to family members and relationships.",
    level: "beginner",
    units: 4,
    status: "published",
    createdAt: "2023-09-05T09:15:00Z",
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    id: "5",
    title: "Food and Fruits",
    description: "Explore different types of food and fruits with colorful illustrations and fun activities.",
    level: "beginner",
    units: 7,
    status: "published",
    createdAt: "2023-10-10T11:20:00Z",
    emoji: "🍎",
  },
]

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "",
    status: "",
    emoji: "🦁",
  })

  const emojis = [
    "🦁",
    "🐘",
    "🦒",
    "🦓",
    "🐯",
    "🦊",
    "🐶",
    "🐱",
    "🐰",
    "🐻",
    "🐼",
    "🐨",
    "🦄",
    "🐢",
    "🐬",
    "🐙",
    "🦋",
    "🌈",
    "🌞",
    "🌟",
    "🍎",
    "🍓",
    "🥕",
    "🚂",
    "✈️",
    "🚀",
    "⚽",
    "🎨",
    "🎭",
    "🎵",
  ]

  useEffect(() => {
    // Simulate API fetch
    setIsFetching(true)
    setTimeout(() => {
      const course = coursesData.find((c) => c.id === courseId)
      if (course) {
        setFormData({
          title: course.title,
          description: course.description,
          level: course.level,
          status: course.status,
          emoji: course.emoji,
        })
      }
      setIsFetching(false)
    }, 500)
  }, [courseId])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/courses")
    }, 1000)

    console.log(formData)
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-bounce text-5xl">🔄</div>
          <p className="text-xl font-medium text-blue-600">Loading course...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-blue-50 hover:text-blue-600">
          <Link href="/admin/courses">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to courses</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Edit Course 🎨
          </h1>
          <p className="text-gray-600 mt-2">Update this fun learning course for children</p>
        </div>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Course Title
              </Label>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Select value={formData.emoji} onValueChange={(value) => handleChange("emoji", value)}>
                    <SelectTrigger className="w-16 h-16 text-3xl flex items-center justify-center p-0 border-2 border-blue-200 rounded-xl">
                      <SelectValue placeholder="🦁" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 rounded-xl">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {emojis.map((emoji) => (
                          <SelectItem
                            key={emoji}
                            value={emoji}
                            className="flex items-center justify-center text-2xl cursor-pointer h-10 w-10 rounded-lg hover:bg-blue-50"
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
                  placeholder="Enter a fun course title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="flex-1 border-2 border-blue-200 rounded-xl text-lg"
                />
              </div>
              <p className="text-sm text-blue-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Choose a fun emoji and give your course an exciting name!
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="What will children learn in this course? Make it sound fun and exciting!"
                className="min-h-32 border-2 border-blue-200 rounded-xl"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
              <p className="text-sm text-blue-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Describe what children will learn in a way that sounds exciting!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-gray-700">
                  Difficulty Level
                </Label>
                <Select value={formData.level} onValueChange={(value) => handleChange("level", value)}>
                  <SelectTrigger id="level" className="border-2 border-blue-200 rounded-xl">
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="beginner" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌱</span> Beginner (Ages 3-5)
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediate" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌿</span> Intermediate (Ages 6-8)
                      </div>
                    </SelectItem>
                    <SelectItem value="advanced" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌳</span> Advanced (Ages 9-12)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Choose the right level for your target age group!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status" className="border-2 border-blue-200 rounded-xl">
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
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Publish when you're ready for students to see it!
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md px-8 py-6 text-lg"
              >
                {isLoading ? "Saving..." : "Save Changes! 🎉"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/courses")}
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

