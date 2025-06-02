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
    const cardData = await request.json();
    console.log('Create Card - Data:', cardData);
    console.log('Create Card - URL:', api.flashcard(userId));
    console.log('Create Card - Token:', token ? 'Present' : 'Missing');

    const response = await fetch(api.flashcard(userId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cardData),
    });

    console.log('Create Card - Response Status:', response.status);
    console.log('Create Card - Response OK:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Create Card - Error Response:', errorText);
      throw new Error(`Failed to create card: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Create Card - Success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create Card - Error:', error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
