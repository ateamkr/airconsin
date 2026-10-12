import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON payload for custom logo and photos
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'site-data.json');
const INQUIRIES_FILE = path.resolve(DATA_DIR, 'inquiries.json');
const MEDIA_DIR = path.resolve(DATA_DIR, 'media');

// Ensure data and media directories exist
[DATA_DIR, MEDIA_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper for admin password and session tokens
function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || '8849';
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'airconsin-secure-session-salt-2025';
}

function createAdminToken(): string {
  const secret = getSessionSecret();
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifyAdminToken(authHeader: string | undefined): boolean {
  if (!authHeader) return false;
  const parts = authHeader.trim().split(' ');
  const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : parts[0];
  if (!token || !token.includes('.')) return false;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;

  const secret = getSessionSecret();
  const expectedSignature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
    if (payload.role !== 'admin') return false;
    if (typeof payload.exp === 'number' && Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

// Helper to safely read current site data
function readStoredSiteData(): Record<string, any> | null {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      if (content && content.trim().length > 0) {
        return JSON.parse(content);
      }
    }
  } catch (error) {
    console.warn('Failed to read DATA_FILE, attempting recovery:', error);
  }
  return null;
}

// Helper to sanitize public site data
function sanitizeSiteData(data: Record<string, any>): Record<string, any> {
  const clone = { ...data };
  if (clone.settings) {
    clone.settings = { ...clone.settings };
    delete clone.settings.adminPassword;
  }
  delete clone.inquiries;
  return clone;
}

// Inquiries persistence
function readStoredInquiries(): any[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const content = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      if (content && content.trim().length > 0) {
        return JSON.parse(content);
      }
    }
  } catch (e) {}

  const site = readStoredSiteData();
  if (site && Array.isArray(site.inquiries)) {
    return site.inquiries;
  }
  return [];
}

function saveStoredInquiries(list: any[]) {
  const temp = `${INQUIRIES_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(temp, JSON.stringify(list, null, 2), 'utf-8');
  fs.renameSync(temp, INQUIRIES_FILE);
}

// API: POST Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const inputPassword = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    const expected = getAdminPassword();

    if (!inputPassword || inputPassword !== expected) {
      return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.', code: 'INVALID_PASSWORD' });
    }

    const token = createAdminToken();
    return res.status(200).json({ success: true, token, message: '관리자 인증 성공' });
  } catch (err) {
    return res.status(500).json({ error: '로그인 처리 중 오류 발생' });
  }
});

// API: GET Admin Session Check
app.get('/api/admin/session', (req, res) => {
  const isAuth = verifyAdminToken(req.headers.authorization);
  if (!isAuth) {
    return res.status(401).json({ authenticated: false });
  }
  return res.status(200).json({ authenticated: true, role: 'admin' });
});

// API: GET public site data (sanitized)
app.get('/api/site-data', (_req, res) => {
  try {
    const stored = readStoredSiteData();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (stored) {
      return res.status(200).json(sanitizeSiteData(stored));
    }
    return res.status(200).json({ empty: true });
  } catch (error) {
    console.error('Error reading site data:', error);
    return res.status(500).json({ error: 'Failed to read site data' });
  }
});

// API: POST update site data (Requires admin token)
app.post('/api/site-data', (req, res) => {
  if (!verifyAdminToken(req.headers.authorization)) {
    return res.status(401).json({
      error: '관리자 인증이 만료되었거나 올바르지 않습니다. 다시 로그인해 주세요.',
      code: 'UNAUTHORIZED',
    });
  }

  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ error: 'Invalid site data payload' });
    }

    const existing = readStoredSiteData() || {};
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

    if (Array.isArray(incoming.navMenu)) merged.navMenu = incoming.navMenu;
    if (Array.isArray(incoming.heroSlides)) merged.heroSlides = incoming.heroSlides;
    if (Array.isArray(incoming.stats)) merged.stats = incoming.stats;
    if (Array.isArray(incoming.reviews)) merged.reviews = incoming.reviews;
    if (incoming.mottoSection) merged.mottoSection = incoming.mottoSection;

    // Never save adminPassword or inquiries into site data json
    if (merged.settings) {
      delete merged.settings.adminPassword;
    }
    delete merged.inquiries;

    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(merged, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ success: true, siteData: sanitizeSiteData(merged), updatedAt: merged.updatedAt });
  } catch (error) {
    console.error('Error saving site data:', error);
    return res.status(500).json({ error: 'Failed to save site data' });
  }
});

// API: POST reset site data to defaults (Requires admin token)
app.post('/api/site-data/reset', (req, res) => {
  if (!verifyAdminToken(req.headers.authorization)) {
    return res.status(401).json({ error: '관리자 인증이 필요합니다.', code: 'UNAUTHORIZED' });
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error resetting site data:', error);
    return res.status(500).json({ error: 'Failed to reset site data' });
  }
});

// API: Inquiries endpoints
app.get('/api/inquiries', (req, res) => {
  if (!verifyAdminToken(req.headers.authorization)) {
    return res.status(401).json({ error: '상담 내역 조회는 관리자 권한이 필요합니다.', code: 'UNAUTHORIZED' });
  }
  const inquiries = readStoredInquiries();
  return res.status(200).json({ success: true, inquiries });
});

app.post('/api/inquiries', (req, res) => {
  try {
    const { name, phone, message } = req.body || {};
    if (!name || !phone) {
      return res.status(400).json({ error: '성함과 연락처를 입력해주세요.' });
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: String(name).trim(),
      phone: String(phone).trim(),
      message: String(message || '견적 및 방문 실측 상담 요청').trim(),
      date: dateStr,
      read: false,
    };

    const existing = readStoredInquiries();
    const updated = [newInquiry, ...existing];
    saveStoredInquiries(updated);

    return res.status(201).json({ success: true, inquiry: { id: newInquiry.id, date: newInquiry.date } });
  } catch (e) {
    return res.status(500).json({ error: '상담 접수 처리 중 오류 발생' });
  }
});

app.delete('/api/inquiries', (req, res) => {
  if (!verifyAdminToken(req.headers.authorization)) {
    return res.status(401).json({ error: '관리자 권한이 필요합니다.', code: 'UNAUTHORIZED' });
  }
  const id = req.query.id as string || req.body?.id;
  if (!id) {
    return res.status(400).json({ error: '삭제할 ID가 없습니다.' });
  }
  const existing = readStoredInquiries();
  const updated = existing.filter((item) => item.id !== id);
  saveStoredInquiries(updated);
  return res.status(200).json({ success: true });
});

// API: Media Upload & Serving
app.post('/api/upload', (req, res) => {
  if (!verifyAdminToken(req.headers.authorization)) {
    return res.status(401).json({ error: '관리자 권한이 필요합니다.', code: 'UNAUTHORIZED' });
  }
  try {
    const dataUrl = req.body?.dataUrl || req.body?.fileData;
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      return res.status(400).json({ error: '올바른 이미지 데이터가 아닙니다.' });
    }

    const matches = dataUrl.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: '이미지 형식을 분석할 수 없습니다.' });
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    const filename = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;

    fs.writeFileSync(path.resolve(MEDIA_DIR, filename), buffer);
    return res.status(200).json({ success: true, url: `/api/media/${filename}` });
  } catch (e) {
    return res.status(500).json({ error: '이미지 업로드 실패' });
  }
});

app.get('/api/media/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.resolve(MEDIA_DIR, filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.status(404).send('Image Not Found');
});

// Error handling middleware for oversized payloads or malformed JSON
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Express server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Mount Vite in development or serve static files in production

// Mount Vite in development or serve static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
