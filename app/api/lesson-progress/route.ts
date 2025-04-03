import { NextResponse } from "next/server";
import { api } from "../config";
import { auth } from "@clerk/nextjs/server";
export async function POST(req: Request) {
  try {
    const { userId, getToken } = await auth();
    const token = await getToken();
    const body = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[LESSON_PROGRESS_POST] Request body:", body);

    const response = await fetch(`${api.lessonProgress}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[LESSON_PROGRESS_POST] API Error: Status ${response.status}`,
        errorText
      );
      return new NextResponse(`API Error: ${errorText}`, {
        status: response.status,
      });
    }

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("[LESSON_PROGRESS_POST] Success response:", data);
      return NextResponse.json(data);
    } else {
      const textData = await response.text();
      console.log("[LESSON_PROGRESS_POST] Success text response:", textData);
      return new NextResponse(textData, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  } catch (error) {
    console.error("[LESSON_PROGRESS_POST]", error);
    return new NextResponse(`Internal Error: ${error.message}`, {
      status: 500,
    });
  }
}
