import type { Config } from '@netlify/functions';
import fs from 'node:fs';
import path from 'node:path';
import { getBlobStore, DATA_DIR, handleOptions } from './_shared.ts';

const MEDIA_DIR = path.resolve(DATA_DIR, 'media');

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  const url = new URL(req.url);
  // Extract filename from URL (e.g. /api/media/xyz.jpg or /.netlify/functions/media/xyz.jpg or ?id=xyz.jpg)
  const pathParts = url.pathname.split('/');
  let filename = pathParts[pathParts.length - 1];
  if (!filename || filename === 'media') {
    filename = url.searchParams.get('id') || '';
  }

  // Prevent directory traversal
  filename = path.basename(filename);
  if (!filename) {
    return new Response('Not Found', { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === '.png'
      ? 'image/png'
      : ext === '.webp'
      ? 'image/webp'
      : ext === '.svg'
      ? 'image/svg+xml'
      : ext === '.gif'
      ? 'image/gif'
      : 'image/jpeg';

  const store = getBlobStore();
  if (store) {
    try {
      const data = await store.get(`media/${filename}`, { type: 'arrayBuffer' });
      if (data) {
        return new Response(data, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (err) {
      console.warn('Blobs media get note:', err);
    }
  }

  // Local filesystem fallback
  try {
    const localPath = path.resolve(MEDIA_DIR, filename);
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch {}

  return new Response('Image Not Found', { status: 404 });
};

export const config: Config = {
  path: '/api/media/:id',
};
