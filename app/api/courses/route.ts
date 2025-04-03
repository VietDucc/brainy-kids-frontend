import { NextResponse } from "next/server";
import { api } from "../config";
import { cookies } from "next/headers";
export async function GET() {
  const token = (await cookies()).get("token")?.value;
  try {
    const response = await fetch(api.courses, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
