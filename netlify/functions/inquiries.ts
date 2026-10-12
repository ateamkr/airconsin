import type { Config } from '@netlify/functions';
import {
  getStoredInquiries,
  saveStoredInquiries,
  verifyAdminToken,
  jsonResponse,
  handleOptions,
} from './_shared.ts';

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return handleOptions();
  }

  const url = new URL(req.url);

  // GET: Admin only - fetch list of customer inquiries
  if (req.method === 'GET') {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!verifyAdminToken(authHeader)) {
      return jsonResponse(
        { error: '상담 내역 조회는 관리자 권한이 필요합니다.', code: 'UNAUTHORIZED' },
        401
      );
    }

    try {
      const inquiries = await getStoredInquiries();
      return jsonResponse({ success: true, inquiries }, 200);
    } catch (err) {
      console.error('Error reading inquiries:', err);
      return jsonResponse({ error: '상담 내역을 불러오지 못했습니다.', code: 'SERVER_ERROR' }, 500);
    }
  }

  // POST: Public submission of a new consultation inquiry by visitor
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const name = typeof body?.name === 'string' ? body.name.trim() : '';
      const phone = typeof body?.phone === 'string' ? body.phone.trim() : '';
      const message = typeof body?.message === 'string' ? body.message.trim() : '';

      if (!name || !phone) {
        return jsonResponse(
          { error: '성함과 연락처를 올바르게 입력해주세요.', code: 'INVALID_INPUT' },
          400
        );
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newInquiry = {
        id: `inq-${Date.now()}`,
        name,
        phone,
        message: message || '견적 및 방문 실측 상담 요청',
        date: dateStr,
        read: false,
      };

      const existing = await getStoredInquiries();
      const updated = [newInquiry, ...existing];
      await saveStoredInquiries(updated);

      return jsonResponse({
        success: true,
        message: '상담 신청이 접수되었습니다.',
        inquiry: { id: newInquiry.id, date: newInquiry.date },
      }, 201);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      return jsonResponse({ error: '상담 접수 처리 중 오류가 발생했습니다.', code: 'SERVER_ERROR' }, 500);
    }
  }

  // DELETE: Admin only - delete an inquiry
  if (req.method === 'DELETE') {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (!verifyAdminToken(authHeader)) {
      return jsonResponse(
        { error: '삭제 권한이 없습니다. 다시 로그인해 주세요.', code: 'UNAUTHORIZED' },
        401
      );
    }

    try {
      let inquiryId = url.searchParams.get('id');
      if (!inquiryId) {
        try {
          const body = await req.json();
          inquiryId = body?.id;
        } catch {}
      }

      if (!inquiryId) {
        return jsonResponse({ error: '삭제할 상담 ID가 지정되지 않았습니다.', code: 'MISSING_ID' }, 400);
      }

      const existing = await getStoredInquiries();
      const updated = existing.filter((inq) => inq.id !== inquiryId);
      await saveStoredInquiries(updated);

      return jsonResponse({ success: true, message: '상담 내역이 삭제되었습니다.' }, 200);
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      return jsonResponse({ error: '상담 내역 삭제 중 오류가 발생했습니다.', code: 'SERVER_ERROR' }, 500);
    }
  }

  return jsonResponse({ error: '지원되지 않는 요청 메소드입니다.' }, 405);
};

export const config: Config = {
  path: '/api/inquiries',
};
