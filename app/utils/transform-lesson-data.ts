export const transformLessonData = (data: any, lessonId: number) => {
  console.log("transformLessonData input:", JSON.stringify(data, null, 2));

  // Nếu data là mảng các challenges
  if (Array.isArray(data) && data.length > 0 && data[0].type) {
    console.log("Data is an array of challenges");

    // Tạo đối tượng lesson với challenges là mảng data
    const lesson = {
      id: lessonId,
      title: `Lesson ${lessonId}`,
      orderIndex: 0,
      challenges: data,
    };

    console.log("Transformed lesson:", JSON.stringify(lesson, null, 2));
    return lesson;
  }

  // Nếu data là một lesson hoặc mảng lessons
  if (Array.isArray(data)) {
    if (data.length === 0) {
      console.log("Empty data array");
      return {
        id: lessonId,
        title: `Lesson ${lessonId}`,
        orderIndex: 0,
        challenges: [],
      };
    }

    console.log("Data is an array of lessons, using first item");
    return {
      ...data[0],
      id: lessonId,
      challenges: data[0].challenges || [],
    };
  }

  // Nếu data là một object
  console.log("Data is a single object");
  return {
    ...data,
    id: lessonId,
    challenges: data.challenges || [],
  };
};
