"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageSrc: "",
  });

  useEffect(() => {
    try {
      const fetchCourse = async () => {
        const course = await fetch(`/api/courses/${courseId}`);
        const data = await course.json();
        setFormData(data);
      };
      fetchCourse();
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  }, [courseId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/courses");
    }, 1000);

    console.log(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-bounce text-5xl">🔄</div>
          <p className="text-xl font-medium text-blue-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
            Edit Course 🎨
          </h1>
          <p className="text-gray-600 mt-2">
            Update this fun learning course for children
          </p>
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
                <Input
                  id="title"
                  placeholder="Enter a fun course title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                  className="flex-1 border-2 border-blue-200 rounded-xl text-lg"
                />
              </div>
              <div className="flex gap-3 items-center">
                {formData.imageSrc ? (
                  <Image
                    src={formData.imageSrc}
                    alt="Course Image"
                    width={100}
                    height={100}
                    className="rounded-xl object-cover"
                    onError={(e) => {
                      // Fallback khi ảnh lỗi
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = "/placeholder-image.jpg"; // Thay thế bằng ảnh placeholder của bạn
                      imgElement.alt = "Image not found";
                    }}
                  />
                ) : (
                  <div className="w-[100px] h-[100px] rounded-xl bg-gray-100 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="imageSrc" className="text-gray-700">
                    Thumbnail URL
                  </Label>
                  <Input
                    id="imageSrc"
                    placeholder="Enter the image URL"
                    value={formData.imageSrc}
                    onChange={(e) => handleChange("imageSrc", e.target.value)}
                    className="border-2 border-blue-200 rounded-xl"
                  />
                  <p className="text-sm text-gray-500">
                    Enter a valid image URL to see the preview
                  </p>
                </div>
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
  );
}
