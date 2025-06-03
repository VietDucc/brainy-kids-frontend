import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { api } from "../config";

export async function POST(request: NextRequest) {
    const { getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { amount, orderInfo } = await request.json();
  
    const response = await fetch(api.vnpay(amount, orderInfo), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, orderInfo }),
    });
  
    if (!response.ok) { 
      return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
    }

  return NextResponse.json(  await response.json() , { status: 201 });
}
