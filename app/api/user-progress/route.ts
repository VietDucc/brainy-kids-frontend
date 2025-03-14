import { NextResponse } from "next/server";
import { api } from "../config";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const response = await fetch(api.userProgress(userId), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user progress for user ${userId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user progress:", error);

    const fallbackData = {
      activeCourse: {
        id: 1,
        title: "French",
        imageSrc: "/france.svg",
      },
      hearts: 5,
      points: 120,
    };

    return NextResponse.json(fallbackData, { status: 200 });
  }
}
