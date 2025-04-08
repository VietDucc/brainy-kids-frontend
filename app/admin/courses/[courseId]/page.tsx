"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Pencil, Trash, BookOpen, Layers, FileText } from "lucide-react"
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
    unitsList: [
      { id: "1", title: "Farm Animals", lessons: 5 },
      { id: "2", title: "Wild Animals", lessons: 4 },
      { id: "3", title: "Ocean Animals", lessons: 3 },
      { id: "4", title: "Insects", lessons: 4 },
      { id: "5", title: "Birds", lessons: 3 },
    ],
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
    unitsList: [
      { id: "3", title: "Primary Colors", lessons: 6 },
      { id: "4", title: "Shapes All Around", lessons: 3 },
    ],
  },
]

export default function ViewCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string
  const [isFetching, setIsFetching] = useState(true)
  const [course, setCourse] = useState<any>(null)

  useEffect(() => {
    // Simulate API fetch
    setIsFetching(true)
    setTimeout(() => {
      const foundCourse = coursesData.find((c) => c.id === courseId)
      setCourse(foundCourse || null)
      setIsFetching(false)
    }, 500)
  }, [courseId])

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this course?")) {
      // Simulate API call
      setTimeout(() => {
        router.push("/admin/courses")
      }, 500)
    }
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

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl">😢</div>
          <p className="text-xl font-medium text-gray-600">Course not found</p>
          <Button asChild className="mt-4">
            <Link href="/admin/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-blue-50 hover:text-blue-600">
            <Link href="/admin/courses">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to courses</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {course.emoji} {course.title}
            </h1>
            <p className="text-gray-600 mt-2">Course Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            asChild
            className="rounded-xl border-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Link href={`/admin/courses/${course.id}/edit`} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Course
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border-2 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Course
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Description</h3>
                  <p className="mt-2 text-gray-600">{course.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Level</h3>
                    <div className="mt-1 flex items-center gap-2">
                      {course.level === "beginner" && <span className="text-lg">🌱</span>}
                      {course.level === "intermediate" && <span className="text-lg">🌿</span>}
                      {course.level === "advanced" && <span className="text-lg">🌳</span>}
                      <span className="font-medium capitalize">{course.level}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <Badge
                      variant={course.status === "published" ? "default" : "secondary"}
                      className={`mt-1 rounded-full ${
                        course.status === "published"
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                      }`}
                    >
                      {course.status === "published" ? "Published ✓" : "Draft ✎"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created</h3>
                    <p className="mt-1 font-medium">{new Date(course.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Units</h3>
                    <p className="mt-1 font-medium">{course.units} units</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500">
              <CardTitle className="text-white flex items-center gap-2">
                <Layers className="h-5 w-5" /> Units in this Course
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {course.unitsList && course.unitsList.length > 0 ? (
                <div className="space-y-4">
                  {course.unitsList.map((unit: any) => (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-purple-100 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                          {unit.emoji || "📚"}
                        </div>
                        <div>
                          <h3 className="font-medium">{unit.title}</h3>
                          <p className="text-sm text-gray-500">{unit.lessons} lessons</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="rounded-lg hover:bg-purple-100">
                        <Link href={`/admin/units/${unit.id}`}>View Unit</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-2">📚</div>
                  <h3 className="text-lg font-medium text-gray-700">No units yet</h3>
                  <p className="text-gray-500 mb-4">Start creating units for this course</p>
                  <Button asChild>
                    <Link href="/admin/units/new" className="flex items-center gap-2">
                      Add First Unit
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500">
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" /> Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">📚</div>
                  <div>
                    <p className="text-sm text-blue-600">Total Units</p>
                    <p className="text-xl font-bold">{course.units}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">📝</div>
                  <div>
                    <p className="text-sm text-green-600">Total Lessons</p>
                    <p className="text-xl font-bold">
                      {course.unitsList?.reduce((acc: number, unit: any) => acc + unit.lessons, 0) || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                    🎮
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Total Challenges</p>
                    <p className="text-xl font-bold">24</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
                    👧
                  </div>
                  <div>
                    <p className="text-sm text-yellow-600">Active Students</p>
                    <p className="text-xl font-bold">42</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500">
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button
                  className="w-full justify-start rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                  variant="ghost"
                  asChild
                >
                  <Link href="/admin/units/new" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Add New Unit
                  </Link>
                </Button>

                <Button
                  className="w-full justify-start rounded-xl bg-green-50 text-green-600 hover:bg-green-100"
                  variant="ghost"
                  asChild
                >
                  <Link href="/admin/lessons/new" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Add New Lesson
                  </Link>
                </Button>

                <Button
                  className="w-full justify-start rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100"
                  variant="ghost"
                  asChild
                >
                  <Link href="/admin/challenges/new" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Add New Challenge
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

