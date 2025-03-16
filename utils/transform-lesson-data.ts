import { LessonType } from "@/types/learn";

/**
 * Chuyển đổi dữ liệu API thành cấu trúc lesson
 */
export function transformLessonData(data: any, lessonId: number): LessonType {
  // Nếu data là mảng các challenges
  if (
    Array.isArray(data) &&
    data.length > 0 &&
    data[0].hasOwnProperty("type") &&
    data[0].hasOwnProperty("question")
  ) {
    return {
      id: lessonId,
      title: `Lesson ${lessonId}`,
      orderIndex: 0,
      challenges: data.map((challenge) => ({
        ...challenge,
        challengesOption: Array.isArray(challenge.challengesOption)
          ? challenge.challengesOption.map((option) => ({
              ...option,
              imageSrc: option.imageSrc || null,
              audioSrc: option.audioSrc || null,
            }))
          : [],
        challengesProgress: Array.isArray(challenge.challengesProgress)
          ? challenge.challengesProgress
          : [],
      })),
    };
  }

  // Nếu data là một lesson hoặc mảng lessons
  if (Array.isArray(data) && data.length > 0) {
    const lesson = data[0];
    return {
      id: lesson.id || lessonId,
      title: lesson.title || `Lesson ${lessonId}`,
      orderIndex: lesson.orderIndex || 0,
      challenges: Array.isArray(lesson.challenges)
        ? lesson.challenges.map((challenge) => ({
            ...challenge,
            challengesOption: Array.isArray(challenge.challengesOption)
              ? challenge.challengesOption.map((option) => ({
                  ...option,
                  imageSrc: option.imageSrc || null,
                  audioSrc: option.audioSrc || null,
                }))
              : [],
            challengesProgress: Array.isArray(challenge.challengesProgress)
              ? challenge.challengesProgress
              : [],
          }))
        : [],
    };
  }

  // Fallback nếu không có dữ liệu hợp lệ
  return {
    id: lessonId,
    title: `Lesson ${lessonId}`,
    orderIndex: 0,
    challenges: [],
  };
}
