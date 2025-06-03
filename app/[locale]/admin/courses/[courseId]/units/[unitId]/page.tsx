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
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const unitFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  orderUnit: z.number().min(0, "Order must be 0 or greater"),
});

type UnitFormValues = z.infer<typeof unitFormSchema>;

export default function UnitForm() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = params.unitId !== "new";

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      title: "",
      description: "",
      orderUnit: 0,
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchUnit = async () => {
        try {
          const response = await fetch(`/api/units/${params.unitId}`);
          const data = await response.json();
          form.reset({
            title: data.title,
            description: data.description,
            orderUnit: data.orderUnit,
          });
        } catch (error) {
          console.error("Error fetching unit:", error);
          toast({
            title: "Error fetching unit",
            description: "Please try again later",
            variant: "destructive",
          });
        }
      };
      fetchUnit();
    }
  }, [isEditing, params.unitId]);

  const onSubmit = async (data: UnitFormValues) => {
    try {
      const response = await fetch(
        isEditing ? `/api/units/1` : "/api/units/1",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            courseId: params.courseId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save unit");

      toast({
        title: `Unit ${isEditing ? "updated" : "created"} successfully`,
        variant: "success",
      });

      router.push(`/admin/courses/${params.courseId}`);
      router.refresh();
    } catch (error) {
      console.error("Error saving unit:", error);
      toast({
        title: `Error ${isEditing ? "updating" : "creating"} unit`,
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
            {isEditing ? "Edit Unit" : "Create New Unit"}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unit Information</CardTitle>
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
                      <Input placeholder="Enter unit title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your unit a clear and descriptive title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter unit description"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what students will learn in this unit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderUnit"
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
                      Set the order in which this unit appears (0 = first)
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
                  {isEditing ? "Update Unit" : "Create Unit"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
