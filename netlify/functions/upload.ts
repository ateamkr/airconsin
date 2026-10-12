import type { Config } from '@netlify/functions';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  getBlobStore,
  verifyAdminToken,
  jsonResponse,
  handleOptions,
  DATA_DIR,
} from './_shared.ts';

const MEDIA_DIR = path.resolve(DATA_DIR, 'media');

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: '지원되지 않는 요청 메소드입니다.' }, 405);
  }

  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  if (!verifyAdminToken(authHeader)) {
    return jsonResponse(
      { error: '파일 업로드 권한이 없습니다. 다시 로그인해 주세요.', code: 'UNAUTHORIZED' },
      401
    );
  }

  try {
    const body = await req.json();
    const dataUrl = body?.dataUrl || body?.fileData;

    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return jsonResponse({ error: '올바른 이미지 데이터가 아닙니다.', code: 'INVALID_DATA' }, 400);
    }

    const matches = dataUrl.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
    if (!matches) {
      return jsonResponse({ error: '인코딩된 이미지 형식을 분석할 수 없습니다.', code: 'INVALID_FORMAT' }, 400);
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique ID
    const hash = crypto.randomBytes(8).toString('hex');
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const mediaId = `${Date.now()}_${hash}.${ext}`;

    const store = getBlobStore();
    if (store) {
      try {
        await store.set(`media/${mediaId}`, buffer.buffer as ArrayBuffer, {
          metadata: { contentType },
        });
      } catch (err) {
        console.warn('Blobs media upload note:', err);
      }
    }

    // Local filesystem storage fallback
    try {
      if (!fs.existsSync(MEDIA_DIR)) {
        fs.mkdirSync(MEDIA_DIR, { recursive: true });
      }
      fs.writeFileSync(path.resolve(MEDIA_DIR, mediaId), buffer);
    } catch {}

    const mediaUrl = `/api/media/${mediaId}`;
    return jsonResponse({
      success: true,
      url: mediaUrl,
      mediaId,
      contentType,
      size: buffer.length,
    }, 200);
  } catch (err) {
    console.error('Error in media upload:', err);
    return jsonResponse({ error: '이미지 업로드에 실패했습니다.', code: 'UPLOAD_FAILED' }, 500);
  }
};

export const config: Config = {
  path: '/api/upload',
};
