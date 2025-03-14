const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = {
  courses: `${API_BASE_URL}/courses`,
  units: (courseId: number) => `${API_BASE_URL}/units/${courseId}`,
  lessons: (lessonId: number) => `${API_BASE_URL}/lessons/${lessonId}`,
  userProgress: (userId: string) => `${API_BASE_URL}/users/${userId}/progress`,
};
