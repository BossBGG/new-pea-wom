import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const manifestPath = join(process.cwd(), 'public', 'manifest.json');
    const manifest = readFileSync(manifestPath, 'utf8');
    
    return new NextResponse(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
  }
}