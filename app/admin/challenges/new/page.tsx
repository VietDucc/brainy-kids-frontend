"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Sparkles } from "lucide-react";
import { Course } from "../columns";
import { useToast } from "@/hooks/use-toast";
export default function NewCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<
    | Course
    | {
        title: string;
        imageSrc: string;
      }
  >({
    title: "",
    imageSrc: "",
  });
  const { toast } = useToast();
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        toast({
          variant: "error",
          title: "Failed to create course",
        });
      }
      toast({
        variant: "success",
        title: "Course created successfully",
      });
      router.push("/admin/courses");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Create a Fun New Course 🎨
        </h1>
        <p className="text-gray-600 mt-2">
          Design an exciting learning journey for children
        </p>
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
              <p className="text-sm text-blue-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Choose a fun emoji and give your course an exciting name!
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSrc" className="text-gray-700">
                Course Image
              </Label>
              <div className="flex gap-3">
                <Input
                  id="imageSrc"
                  placeholder="Enter a fun course title"
                  value={formData.imageSrc}
                  onChange={(e) => handleChange("imageSrc", e.target.value)}
                  required
                  className="flex-1 border-2 border-blue-200 rounded-xl text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md px-8 py-6 text-lg"
              >
                {isLoading ? "Creating..." : "Create Fun Course! 🎉"}
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
