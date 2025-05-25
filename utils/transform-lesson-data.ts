import { LessonType } from "@/types/learn";


export function transformLessonData(data, lessonId): LessonType {
  if (Array.isArray(data) && data.length > 0) {
    const lesson = data[0];
    return {
      id: lesson.id || lessonId,
      title: lesson.title || `Lesson ${lessonId}`,
      orderLesson: lesson.orderLesson || 0,
      challenges: Array.isArray(lesson.challenges)
        ? lesson.challenges.map((challenge) => ({
            id: challenge.id,
            type: challenge.type,
            question: challenge.question,
            orderChallenge: challenge.orderChallenge,
            imgSrc: challenge.imgSrc,
            challengesOption: Array.isArray(challenge.challengesOption)
              ? challenge.challengesOption.map((option) => ({
                  id: option.id,
                  textOption: option.textOption,
                  correct: option.correct,
                  imageSrc: option.imageSrc || null,
                  audioSrc: option.audioSrc || null,
                }))
              : [],
            challengesProgress: Array.isArray(challenge.challengesProgress)
              ? challenge.challengesProgress
              : [],
          }))
        : undefined
    };
  }

  return {
    id: lessonId,
    title: `Lesson ${lessonId}`,
    orderLesson: 0,
  };
}
