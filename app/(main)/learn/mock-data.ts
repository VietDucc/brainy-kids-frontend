export type LessonStatus = "locked" | "completed" | "available";

export interface Lesson {
  id: number;
  title: string;
  description: string;
  status: LessonStatus;
  icon: string;
}

export interface Unit {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface LessonData {
  units: Unit[];
}

export const mockLessonData: LessonData = {
  units: [
    {
      id: 1,
      title: "Unit 1: Basics",
      lessons: [
        {
          id: 1,
          title: "Greetings",
          description: "Learn basic greetings and introductions",
          status: "completed",
          icon: "👋",
        },
        {
          id: 2,
          title: "Basic Phrases",
          description: "Essential phrases for everyday conversations",
          status: "completed",
          icon: "🗣️",
        },
        {
          id: 3,
          title: "Numbers 1-10",
          description: "Learn to count from one to ten",
          status: "available",
          icon: "🔢",
        },
        {
          id: 4,
          title: "Simple Questions",
          description: "Ask and answer simple questions",
          status: "locked",
          icon: "❓",
        },
      ],
    },
    {
      id: 2,
      title: "Unit 2: Food & Drinks",
      lessons: [
        {
          id: 5,
          title: "Fruits & Vegetables",
          description: "Learn names of common fruits and vegetables",
          status: "locked",
          icon: "🍎",
        },
        {
          id: 6,
          title: "At the Restaurant",
          description: "Order food and drinks at a restaurant",
          status: "locked",
          icon: "🍽️",
        },
        {
          id: 7,
          title: "Cooking Terms",
          description: "Basic vocabulary for cooking and recipes",
          status: "locked",
          icon: "👨‍🍳",
        },
      ],
    },
    {
      id: 3,
      title: "Unit 3: Travel",
      lessons: [
        {
          id: 8,
          title: "Transportation",
          description: "Vocabulary for different modes of transport",
          status: "locked",
          icon: "🚆",
        },
        {
          id: 9,
          title: "Directions",
          description: "Ask for and give directions",
          status: "locked",
          icon: "🧭",
        },
        {
          id: 10,
          title: "Accommodation",
          description: "Book and talk about hotel rooms",
          status: "locked",
          icon: "🏨",
        },
        {
          id: 11,
          title: "Tourist Attractions",
          description: "Discuss popular places to visit",
          status: "locked",
          icon: "🗿",
        },
      ],
    },
  ],
};
