"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function NewUnitPage() {
  const router = useRouter();
  const courseId = 1;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    orderUnit: 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/units/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          title: formData.title,
          description: formData.description,
          orderUnit: formData.orderUnit,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create unit");
      }

      toast({
        variant: "success",
        title: "Unit created successfully",
      });
      router.push("/admin/units");
    } catch (error) {
      console.error("Error creating unit:", error);
      toast({
        variant: "error",
        title: "Error creating unit",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Unit</h1>
        <p className="text-muted-foreground">Add a new unit to your course</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unit Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter unit title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                This is the title of your unit.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter unit description"
                className="min-h-32"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Provide a detailed description of your unit.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderUnit">Order</Label>
              <Input
                id="orderUnit"
                type="number"
                placeholder="Enter unit order"
                value={formData.orderUnit}
                onChange={(e) =>
                  handleChange("orderUnit", parseInt(e.target.value, 10))
                }
                required
                min={0}
              />
              <p className="text-sm text-muted-foreground">
                The order in which this unit appears in the course.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Unit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/units")}
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
