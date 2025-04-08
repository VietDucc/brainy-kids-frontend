"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  PlusCircle,
  Search,
  Users,
  BookOpen,
  Award,
  Star,
  MoreHorizontal,
  Mail,
  Calendar,
  Sparkles,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for students
const studentsData = [
  {
    id: "1",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ET",
    age: 7,
    joinedAt: "2023-07-15T10:30:00Z",
    courses: 3,
    overallProgress: 78,
    lastActive: "2023-10-15T14:30:00Z",
    achievements: 12,
  },
  {
    id: "2",
    name: "Noah Garcia",
    email: "noah.g@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "NG",
    age: 6,
    joinedAt: "2023-08-05T14:20:00Z",
    courses: 2,
    overallProgress: 65,
    lastActive: "2023-10-14T09:45:00Z",
    achievements: 8,
  },
  {
    id: "3",
    name: "Olivia Chen",
    email: "olivia.c@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "OC",
    age: 8,
    joinedAt: "2023-06-20T09:15:00Z",
    courses: 4,
    overallProgress: 92,
    lastActive: "2023-10-15T16:20:00Z",
    achievements: 15,
  },
  {
    id: "4",
    name: "Liam Johnson",
    email: "liam.j@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LJ",
    age: 7,
    joinedAt: "2023-07-10T11:45:00Z",
    courses: 3,
    overallProgress: 45,
    lastActive: "2023-10-10T13:15:00Z",
    achievements: 5,
  },
  {
    id: "5",
    name: "Sophia Kim",
    email: "sophia.k@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SK",
    age: 6,
    joinedAt: "2023-08-15T13:30:00Z",
    courses: 2,
    overallProgress: 25,
    lastActive: "2023-10-12T10:30:00Z",
    achievements: 3,
  },
  {
    id: "6",
    name: "Jackson Williams",
    email: "jackson.w@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JW",
    age: 9,
    joinedAt: "2023-05-25T08:45:00Z",
    courses: 5,
    overallProgress: 88,
    lastActive: "2023-10-15T11:45:00Z",
    achievements: 14,
  },
  {
    id: "7",
    name: "Ava Martinez",
    email: "ava.m@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AM",
    age: 8,
    joinedAt: "2023-06-10T15:20:00Z",
    courses: 4,
    overallProgress: 72,
    lastActive: "2023-10-14T14:20:00Z",
    achievements: 10,
  },
  {
    id: "8",
    name: "Lucas Brown",
    email: "lucas.b@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LB",
    age: 7,
    joinedAt: "2023-07-05T10:15:00Z",
    courses: 3,
    overallProgress: 58,
    lastActive: "2023-10-13T09:30:00Z",
    achievements: 7,
  },
]

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter students based on search term
  const filteredStudents = studentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get progress level badge
  const getProgressBadge = (progress: number) => {
    if (progress >= 80) return { label: "Excellent", color: "bg-green-100 text-green-600" }
    if (progress >= 60) return { label: "Good", color: "bg-blue-100 text-blue-600" }
    if (progress >= 40) return { label: "Average", color: "bg-amber-100 text-amber-600" }
    return { label: "Needs Help", color: "bg-red-100 text-red-600" }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
            Students 👧👦
          </h1>
          <p className="text-gray-600 mt-2">Manage and track all students on the platform</p>
        </div>
        <Button
          asChild
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md"
        >
          <Link href="/admin/users/new" className="flex items-center gap-2 px-6">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Student</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <Users className="h-5 w-5" /> Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{studentsData.length}</div>
            <p className="text-xs text-orange-600">Active learners on the platform</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-600 flex items-center gap-2">
              <BookOpen className="h-5 w-5" /> Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {studentsData.reduce((acc, student) => acc + student.courses, 0)}
            </div>
            <p className="text-xs text-blue-600">Total course enrollments</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-purple-600 flex items-center gap-2">
              <Award className="h-5 w-5" /> Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">
              {studentsData.reduce((acc, student) => acc + student.achievements, 0)}
            </div>
            <p className="text-xs text-purple-600">Earned by all students</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-600 flex items-center gap-2">
              <Star className="h-5 w-5" /> Avg. Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {Math.round(
                studentsData.reduce((acc, student) => acc + student.overallProgress, 0) / studentsData.length,
              )}
              %
            </div>
            <p className="text-xs text-green-600">Average completion rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Student List
            </CardTitle>
          </div>
          <div className="mt-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
            <Input
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white/20 border-0 text-white placeholder:text-white/70 focus-visible:ring-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Student</th>
                  <th className="px-4 py-3 text-left font-medium">Age</th>
                  <th className="px-4 py-3 text-left font-medium">Courses</th>
                  <th className="px-4 py-3 text-left font-medium">Progress</th>
                  <th className="px-4 py-3 text-left font-medium">Last Active</th>
                  <th className="px-4 py-3 text-left font-medium">Achievements</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const progressBadge = getProgressBadge(student.overallProgress)
                    return (
                      <tr key={student.id} className="bg-white hover:bg-orange-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border-2 border-orange-200">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback className="bg-orange-100 text-orange-600">
                                {student.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600">
                            {student.age} years
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-purple-500" />
                            <span>{student.courses}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress value={student.overallProgress} className="h-2 w-20" />
                              <Badge className={progressBadge.color}>{progressBadge.label}</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            {new Date(student.lastActive).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span>{student.achievements}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full hover:bg-orange-50">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href={`/admin/users/${student.id}`} className="flex items-center">
                                  <Users className="mr-2 h-4 w-4 text-blue-500" />
                                  <span>View Profile</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href={`/admin/users/${student.id}/progress`} className="flex items-center">
                                  <Star className="mr-2 h-4 w-4 text-amber-500" />
                                  <span>View Progress</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href={`/admin/users/${student.id}/edit`} className="flex items-center">
                                  <BookOpen className="mr-2 h-4 w-4 text-green-500" />
                                  <span>Manage Courses</span>
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-4xl">🔍</div>
                        <h3 className="text-lg font-medium text-gray-700">No students found</h3>
                        <p className="text-gray-500">Try a different search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

