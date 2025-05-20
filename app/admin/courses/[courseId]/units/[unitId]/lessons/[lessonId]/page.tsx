"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).nullable(),
  orderIndex: z.number().min(0, "Order must be 0 or greater"),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

export default function LessonForm() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = params.lessonId !== "new";

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      difficulty: null,
      orderIndex: 0,
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchLesson = async () => {
        try {
          const response = await fetch(`/api/lessons/${params.lessonId}`);
          const data = await response.json();
          form.reset({
            title: data.title,
            difficulty: data.difficulty,
            orderIndex: data.orderIndex,
          });
        } catch (error) {
          console.error("Error fetching lesson:", error);
          toast({
            title: "Error fetching lesson",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      };
      fetchLesson();
    }
  }, [isEditing, params.lessonId]);

  const onSubmit = async (data: LessonFormValues) => {
    try {
      const response = await fetch(
        isEditing ? `/api/lessons/${params.lessonId}` : "/api/lessons",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            unitId: params.unitId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save lesson");

      toast({
        title: `Lesson ${isEditing ? "updated" : "created"} successfully`,
        variant: "success",
      });

      router.push(`/admin/courses/${params.courseId}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast({
        title: `Error ${isEditing ? "updating" : "creating"} lesson`,
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full hover:bg-blue-50"
          >
            <Link href={`/admin/courses/${params.courseId}`}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">
            {isEditing ? "Edit Lesson" : "Create New Lesson"}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lesson title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your lesson a clear and descriptive title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Set the difficulty level of this lesson
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Set the order in which this lesson appears (0 = first)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? "Update Lesson" : "Create Lesson"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
