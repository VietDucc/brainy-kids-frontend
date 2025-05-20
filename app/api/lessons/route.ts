import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { api } from "../config";

export async function POST(request: Request) {
    const { userId, getToken } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const token = await getToken({ template: "jwt-clerk" });
  
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const body = await request.json();
  
      const response = await fetch(api.postLessons(body.unitId), {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create course");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
    }
  }