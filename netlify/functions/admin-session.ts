import type { Config } from '@netlify/functions';
import {
  verifyAdminToken,
  jsonResponse,
  handleOptions,
} from './_shared.ts';

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  const isValid = verifyAdminToken(authHeader);

  if (!isValid) {
    return jsonResponse({ authenticated: false, error: '세션이 만료되었거나 인증되지 않았습니다.' }, 401);
  }

  return jsonResponse({ authenticated: true, role: 'admin' }, 200);
};

export const config: Config = {
  path: '/api/admin/session',
};
