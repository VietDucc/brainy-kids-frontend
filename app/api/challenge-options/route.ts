import { NextResponse } from "next/server";
import { api } from "../config";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get("challengeId");

  if (!challengeId) {
    return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 });
  }
  const { userId, getToken } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const token = await getToken({ template: "jwt-clerk" });
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const response = await fetch(api.challengeOptions(Number(challengeId)), {
      cache: "no-store",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch challenge options");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch challenge options" }, { status: 500 });
  }
}

