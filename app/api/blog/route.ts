import { auth } from "@clerk/nextjs/server";
import {  NextResponse } from "next/server";
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
      const { title, imageSrc, content } = body;
  
      const response = await fetch(api.blog, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'clerkUserId': userId,
        },
        body: JSON.stringify({ title, imageSrc ,content}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create blog");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
  }

  export async function GET() {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = await getToken({ template: "jwt-clerk" });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      const response = await fetch(api.blog, {
        cache: "no-store",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
  }


