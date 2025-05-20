import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { api } from "../../config";

    
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
  
      const response = await fetch(api.challengeOptionById(Number(params.id)), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update challenge option");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { userId, getToken } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = await getToken({ template: "jwt-clerk" });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
      const response = await fetch(api.challengeOptionById(Number(params.id)), {
        method: "DELETE",           
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete challenge option");
      }
      
      return NextResponse.json({ message: "Challenge option deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }