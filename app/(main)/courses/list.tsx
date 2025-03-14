"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "./card";
import { motion } from "framer-motion";

// Define types based on our mock data structure
export type Course = {
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
        `Switched to ${courses.find((c) => c.id === id)?.title} course`,
        {
          icon: "🎉",
          style: {
            backgroundColor: "#4ade80",
            color: "white",
            border: "none",
          },
        }
      );
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {courses.map((course) => (
        <motion.div key={course.id} variants={item}>
          <Card
            id={course.id}
            title={course.title}
            imageSrc={course.imageSrc}
            onClick={onClick}
            disabled={pending}
            isActive={course.id === activeCourseId}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
