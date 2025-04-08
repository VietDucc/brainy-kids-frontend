"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Star, Award, Layers, FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data for the course
const courseData = {
  id: "1",
  title: "Animals and Their Sounds",
  description:
    "Learn about different animals and the sounds they make. Perfect for young learners to explore the animal kingdom!",
  level: "beginner",
  units: 5,
  status: "published",
  createdAt: "2023-06-01T12:00:00Z",
  emoji: "🦁",
}

// Mock data for students
const studentsData = [
  {
    id: "1",
    name: "Emma Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ET",
    age: 7,
    joinedAt: "2023-07-15T10:30:00Z",
    progress: {
      overall: 78,
      units: [
        { id: "1", title: "Farm Animals", progress: 100 },
        { id: "2", title: "Wild Animals", progress: 85 },
        { id: "3", title: "Ocean Animals", progress: 60 },
        { id: "4", title: "Insects", progress: 40 },
        { id: "5", title: "Birds", progress: 0 },
      ],
      lessons: [
        { id: "1", title: "Meet the Farm Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "2", title: "Animal Homes", unitTitle: "Farm Animals", progress: 100 },
        { id: "3", title: "Baby Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "4", title: "Animal Sounds", unitTitle: "Farm Animals", progress: 100 },
        { id: "5", title: "What Animals Eat", unitTitle: "Farm Animals", progress: 100 },
        { id: "6", title: "Lions and Tigers", unitTitle: "Wild Animals", progress: 100 },
        { id: "7", title: "Elephants and Giraffes", unitTitle: "Wild Animals", progress: 100 },
        { id: "8", title: "Monkeys and Apes", unitTitle: "Wild Animals", progress: 75 },
        { id: "9", title: "Bears and Wolves", unitTitle: "Wild Animals", progress: 50 },
        { id: "10", title: "Dolphins and Whales", unitTitle: "Ocean Animals", progress: 100 },
        { id: "11", title: "Sharks and Fish", unitTitle: "Ocean Animals", progress: 80 },
        { id: "12", title: "Octopus and Squid", unitTitle: "Ocean Animals", progress: 0 },
      ],
      challenges: [
        { id: "1", title: "Animal Sounds Quiz", lessonTitle: "Animal Sounds", progress: 100 },
        { id: "2", title: "Match Animals to Homes", lessonTitle: "Animal Homes", progress: 100 },
        { id: "3", title: "Baby Animals Names", lessonTitle: "Baby Animals", progress: 90 },
        { id: "4", title: "Wild Animals Quiz", lessonTitle: "Lions and Tigers", progress: 100 },
        { id: "5", title: "Ocean Animals Matching", lessonTitle: "Dolphins and Whales", progress: 75 },
      ],
    },
  },
  {
    id: "2",
    name: "Noah Garcia",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "NG",
    age: 6,
    joinedAt: "2023-08-05T14:20:00Z",
    progress: {
      overall: 65,
      units: [
        { id: "1", title: "Farm Animals", progress: 90 },
        { id: "2", title: "Wild Animals", progress: 75 },
        { id: "3", title: "Ocean Animals", progress: 30 },
        { id: "4", title: "Insects", progress: 0 },
        { id: "5", title: "Birds", progress: 0 },
      ],
      lessons: [
        { id: "1", title: "Meet the Farm Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "2", title: "Animal Homes", unitTitle: "Farm Animals", progress: 100 },
        { id: "3", title: "Baby Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "4", title: "Animal Sounds", unitTitle: "Farm Animals", progress: 60 },
        { id: "5", title: "What Animals Eat", unitTitle: "Farm Animals", progress: 0 },
        { id: "6", title: "Lions and Tigers", unitTitle: "Wild Animals", progress: 100 },
        { id: "7", title: "Elephants and Giraffes", unitTitle: "Wild Animals", progress: 100 },
        { id: "8", title: "Monkeys and Apes", unitTitle: "Wild Animals", progress: 50 },
        { id: "9", title: "Bears and Wolves", unitTitle: "Wild Animals", progress: 0 },
        { id: "10", title: "Dolphins and Whales", unitTitle: "Ocean Animals", progress: 90 },
        { id: "11", title: "Sharks and Fish", unitTitle: "Ocean Animals", progress: 0 },
        { id: "12", title: "Octopus and Squid", unitTitle: "Ocean Animals", progress: 0 },
      ],
      challenges: [
        { id: "1", title: "Animal Sounds Quiz", lessonTitle: "Animal Sounds", progress: 60 },
        { id: "2", title: "Match Animals to Homes", lessonTitle: "Animal Homes", progress: 100 },
        { id: "3", title: "Baby Animals Names", lessonTitle: "Baby Animals", progress: 80 },
        { id: "4", title: "Wild Animals Quiz", lessonTitle: "Lions and Tigers", progress: 90 },
        { id: "5", title: "Ocean Animals Matching", lessonTitle: "Dolphins and Whales", progress: 70 },
      ],
    },
  },
  {
    id: "3",
    name: "Olivia Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "OC",
    age: 8,
    joinedAt: "2023-06-20T09:15:00Z",
    progress: {
      overall: 92,
      units: [
        { id: "1", title: "Farm Animals", progress: 100 },
        { id: "2", title: "Wild Animals", progress: 100 },
        { id: "3", title: "Ocean Animals", progress: 90 },
        { id: "4", title: "Insects", progress: 80 },
        { id: "5", title: "Birds", progress: 0 },
      ],
      lessons: [
        { id: "1", title: "Meet the Farm Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "2", title: "Animal Homes", unitTitle: "Farm Animals", progress: 100 },
        { id: "3", title: "Baby Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "4", title: "Animal Sounds", unitTitle: "Farm Animals", progress: 100 },
        { id: "5", title: "What Animals Eat", unitTitle: "Farm Animals", progress: 100 },
        { id: "6", title: "Lions and Tigers", unitTitle: "Wild Animals", progress: 100 },
        { id: "7", title: "Elephants and Giraffes", unitTitle: "Wild Animals", progress: 100 },
        { id: "8", title: "Monkeys and Apes", unitTitle: "Wild Animals", progress: 100 },
        { id: "9", title: "Bears and Wolves", unitTitle: "Wild Animals", progress: 100 },
        { id: "10", title: "Dolphins and Whales", unitTitle: "Ocean Animals", progress: 100 },
        { id: "11", title: "Sharks and Fish", unitTitle: "Ocean Animals", progress: 100 },
        { id: "12", title: "Octopus and Squid", unitTitle: "Ocean Animals", progress: 70 },
      ],
      challenges: [
        { id: "1", title: "Animal Sounds Quiz", lessonTitle: "Animal Sounds", progress: 100 },
        { id: "2", title: "Match Animals to Homes", lessonTitle: "Animal Homes", progress: 100 },
        { id: "3", title: "Baby Animals Names", lessonTitle: "Baby Animals", progress: 100 },
        { id: "4", title: "Wild Animals Quiz", lessonTitle: "Lions and Tigers", progress: 100 },
        { id: "5", title: "Ocean Animals Matching", lessonTitle: "Dolphins and Whales", progress: 95 },
      ],
    },
  },
  {
    id: "4",
    name: "Liam Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LJ",
    age: 7,
    joinedAt: "2023-07-10T11:45:00Z",
    progress: {
      overall: 45,
      units: [
        { id: "1", title: "Farm Animals", progress: 80 },
        { id: "2", title: "Wild Animals", progress: 50 },
        { id: "3", title: "Ocean Animals", progress: 0 },
        { id: "4", title: "Insects", progress: 0 },
        { id: "5", title: "Birds", progress: 0 },
      ],
      lessons: [
        { id: "1", title: "Meet the Farm Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "2", title: "Animal Homes", unitTitle: "Farm Animals", progress: 100 },
        { id: "3", title: "Baby Animals", unitTitle: "Farm Animals", progress: 80 },
        { id: "4", title: "Animal Sounds", unitTitle: "Farm Animals", progress: 60 },
        { id: "5", title: "What Animals Eat", unitTitle: "Farm Animals", progress: 0 },
        { id: "6", title: "Lions and Tigers", unitTitle: "Wild Animals", progress: 100 },
        { id: "7", title: "Elephants and Giraffes", unitTitle: "Wild Animals", progress: 70 },
        { id: "8", title: "Monkeys and Apes", unitTitle: "Wild Animals", progress: 0 },
        { id: "9", title: "Bears and Wolves", unitTitle: "Wild Animals", progress: 0 },
      ],
      challenges: [
        { id: "1", title: "Animal Sounds Quiz", lessonTitle: "Animal Sounds", progress: 60 },
        { id: "2", title: "Match Animals to Homes", lessonTitle: "Animal Homes", progress: 90 },
        { id: "3", title: "Baby Animals Names", lessonTitle: "Baby Animals", progress: 70 },
        { id: "4", title: "Wild Animals Quiz", lessonTitle: "Lions and Tigers", progress: 80 },
      ],
    },
  },
  {
    id: "5",
    name: "Sophia Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SK",
    age: 6,
    joinedAt: "2023-08-15T13:30:00Z",
    progress: {
      overall: 25,
      units: [
        { id: "1", title: "Farm Animals", progress: 60 },
        { id: "2", title: "Wild Animals", progress: 20 },
        { id: "3", title: "Ocean Animals", progress: 0 },
        { id: "4", title: "Insects", progress: 0 },
        { id: "5", title: "Birds", progress: 0 },
      ],
      lessons: [
        { id: "1", title: "Meet the Farm Animals", unitTitle: "Farm Animals", progress: 100 },
        { id: "2", title: "Animal Homes", unitTitle: "Farm Animals", progress: 80 },
        { id: "3", title: "Baby Animals", unitTitle: "Farm Animals", progress: 50 },
        { id: "4", title: "Animal Sounds", unitTitle: "Farm Animals", progress: 0 },
        { id: "5", title: "What Animals Eat", unitTitle: "Farm Animals", progress: 0 },
        { id: "6", title: "Lions and Tigers", unitTitle: "Wild Animals", progress: 60 },
        { id: "7", title: "Elephants and Giraffes", unitTitle: "Wild Animals", progress: 0 },
      ],
      challenges: [
        { id: "1", title: "Animal Sounds Quiz", lessonTitle: "Animal Sounds", progress: 0 },
        { id: "2", title: "Match Animals to Homes", lessonTitle: "Animal Homes", progress: 70 },
        { id: "3", title: "Baby Animals Names", lessonTitle: "Baby Animals", progress: 40 },
        { id: "4", title: "Wild Animals Quiz", lessonTitle: "Lions and Tigers", progress: 50 },
      ],
    },
  },
]

export default function CourseStudentsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const [isFetching, setIsFetching] = useState(true)
  const [course, setCourse] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("units")

  useEffect(() => {
    // Simulate API fetch
    setIsFetching(true)
    setTimeout(() => {
      setCourse(courseData)
      setStudents(studentsData)
      setIsFetching(false)
    }, 500)
  }, [courseId])

  // Filter students based on search term
  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get the selected student data
  const studentDetails = selectedStudent ? students.find((student) => student.id === selectedStudent) : null

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-bounce text-5xl">🔄</div>
          <p className="text-xl font-medium text-blue-600">Loading student data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-blue-50 hover:text-blue-600">
            <Link href={`/admin/courses/${courseId}`}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to course</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {course.emoji} {course.title} - Students
            </h1>
            <p className="text-gray-600 mt-2">Track student progress and performance</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Student List */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" /> Students
                </CardTitle>
                <Badge className="bg-white text-blue-600">{students.length}</Badge>
              </div>
              <div className="mt-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/20 border-0 text-white placeholder:text-white/70 focus-visible:ring-white"
                />
              </div>
            </CardHeader>
            <CardContent className="p-3 max-h-[500px] overflow-y-auto">
              {filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedStudent === student.id
                          ? "bg-blue-100 border-2 border-blue-200"
                          : "hover:bg-blue-50 border-2 border-transparent"
                      }`}
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <Avatar className="h-10 w-10 border-2 border-blue-200">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">{student.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs">
                            Age: {student.age}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Progress value={student.progress.overall} className="h-2 w-16" />
                            <span className="text-xs text-gray-500">{student.progress.overall}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="text-lg font-medium text-gray-700">No students found</h3>
                  <p className="text-gray-500">Try a different search term</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500">
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5" /> Class Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Average Progress</p>
                  <p className="font-bold text-green-600">
                    {Math.round(students.reduce((acc, student) => acc + student.progress.overall, 0) / students.length)}
                    %
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Top Student</p>
                  <p className="font-bold text-green-600">
                    {students.sort((a, b) => b.progress.overall - a.progress.overall)[0]?.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Completed Units</p>
                  <p className="font-bold text-green-600">
                    {students.reduce(
                      (acc, student) => acc + student.progress.units.filter((unit) => unit.progress === 100).length,
                      0,
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Completed Lessons</p>
                  <p className="font-bold text-green-600">
                    {students.reduce(
                      (acc, student) =>
                        acc + student.progress.lessons.filter((lesson) => lesson.progress === 100).length,
                      0,
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Completed Challenges</p>
                  <p className="font-bold text-green-600">
                    {students.reduce(
                      (acc, student) =>
                        acc + student.progress.challenges.filter((challenge) => challenge.progress === 100).length,
                      0,
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Details */}
        <div className="md:col-span-2">
          {selectedStudent ? (
            <Card className="border-none shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarImage src={studentDetails?.avatar} alt={studentDetails?.name} />
                      <AvatarFallback className="bg-purple-200 text-purple-600">
                        {studentDetails?.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white">{studentDetails?.name}</CardTitle>
                      <p className="text-white/80 text-sm">
                        Joined {new Date(studentDetails?.joinedAt).toLocaleDateString()} • Age: {studentDetails?.age}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-xl">{studentDetails?.progress.overall}%</p>
                      <Badge className="bg-white text-purple-600">
                        {studentDetails?.progress.overall >= 80
                          ? "Excellent"
                          : studentDetails?.progress.overall >= 60
                            ? "Good"
                            : studentDetails?.progress.overall >= 40
                              ? "Average"
                              : "Needs Help"}
                      </Badge>
                    </div>
                    <p className="text-white/80 text-sm">Overall Progress</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full rounded-none grid grid-cols-3 bg-gray-100">
                    <TabsTrigger
                      value="units"
                      className="data-[state=active]:bg-white rounded-none border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600"
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Units
                    </TabsTrigger>
                    <TabsTrigger
                      value="lessons"
                      className="data-[state=active]:bg-white rounded-none border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Lessons
                    </TabsTrigger>
                    <TabsTrigger
                      value="challenges"
                      className="data-[state=active]:bg-white rounded-none border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Challenges
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="units" className="p-4 max-h-[400px] overflow-y-auto">
                    <div className="space-y-4">
                      {studentDetails?.progress.units.map((unit: any) => (
                        <div
                          key={unit.id}
                          className="border-2 border-gray-100 rounded-xl p-4 hover:border-purple-100 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">
                                {unit.progress === 100 ? "✅" : "📚"}
                              </div>
                              <h3 className="font-medium">{unit.title}</h3>
                            </div>
                            <Badge
                              variant={unit.progress === 100 ? "default" : "outline"}
                              className={
                                unit.progress === 100
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : unit.progress === 0
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                              }
                            >
                              {unit.progress === 100
                                ? "Completed"
                                : unit.progress === 0
                                  ? "Not Started"
                                  : "In Progress"}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{unit.progress}%</span>
                            </div>
                            <Progress value={unit.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="lessons" className="p-4 max-h-[400px] overflow-y-auto">
                    <div className="space-y-4">
                      {studentDetails?.progress.lessons.map((lesson: any) => (
                        <div
                          key={lesson.id}
                          className="border-2 border-gray-100 rounded-xl p-4 hover:border-purple-100 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{lesson.title}</h3>
                              <p className="text-xs text-gray-500">{lesson.unitTitle}</p>
                            </div>
                            <Badge
                              variant={lesson.progress === 100 ? "default" : "outline"}
                              className={
                                lesson.progress === 100
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : lesson.progress === 0
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                              }
                            >
                              {lesson.progress === 100
                                ? "Completed"
                                : lesson.progress === 0
                                  ? "Not Started"
                                  : "In Progress"}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{lesson.progress}%</span>
                            </div>
                            <Progress value={lesson.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="challenges" className="p-4 max-h-[400px] overflow-y-auto">
                    <div className="space-y-4">
                      {studentDetails?.progress.challenges.map((challenge: any) => (
                        <div
                          key={challenge.id}
                          className="border-2 border-gray-100 rounded-xl p-4 hover:border-purple-100 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{challenge.title}</h3>
                              <p className="text-xs text-gray-500">{challenge.lessonTitle}</p>
                            </div>
                            <Badge
                              variant={challenge.progress === 100 ? "default" : "outline"}
                              className={
                                challenge.progress === 100
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : challenge.progress === 0
                                    ? "bg-gray-100 text-gray-600"
                                    : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                              }
                            >
                              {challenge.progress === 100
                                ? "Completed"
                                : challenge.progress === 0
                                  ? "Not Started"
                                  : "In Progress"}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Score</span>
                              <span className="font-medium">{challenge.progress}%</span>
                            </div>
                            <Progress value={challenge.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">👈</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">Select a Student</h2>
              <p className="text-gray-500 text-center max-w-md">
                Choose a student from the list to view their detailed progress in units, lessons, and challenges
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

