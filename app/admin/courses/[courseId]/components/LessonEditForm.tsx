"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const challengeTypes = ["SELECT", "SINGLE", "MULTI", "ASSIST"] as const;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  orderIndex: z.number().min(0),
  challenges: z
    .array(
      z.object({
        id: z.number().optional(),
        type: z.enum(challengeTypes),
        imgSrc: z.string().nullable(),
        question: z.string(),
        orderChallenge: z.number(),
        challengesOption: z
          .array(
            z.object({
              id: z.number().optional(),
              textOption: z.string().nullable(),
              correct: z.boolean(),
              imageSrc: z.string().nullable(),
              audioSrc: z.string().nullable(),
            })
          )
          .optional()
          .default([]),
      })
    )
    .optional()
    .default([]),
  vocabularies: z
    .array(
      z.object({
        id: z.number().optional(),
        note: z.string(),
        orderVocabulary: z.number(),
        eng: z.string(),
        vie: z.string(),
      })
    )
    .optional()
    .default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface LessonEditFormProps {
  lessonId?: number;
  unitId: number;
  initialData?: FormValues;
  onSuccess?: (data: FormValues) => void;
}

export function LessonEditForm({
  lessonId,
  initialData,
  onSuccess,
}: LessonEditFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const defaultValues: FormValues = {
    title: "",
    difficulty: "EASY",
    orderIndex: 0,
    challenges: [],
    vocabularies: [],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        ...values,
        challenges: values.challenges || [],
        vocabularies: values.vocabularies || [],
      };

      const response = await fetch(
        `/api/lessons${lessonId ? `/${lessonId}` : ""}`,
        {
          method: lessonId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save lesson");
      }

      const responseData = await response.json();

      form.reset({
        title: responseData.title,
        difficulty: responseData.difficulty,
        orderIndex: responseData.orderIndex,
        challenges: [],
        vocabularies: [],
      });

      toast({
        variant: "success",
        description: `Lesson ${lessonId ? "updated" : "created"} successfully`,
      });
      onSuccess?.(responseData);
    } catch (error) {
      console.error(error);
      toast({
        variant: "error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
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
                  disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4 border-t">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {lessonId ? "Update" : "Create"} Lesson
          </Button>
        </div>
      </form>
    </Form>
  );
}
