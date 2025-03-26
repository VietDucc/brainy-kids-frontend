import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fallbackData = {
      activeCourse: {
        id: 1,
        title: "French",
        imageSrc: "/france.svg",
      },
      hearts: 2,
      points: 120,
    };

    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error("Error fetching user progress:", error);
  }
}
