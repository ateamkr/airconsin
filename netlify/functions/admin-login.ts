import type { Config } from '@netlify/functions';
import {
  getAdminPassword,
  createAdminToken,
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

  try {
    const body = await req.json();
    const inputPassword = typeof body?.password === 'string' ? body.password.trim() : '';

    const expectedPassword = getAdminPassword();

    if (!inputPassword || inputPassword !== expectedPassword) {
      return jsonResponse({ error: '비밀번호가 올바르지 않습니다.', code: 'INVALID_PASSWORD' }, 401);
    }

    const token = createAdminToken();
    return jsonResponse({
      success: true,
      token,
      message: '관리자 인증 성공',
    }, 200);
  } catch (err) {
    console.error('Error during admin login:', err);
    return jsonResponse({ error: '로그인 처리 중 오류가 발생했습니다.', code: 'SERVER_ERROR' }, 500);
  }
};

export const config: Config = {
  path: '/api/admin/login',
};
