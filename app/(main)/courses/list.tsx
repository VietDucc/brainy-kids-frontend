"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "./card";

// Define types based on our mock data structure
type Course = {
  id: number;
  title: string;
  imageSrc: string;
};

type ListProps = {
  courses: Course[];
  activeCourseId?: number;
};

export const List = ({ courses, activeCourseId }: ListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) return router.push("/learn");

    startTransition(() => {
      // Mock the database update
      toast.success(
        `Switched to ${courses.find((c) => c.id === id)?.title} course`
      );
      // In a real app, this would call upsertUserProgress
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 pt-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          isActive={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
