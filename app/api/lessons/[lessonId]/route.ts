import { NextRequest, NextResponse } from "next/server";
import { api } from "../../config";

export const dynamic = "force-dynamic"; // Use Next.js dynamic configuration

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const lessonId = parseInt(params.lessonId, 10);
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });
    }

    const response = await fetch(api.lessons(lessonId), {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch lesson ${lessonId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
