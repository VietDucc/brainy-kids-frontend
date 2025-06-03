import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { api } from "../../config";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { userId, getToken } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const token = await getToken({ template: "jwt-clerk" });
  
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const { id } = await params;
      const {front, back} = await request.json();
  
      const response = await fetch(api.cardById(userId, Number(id)), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
     
        },
        body: JSON.stringify({front, back}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update card");
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { userId, getToken } = await auth();
  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await getToken({ template: "jwt-clerk" });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const { id } = await params;
      console.log('DELETE Card - ID:', id);
      console.log('DELETE Card - URL:', api.deleteCardById(Number(id)));
      console.log('DELETE Card - Token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(api.deleteCardById(Number(id)), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('DELETE Card - Response Status:', response.status);
      console.log('DELETE Card - Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('DELETE Card - Error Response:', errorText);
        throw new Error(`Failed to delete card: ${response.status} ${errorText}`);
      }

      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const responseText = await response.text();
        if (responseText) {
          data = JSON.parse(responseText);
        }
      }
      
      console.log('DELETE Card - Success:', data);
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error('DELETE Card - Error:', error);
      return NextResponse.json({ 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  }
  
