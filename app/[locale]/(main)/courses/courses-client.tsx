"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Card } from "./card";

// Define types based on our mock data structure
export type Course = {
  id: number;
  title: string;
  imageSrc: string;
};

type CoursesClientProps = {
  courses: Course[];
  activeCourseId?: number;
};

export function CoursesClient({
  courses,
  activeCourseId = 1,
}: CoursesClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    const selectedCourse = courses.find((c) => c.id === id);

    if (id === activeCourseId) {
      if (selectedCourse) {
        localStorage.setItem(
          "activeCourse",
          JSON.stringify({
            id: selectedCourse.id,
            title: selectedCourse.title,
            imageSrc: selectedCourse.imageSrc,
          })
        );
      }
      return router.push("/learn");
    }

    startTransition(() => {
      // Lưu thông tin khóa học vào localStorage
      if (selectedCourse) {
        localStorage.setItem(
          "activeCourse",
          JSON.stringify({
            id: selectedCourse.id,
            title: selectedCourse.title,
            imageSrc: selectedCourse.imageSrc,
          })
        );
      }

      toast.success(`Switched to ${selectedCourse?.title} course`, {
        icon: "🎉",
        style: {
          backgroundColor: "#4ade80",
          color: "white",
          border: "none",
        },
      });
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
    <div className="mx-auto h-full max-w-[1200px] px-3 py-6">
      {/* Header Banner */}
      <div className="relative mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-bg.svg')] bg-repeat opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome to Learning Adventure!
            </h1>
            <p className="mt-2 text-blue-100">
              Choose a course and start your learning journey today!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🌎</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Language Courses
            </h2>
          </div>
          <Separator className="my-4 bg-gradient-to-r from-blue-500 to-purple-500" />

          {/* Courses Grid */}
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
        </section>
      </div>
    </div>
  );
}
