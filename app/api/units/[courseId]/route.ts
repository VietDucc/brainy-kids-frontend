import { NextRequest, NextResponse } from "next/server";
import { api } from "../../config";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic"; // Use Next.js dynamic configuration

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId, getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = parseInt(params.courseId, 10);
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    const response = await fetch(api.units(courseId), {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch units for course ${courseId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch units for course" },
      { status: 500 }
    );
  }
}
