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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    imageSrc: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await fetch(`/api/courses/${courseId}`);
        const data = await course.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          variant: "error",
          title: "Error loading course",
          description: "Failed to load course data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update course");
      }
      toast({
        variant: "success",
        title: "Course updated successfully",
      });
      router.push("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        variant: "error",
        title: "Error updating course",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
        </div>

        <div className="border-none shadow-md rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-40 bg-white/50" />
            </div>
          </div>
          <div className="p-6 space-y-6 bg-white">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                <Skeleton className="h-[100px] w-[100px] rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-[60px] w-[180px] rounded-xl" />
              <Skeleton className="h-[60px] w-[120px] rounded-xl" />
            </div>
          </div>
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
          disabled={isLoading}
        >
          <Link href="/admin/courses">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to courses</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Edit Course 🎨 {formData.title}
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
                  disabled={isLoading}
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
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = "/placeholder-image.jpg";
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
                    disabled={isLoading}
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
                disabled={isLoading}
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
