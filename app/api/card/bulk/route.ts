import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { api } from "../../config";

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
    const cards = await request.json();
    console.log('Bulk Create Cards - Data:', cards);
    console.log('Bulk Create Cards - URL:', api.bulkCreateCards(userId));
    console.log('Bulk Create Cards - Token:', token ? 'Present' : 'Missing');

    const response = await fetch(api.bulkCreateCards(userId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cards),
    });

    console.log('Bulk Create Cards - Response Status:', response.status);
    console.log('Bulk Create Cards - Response OK:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Bulk Create Cards - Error Response:', errorText);
      throw new Error(`Failed to create cards: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Bulk Create Cards - Success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Bulk Create Cards - Error:', error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 