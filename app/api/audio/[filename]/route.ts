import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = join(process.cwd(), 'public', filename);
    
    console.log('API: Attempting to read audio file:', filePath);
    
    const fileContent = await readFile(filePath);
    
    // Determine content type based on file extension
    const getContentType = (filename: string) => {
      const ext = filename.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'mp3':
          return 'audio/mpeg';
        case 'wav':
          return 'audio/wav';
        case 'ogg':
          return 'audio/ogg';
        case 'm4a':
          return 'audio/mp4';
        default:
          return 'audio/mpeg';
      }
    };
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': getContentType(filename),
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('API: Error reading audio file:', error);
    return new NextResponse('Audio file not found', { status: 404 });
  }
} 