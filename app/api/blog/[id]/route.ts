import {  NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { api } from "../../config";

export async function GET(request: Request, { params }: { params: { id: number } }) {
    const { userId, getToken } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = await getToken({ template: "jwt-clerk" });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      const response = await fetch(api.blogById(params.id), {
        cache: "no-store",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
  }
  
export async function PUT(request: Request, { params }: { params: { id: number } }) {
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
  
      const response = await fetch(api.blogById(params.id), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'clerkUserId': userId,
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update blog");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }