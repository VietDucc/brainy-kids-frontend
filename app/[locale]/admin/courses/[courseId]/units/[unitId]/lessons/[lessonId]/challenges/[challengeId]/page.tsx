"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { ChevronLeft, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const optionSchema = z.object({
  textOption: z.string().min(1, "Option text is required"),
  correct: z.boolean(),
  imageSrc: z.string().optional(),
  audioSrc: z.string().optional(),
});

const challengeFormSchema = z.object({
  type: z.enum(["SELECT", "ASSIST"]),
  question: z.string().min(1, "Question is required"),
  imgSrc: z.string().optional(),
  orderChallenge: z.number().min(0, "Order must be 0 or greater"),
  challengesOption: z
    .array(optionSchema)
    .min(1, "At least one option is required"),
});

type ChallengeFormValues = z.infer<typeof challengeFormSchema>;

export default function ChallengeForm() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = params.challengeId !== "new";

  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      type: "SELECT",
      question: "",
      imgSrc: "",
      orderChallenge: 0,
      challengesOption: [
        {
          textOption: "",
          correct: false,
          imageSrc: "",
          audioSrc: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "challengesOption",
  });

  useEffect(() => {
    if (isEditing) {
      const fetchChallenge = async () => {
        try {
          const response = await fetch(`/api/challenges/${params.challengeId}`);
          const data = await response.json();
          form.reset({
            type: data.type,
            question: data.question,
            imgSrc: data.imgSrc || "",
            orderChallenge: data.orderChallenge,
            challengesOption: data.challengesOption,
          });
        } catch (error) {
          console.error("Error fetching challenge:", error);
          toast({
            title: "Error fetching challenge",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      };
      fetchChallenge();
    }
  }, [isEditing, params.challengeId]);

  const onSubmit = async (data: ChallengeFormValues) => {
    try {
      const response = await fetch(
        isEditing ? `/api/challenges/${params.challengeId}` : "/api/challenges",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            lessonId: params.lessonId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save challenge");

      toast({
        title: `Challenge ${isEditing ? "updated" : "created"} successfully`,
        variant: "success",
      });

      router.push(`/admin/courses/${params.courseId}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving challenge:", error);
      toast({
        title: `Error ${isEditing ? "updating" : "creating"} challenge`,
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
            {isEditing ? "Edit Challenge" : "Create New Challenge"}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select challenge type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SELECT">Multiple Choice</SelectItem>
                        <SelectItem value="ASSIST">Assisted Answer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the type of challenge
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your question" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imgSrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add an image to accompany your question
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderChallenge"
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
                      Set the order in which this challenge appears
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Options</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        textOption: "",
                        correct: false,
                        imageSrc: "",
                        audioSrc: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <FormField
                            control={form.control}
                            name={`challengesOption.${index}.textOption`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Option Text</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`challengesOption.${index}.correct`}
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="!mt-0">
                                  Correct Answer
                                </FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`challengesOption.${index}.imageSrc`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`challengesOption.${index}.audioSrc`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Audio URL (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? "Update Challenge" : "Create Challenge"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
