import { NextResponse } from "next/server";
import { api } from "../config";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, getToken } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const token = await getToken({ template: "jwt-clerk" });
  
  
  console.log("API token from cookie:", token?.substring(0, 10) + "...");
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
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
