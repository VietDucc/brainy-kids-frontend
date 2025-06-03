import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Layers,
  FileText,
  Award,
  Star,
  Smile,
  Clock,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome to KidLearn! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Let&apos;s make learning fun and engaging for children!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700">
              Total Courses
            </CardTitle>
            <div className="bg-pink-200 p-2 rounded-full">
              <BookOpen className="h-4 w-4 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-700">12</div>
            <p className="text-xs text-pink-600">
              +2 new fun courses this month!
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Units
            </CardTitle>
            <div className="bg-blue-200 p-2 rounded-full">
              <Layers className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">45</div>
            <p className="text-xs text-blue-600">
              +5 exciting units added recently!
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total Lessons
            </CardTitle>
            <div className="bg-green-200 p-2 rounded-full">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">132</div>
            <p className="text-xs text-green-600">
              +12 interactive lessons this month!
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Total Challenges
            </CardTitle>
            <div className="bg-yellow-200 p-2 rounded-full">
              <Award className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">264</div>
            <p className="text-xs text-yellow-600">
              +18 fun challenges to explore!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500">
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5" /> Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                {
                  title: "New 'Animals' course created",
                  time: "2 hours ago",
                  emoji: "🦁",
                },
                {
                  title: "Updated 'Colors' lesson",
                  time: "5 hours ago",
                  emoji: "🌈",
                },
                {
                  title: "Added 'Counting' challenge",
                  time: "1 day ago",
                  emoji: "🔢",
                },
                {
                  title: "New 'Family' unit created",
                  time: "2 days ago",
                  emoji: "👨‍👩‍👧‍👦",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500">
            <CardTitle className="text-white flex items-center gap-2">
              <Smile className="h-5 w-5" /> Student Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { label: "Active Students", value: "245", emoji: "👧" },
                { label: "Completion Rate", value: "78%", emoji: "🎯" },
                { label: "Average Score", value: "82/100", emoji: "🌟" },
                { label: "Learning Hours", value: "1,245", emoji: "⏱️" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <span>{item.emoji}</span> {item.label}
                  </p>
                  <p className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
