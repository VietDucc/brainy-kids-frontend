const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://duc-spring.ngodat0103.live:8080/demo";

export const api = {
  courses: `${API_BASE_URL}/api/courses`,
  units: (courseId: number) => `${API_BASE_URL}/api/units/${courseId}`,
  lessons: (lessonId: number) =>
    `${API_BASE_URL}/api/lessons/lesson/${lessonId}`,
  challenges: (challengeId: number) =>
    `${API_BASE_URL}/api/challenges/${challengeId}`,
  userProgress: (userId: string) =>
    `${API_BASE_URL}/api/users/${userId}/progress`,
  lessonProgress: `${API_BASE_URL}/lesson-progress`,
  getLessonProgress: (clerkUserId: string) =>
    `${API_BASE_URL}/lesson-progress/${clerkUserId}`,
};
