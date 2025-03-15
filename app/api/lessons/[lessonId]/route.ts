import { NextResponse } from "next/server";
import { api } from "../../config";

export async function GET(
  request: Request,
  context: { params: { lessonId: string } }
) {
  try {
    const params = await context.params;
    const lessonId = parseInt(params.lessonId);

    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });
    }

    const response = await fetch(api.lessons(lessonId), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lesson with ID ${lessonId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching lesson:`, error);
    return NextResponse.json([], { status: 500 });
  }
}
