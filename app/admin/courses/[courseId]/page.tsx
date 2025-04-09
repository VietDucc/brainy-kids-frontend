"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Pencil,
  Trash,
  BookOpen,
  Layers,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/types/courses";
import { UnitType } from "@/types/learn";
import Loading from "@/app/loading";
// Mock data for courses

export default function ViewCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course>();
  const [units, setUnits] = useState<UnitType[]>([]);
  const [isUnitsLoading, setIsUnitsLoading] = useState(false);

  const getCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      return res.json();
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };
  const getUnits = async (courseId: string) => {
    try {
      setIsUnitsLoading(true);
      const res = await fetch(`/api/units/${courseId}`);
      return res.json();
    } catch (error) {
      console.error("Error fetching units:", error);
    } finally {
      setIsUnitsLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const courseData = await getCourse(courseId);
      const unitsData = await getUnits(courseId);
      setCourse(courseData);
      setUnits(unitsData);
    };
    fetchData();
  }, [courseId]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this course?")) {
      setTimeout(() => {
        router.push("/admin/courses");
      }, 500);
    }
  };

  const handleEditClick = () => {
    if (course?.id && course?.title) {
      const params = new URLSearchParams();
      params.append("title", course.title);
      if (course.imageSrc) {
        params.append("imageSrc", course.imageSrc);
      }
      router.push(`/admin/courses/${course.id}/edit?${params.toString()}`);
    }
  };

  if (!course) {
    return <Loading text="course" />;
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
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full hover:bg-blue-50 hover:text-blue-600"
          >
            <Link href="/admin/courses">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to courses</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              {course.title}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            asChild
            className="rounded-xl border-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            onClick={handleEditClick}
          >
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Course
            </div>
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
      <Suspense fallback={<Loading text="course" />}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> Course Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={course.imageSrc}
                    alt={course.title}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Title
                    </h3>
                    <p className="mt-2 text-gray-600">{course.title}</p>
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
                {isUnitsLoading ? (
                  <Loading text="units" />
                ) : units.length > 0 ? (
                  <div className="space-y-4">
                    {units.map((unit: UnitType) => (
                      <div
                        key={unit.id}
                        className="flex items-center justify-between p-4 rounded-xl border-2 border-purple-100 hover:border-purple-200 hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                            📚
                          </div>
                          <div>
                            <h3 className="font-medium">{unit.title}</h3>
                            <p className="text-sm text-gray-500">
                              {unit.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="rounded-lg hover:bg-purple-100"
                        >
                          <Link href={`/admin/units/${unit.id}`}>
                            View Unit
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-4xl mb-2">📚</div>
                    <h3 className="text-lg font-medium text-gray-700">
                      No units yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start creating units for this course
                    </p>
                    <Button asChild>
                      <Link
                        href="/admin/units/new"
                        className="flex items-center gap-2"
                      >
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
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                      📚
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Total Units</p>
                      <p className="text-xl font-bold">{units.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                      📝
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Total Lessons</p>
                      <p className="text-xl font-bold">
                        {units.reduce(
                          (acc, unit) => acc + unit.lessons.length,
                          0
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                      🎮
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">
                        Total Challenges
                      </p>
                      <p className="text-xl font-bold">
                        {units.reduce(
                          (acc, unit) =>
                            acc +
                            unit.lessons.reduce(
                              (lessonAcc, lesson) =>
                                lessonAcc + lesson.challenges.length,
                              0
                            ),
                          0
                        )}
                      </p>
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
                    <Link
                      href="/admin/units/new"
                      className="flex items-center gap-2"
                    >
                      <Layers className="h-4 w-4" />
                      Add New Unit
                    </Link>
                  </Button>

                  <Button
                    className="w-full justify-start rounded-xl bg-green-50 text-green-600 hover:bg-green-100"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      href="/admin/lessons/new"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Add New Lesson
                    </Link>
                  </Button>

                  <Button
                    className="w-full justify-start rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100"
                    variant="ghost"
                    asChild
                  >
                    <Link
                      href="/admin/challenges/new"
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Add New Challenge
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
