import { auth } from "@clerk/nextjs/server";
import {  NextResponse } from "next/server";
import { api } from "../../config";


export async function POST(request: Request, { params }: { params: { id: number } }) {
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
      const { content,parentCommentId,blogId } = body;
  
      const response = await fetch(api.blogCommentById(params.id), {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'clerkUserId': userId,
            
        },
        body: JSON.stringify({ content,parentCommentId,blogId}),
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
      const response = await fetch(api.blogCommentById(params.id), {
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


  export async function DELETE(request: Request, { params }: { params: { id: number } }) {
    const { userId, getToken } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await getToken({ template: "jwt-clerk" });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const response = await fetch(api.commentById(params.id), {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'clerkUserId': userId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      return NextResponse.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
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
      const { content } = body;
  
      const response = await fetch(api.commentById(params.id), {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'clerkUserId': userId,
        },
        body: JSON.stringify({ content }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update comment");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }
  }     