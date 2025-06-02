import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), 'public', 'subtitles', ...path);
    
    console.log('API: Attempting to read subtitle file:', filePath);
    
    const fileContent = await readFile(filePath, 'utf-8');
    
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('API: Error reading subtitle file:', error);
    return new NextResponse('Subtitle file not found', { status: 404 });
  }
} 