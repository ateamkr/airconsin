import type { Config } from '@netlify/functions';
import {
  resetStoredSiteData,
  verifyAdminToken,
  jsonResponse,
  handleOptions,
} from './_shared.ts';

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
      { error: '관리자 인증이 만료되었거나 올바르지 않습니다. 다시 로그인해 주세요.', code: 'UNAUTHORIZED' },
      401
    );
  }

  try {
    await resetStoredSiteData();
    return jsonResponse({ success: true, message: '초기화 완료' }, 200);
  } catch (err) {
    console.error('Error resetting site data:', err);
    return jsonResponse({ error: '데이터 초기화에 실패했습니다.', code: 'SERVER_ERROR' }, 500);
  }
};

export const config: Config = {
  path: '/api/site-data/reset',
};
