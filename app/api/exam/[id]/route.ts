import { NextResponse } from "next/server";
import { api } from "../../config";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
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
    const response = await fetch(api.examById(params.id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    });

    if (!response.ok) {
      throw new Error("Failed to fetch exams");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
    }
}