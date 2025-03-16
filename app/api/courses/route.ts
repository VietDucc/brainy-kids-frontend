import { NextResponse } from "next/server";
import { api } from "../config";

export async function GET() {
  try {
    const response = await fetch(api.courses, {
      cache: "no-store",
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
