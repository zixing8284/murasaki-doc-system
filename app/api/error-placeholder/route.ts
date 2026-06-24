import { NextRequest } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

// TODO use satori to generate placeholder images

export async function GET(req: NextRequest) {
  const size = req.nextUrl.searchParams.get('size');
  const [width, height] = (size || '').split('x').map(Number);

  if (!size || isNaN(width) || isNaN(height)) {
    return new Response('Invalid parameters', { status: 400 });
  }

  const imagePath = path.join(process.cwd(), 'public', 'error-placeholder.svg');

  return sharp(imagePath)
    .resize(width, height)
    .png()
    .toBuffer()
    .then(
      (buffer) =>
        new Response(new Uint8Array(buffer), {
          headers: { 'Content-Type': 'image/png' },
        }),
    )
    .catch(() => new Response('Error processing image', { status: 500 }));
}
