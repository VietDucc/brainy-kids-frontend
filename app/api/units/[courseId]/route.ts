import { NextResponse } from "next/server";
import { api } from "../../config";

export async function GET(
  request: Request,
  context: { params: { courseId: string } }
) {
  try {
    const params = await context.params;
    const courseId = parseInt(params.courseId);

    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const response = await fetch(api.units(courseId), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch units for course ${courseId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching units:`, error);
    return NextResponse.json([], { status: 500 });
  }
}
