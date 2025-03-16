const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://duc-spring.ngodat0103.live:8080/demo/api";

export const api = {
  courses: `${API_BASE_URL}/courses`,
  units: (courseId: number) => `${API_BASE_URL}/units/${courseId}`,
  lessons: (lessonId: number) => `${API_BASE_URL}/lessons/lesson/${lessonId}`,
  challenges: (challengeId: number) =>
    `${API_BASE_URL}/challenges/${challengeId}`,
  userProgress: (userId: string) => `${API_BASE_URL}/users/${userId}/progress`,
};
