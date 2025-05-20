// app/api/config.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = {
  courses: `${API_BASE_URL}/api/courses`,
  courseById: (courseId: number) => `${API_BASE_URL}/api/courses/${courseId}`,
  units: (courseId: number) => `${API_BASE_URL}/api/units/${courseId}`,
  lessons: (lessonId: number) =>
    `${API_BASE_URL}/api/lessons/lesson/${lessonId}`,
  editLesson: (lessonId: number) =>
    `${API_BASE_URL}/api/lessons/${lessonId}`,
  challenges: (challengeId: number) =>
    `${API_BASE_URL}/api/challenges/${challengeId}`,
  userProgress: (userId: string) =>
    `${API_BASE_URL}/api/users/${userId}/progress`,
  lessonProgress: `${API_BASE_URL}/lesson-progress`,
  getLessonProgress: (clerkUserId: string) =>
    `${API_BASE_URL}/lesson-progress/${clerkUserId}`,
  leaderboard: `${API_BASE_URL}/api/leaderboard`,
  vocab: (lessonId: number) => `${API_BASE_URL}/api/vocabulary/lesson/${lessonId}`,
  challengeOptions: (challengeId: number) =>
    `${API_BASE_URL}/api/challenge-options/{challengeId}?challengeId=${challengeId}`,

  challengeOptionById: (challengeId: number) =>
    `${API_BASE_URL}/api/challenge-options/${challengeId}`,
  flashcard: (clerkUserId: string) =>
    `${API_BASE_URL}/api/${clerkUserId}/cards`,
  flashcardById: (clerkUserId: string, id: number) =>
    `${API_BASE_URL}/api/${clerkUserId}/cards/${id}`,
  postLessons: (unitId: number) =>
    `${API_BASE_URL}/api/lessons/unit/${unitId}`,
};