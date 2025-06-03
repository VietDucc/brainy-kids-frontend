"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
import Loading from "@/app/loading";
import { useToast } from "@/hooks/use-toast";
interface Unit {
  id: number;
  title: string;
  description: string;
  orderUnit: number;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  orderUnit: z.number().min(0, "Order must be a positive number"),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditUnitPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      orderUnit: 0,
    },
  });

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch(`/api/units/${params.courseId}`);
        if (!response.ok) throw new Error("Failed to fetch unit");
        const units: Unit[] = await response.json();
        const currentUnit = units.find((u) => u.id === Number(params.id));

        if (!currentUnit) {
          throw new Error("Unit not found");
        }

        form.reset({
          title: currentUnit.title,
          description: currentUnit.description,
          orderUnit: currentUnit.orderUnit,
        });
      } catch (error) {
        console.error("Error fetching unit:", error);
        toast({
          variant: "error",
          title: "Error fetching unit",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [params.courseId, params.id, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(`/api/units/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update unit");
      }

      toast({
        variant: "success",
        title: "Unit updated successfully",
      });
      router.push(`/admin/units/${params.courseId}/${params.id}`);
    } catch (error) {
      console.error("Error updating unit:", error);
      toast({
        variant: "error",
        title: "Error updating unit",
      });
    }
  };

  if (loading) {
    return <Loading text="unit" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/units/${params.courseId}/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Unit</h1>
          <p className="text-muted-foreground">
            Make changes to your unit here
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter unit title" {...field} />
                  </FormControl>
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
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Enter unit order"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/admin/units/${params.courseId}/${params.id}`)
                }
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
