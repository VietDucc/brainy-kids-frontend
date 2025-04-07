"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for units
const units = [
  { id: "1", title: "Greetings and Introductions", courseTitle: "Basic English for Kids" },
  { id: "2", title: "Numbers and Counting", courseTitle: "Basic English for Kids" },
  { id: "3", title: "Colors and Shapes", courseTitle: "Basic English for Kids" },
  { id: "4", title: "Family Members", courseTitle: "Basic English for Kids" },
  { id: "5", title: "Animals and Pets", courseTitle: "Basic English for Kids" },
]

export default function NewLessonPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    unitId: "",
    status: "draft",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/admin/lessons")
    }, 1000)

    console.log(formData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Lesson</h1>
        <p className="text-muted-foreground">Add a new lesson to your unit</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter lesson title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">This is the title of your lesson.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Enter lesson content"
                className="min-h-32"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">Provide the content for your lesson.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="unitId">Unit</Label>
                <Select value={formData.unitId} onValueChange={(value) => handleChange("unitId", value)}>
                  <SelectTrigger id="unitId">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.title} ({unit.courseTitle})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">The unit this lesson belongs to.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Set the visibility status of your lesson.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Lesson"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/lessons")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

