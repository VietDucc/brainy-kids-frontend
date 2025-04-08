// app/api/translate/route.ts
import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, from = 'auto', to = 'vi' } = body;
    const { getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data[0][0][0];
    
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}