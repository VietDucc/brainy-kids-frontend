import { auth } from "@clerk/nextjs/server";
import { api } from "@/app/api/config";
import { CoursesClient } from "./courses-client";

export default async function CoursesPage() {
  const { getToken } = await auth();

  const token = await getToken({ template: "jwt-clerk" });

  const res = await fetch(api.courses, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch courses");

  const courses = await res.json();

  return <CoursesClient courses={courses} activeCourseId={1} />;
}
