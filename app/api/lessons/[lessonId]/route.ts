import { NextRequest, NextResponse } from "next/server";
import { api } from "../../config";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // Use Next.js dynamic configuration

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const token = (await cookies()).get("token")?.value;

  try {
    const lessonId = parseInt(params.lessonId, 10);
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });
    }

    const response = await fetch(api.lessons(lessonId), {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
