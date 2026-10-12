import type { Config } from '@netlify/functions';
import {
  getStoredSiteData,
  saveStoredSiteData,
  sanitizeSiteData,
  verifyAdminToken,
  jsonResponse,
  handleOptions,
} from './_shared.ts';

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  // GET: Public fetch of current site data
  if (req.method === 'GET') {
    try {
      const stored = await getStoredSiteData();
      if (stored && Object.keys(stored).length > 0) {
        return jsonResponse(sanitizeSiteData(stored), 200);
      }
      return jsonResponse({ empty: true }, 200);
    } catch (err) {
      console.error('Error fetching site data:', err);
      return jsonResponse({ error: '사이트 데이터를 불러오는데 실패했습니다.' }, 500);
    }
  }

  // POST: Admin save of site data
  if (req.method === 'POST') {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!verifyAdminToken(authHeader)) {
      return jsonResponse(
        { error: '관리자 인증이 만료되었거나 올바르지 않습니다. 다시 로그인해 주세요.', code: 'UNAUTHORIZED' },
        401
      );
    }

    try {
      const incoming = await req.json();
      if (!incoming || typeof incoming !== 'object') {
        return jsonResponse({ error: '올바른 형식의 사이트 데이터가 아닙니다.', code: 'INVALID_PAYLOAD' }, 400);
      }

      const existing = await getStoredSiteData();
      const merged: Record<string, any> = {
        ...existing,
        ...incoming,
        company: { ...(existing.company || {}), ...(incoming.company || {}) },
        settings: { ...(existing.settings || {}), ...(incoming.settings || {}) },
        afterService: { ...(existing.afterService || {}), ...(incoming.afterService || {}) },
        growthTrust: { ...(existing.growthTrust || {}), ...(incoming.growthTrust || {}) },
        honestEstimate: { ...(existing.honestEstimate || {}), ...(incoming.honestEstimate || {}) },
        consultationSection: { ...(existing.consultationSection || {}), ...(incoming.consultationSection || {}) },
        updatedAt: Date.now(),
      };

      // Keep explicit array values if provided
      if (Array.isArray(incoming.navMenu)) merged.navMenu = incoming.navMenu;
      if (Array.isArray(incoming.heroSlides)) merged.heroSlides = incoming.heroSlides;
      if (Array.isArray(incoming.stats)) merged.stats = incoming.stats;
      if (Array.isArray(incoming.reviews)) merged.reviews = incoming.reviews;
      if (incoming.mottoSection) merged.mottoSection = incoming.mottoSection;

      // Do NOT save admin password into site data json
      if (merged.settings) {
        delete merged.settings.adminPassword;
      }
      // Keep inquiries separate
      delete merged.inquiries;

      await saveStoredSiteData(merged);

      return jsonResponse({
        success: true,
        siteData: sanitizeSiteData(merged),
        updatedAt: merged.updatedAt,
      }, 200);
    } catch (err: any) {
      console.error('Error saving site data:', err);
      const isOversized = err?.message?.includes('payload too large') || err?.message?.includes('413');
      return jsonResponse(
        {
          error: isOversized
            ? '저장 데이터 용량이 초과되었습니다. 이미지 크기를 줄여주세요.'
            : '서버에 데이터를 저장하는 도중 오류가 발생했습니다.',
          code: isOversized ? 'PAYLOAD_TOO_LARGE' : 'SERVER_ERROR',
        },
        isOversized ? 413 : 500
      );
    }
  }

  return jsonResponse({ error: '지원되지 않는 요청 메소드입니다.' }, 405);
};

export const config: Config = {
  path: '/api/site-data',
};
