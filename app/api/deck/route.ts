import { NextResponse } from "next/server";
import { api } from "../config";
import { auth } from "@clerk/nextjs/server";

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
    const response = await fetch(api.deck, {
      cache: "no-store",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch deck");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch deck" }, { status: 500 });
  }
}
