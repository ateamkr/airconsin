import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function sanitizeSiteData(data: Record<string, any>): Record<string, any> {
  const clone = { ...data };
  if (clone.settings) {
    clone.settings = { ...clone.settings };
    delete clone.settings.adminPassword;
  }
  delete clone.inquiries;
  return clone;
}

function siteDataApiPlugin(): Plugin {
  return {
    name: 'site-data-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = req.url ? new URL(req.url, 'http://localhost') : null;
        const pathname = parsedUrl?.pathname || '';
        const dataDir = path.resolve(__dirname, 'data');
        const dataFile = path.resolve(dataDir, 'site-data.json');
        const inqFile = path.resolve(dataDir, 'inquiries.json');
        const mediaDir = path.resolve(dataDir, 'media');

        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(mediaDir)) {
          fs.mkdirSync(mediaDir, { recursive: true });
        }

        const readSiteData = () => {
          if (fs.existsSync(dataFile)) {
            try {
              const content = fs.readFileSync(dataFile, 'utf-8');
              if (content?.trim()) return JSON.parse(content);
            } catch (e) {}
          }
          return null;
        };

        const readInquiries = (): any[] => {
          if (fs.existsSync(inqFile)) {
            try {
              const content = fs.readFileSync(inqFile, 'utf-8');
              if (content?.trim()) return JSON.parse(content);
            } catch (e) {}
          }
          const site = readSiteData();
          return Array.isArray(site?.inquiries) ? site.inquiries : [];
        };

        const saveInquiries = (list: any[]) => {
          const temp = `${inqFile}.tmp.${Date.now()}`;
          fs.writeFileSync(temp, JSON.stringify(list, null, 2), 'utf-8');
          fs.renameSync(temp, inqFile);
        };

        const getAuthHeader = () => req.headers['authorization'] as string | undefined;

        // 1. Admin login
        if (pathname === '/api/admin/login' && req.method === 'POST') {
          let body = '';
          req.on('data', (c) => (body += c));
          req.on('end', () => {
            try {
              const { password } = JSON.parse(body || '{}');
              if (password?.trim() === getAdminPassword()) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, token: createAdminToken() }));
              }
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.statusCode = 401;
              return res.end(JSON.stringify({ error: '비밀번호가 올바르지 않습니다.', code: 'INVALID_PASSWORD' }));
            } catch {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: '로그인 오류' }));
            }
          });
          return;
        }

        // 2. Admin session
        if (pathname === '/api/admin/session' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          if (verifyAdminToken(getAuthHeader())) {
            res.statusCode = 200;
            return res.end(JSON.stringify({ authenticated: true, role: 'admin' }));
          }
          res.statusCode = 401;
          return res.end(JSON.stringify({ authenticated: false }));
        }

        // 3. Site data
        if (pathname === '/api/site-data') {
          if (req.method === 'GET') {
            const stored = readSiteData();
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 200;
            if (stored) {
              return res.end(JSON.stringify(sanitizeSiteData(stored)));
            }
            return res.end(JSON.stringify({ empty: true }));
          }

          if (req.method === 'POST') {
            if (!verifyAdminToken(getAuthHeader())) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.statusCode = 401;
              return res.end(JSON.stringify({ error: '관리자 인증이 필요합니다.', code: 'UNAUTHORIZED' }));
            }

            let body = '';
            req.on('data', (c) => (body += c));
            req.on('end', () => {
              try {
                const incoming = JSON.parse(body);
                const existing = readSiteData() || {};

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

                if (merged.settings) delete merged.settings.adminPassword;
                delete merged.inquiries;

                const tempFile = `${dataFile}.tmp.${Date.now()}`;
                fs.writeFileSync(tempFile, JSON.stringify(merged, null, 2), 'utf-8');
                fs.renameSync(tempFile, dataFile);

                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 200;
                return res.end(JSON.stringify({ success: true, siteData: sanitizeSiteData(merged), updatedAt: merged.updatedAt }));
              } catch (err) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: '데이터 저장 실패' }));
              }
            });
            return;
          }
        }

        // 4. Site data reset
        if (pathname === '/api/site-data/reset' && req.method === 'POST') {
          if (!verifyAdminToken(getAuthHeader())) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: '관리자 인증이 필요합니다.', code: 'UNAUTHORIZED' }));
          }
          if (fs.existsSync(dataFile)) {
            try {
              fs.unlinkSync(dataFile);
            } catch (e) {}
          }
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }

        // 5. Inquiries
        if (pathname === '/api/inquiries') {
          if (req.method === 'GET') {
            if (!verifyAdminToken(getAuthHeader())) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.statusCode = 401;
              return res.end(JSON.stringify({ error: '관리자 권한 필요' }));
            }
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, inquiries: readInquiries() }));
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (c) => (body += c));
            req.on('end', () => {
              try {
                const { name, phone, message } = JSON.parse(body || '{}');
                if (!name || !phone) {
                  res.statusCode = 400;
                  return res.end(JSON.stringify({ error: '성함과 연락처를 입력해주세요.' }));
                }
                const now = new Date();
                const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                const item = {
                  id: `inq-${Date.now()}`,
                  name: String(name).trim(),
                  phone: String(phone).trim(),
                  message: String(message || '견적 및 방문 실측 상담 요청').trim(),
                  date: dateStr,
                  read: false,
                };
                const existing = readInquiries();
                saveInquiries([item, ...existing]);
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.statusCode = 201;
                return res.end(JSON.stringify({ success: true, inquiry: { id: item.id, date: item.date } }));
              } catch {
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: '접수 실패' }));
              }
            });
            return;
          }

          if (req.method === 'DELETE') {
            if (!verifyAdminToken(getAuthHeader())) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.statusCode = 401;
              return res.end(JSON.stringify({ error: '관리자 권한 필요' }));
            }
            const id = parsedUrl?.searchParams.get('id');
            if (id) {
              const list = readInquiries().filter((i) => i.id !== id);
              saveInquiries(list);
            }
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          }
        }

        // 6. Media upload
        if (pathname === '/api/upload' && req.method === 'POST') {
          if (!verifyAdminToken(getAuthHeader())) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: '관리자 권한 필요' }));
          }
          let body = '';
          req.on('data', (c) => (body += c));
          req.on('end', () => {
            try {
              const { dataUrl } = JSON.parse(body || '{}');
              const matches = dataUrl?.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
              if (!matches) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: '형식 오류' }));
              }
              const contentType = matches[1];
              const buffer = Buffer.from(matches[2], 'base64');
              const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
              const filename = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
              fs.writeFileSync(path.resolve(mediaDir, filename), buffer);
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, url: `/api/media/${filename}` }));
            } catch {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: '업로드 오류' }));
            }
          });
          return;
        }

        // 7. Media serve
        if (pathname.startsWith('/api/media/')) {
          const filename = path.basename(pathname.replace('/api/media/', ''));
          const filePath = path.resolve(mediaDir, filename);
          if (fs.existsSync(filePath)) {
            const ext = path.extname(filename).toLowerCase();
            const ct = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
            res.setHeader('Content-Type', ct);
            res.statusCode = 200;
            return res.end(fs.readFileSync(filePath));
          }
          res.statusCode = 404;
          return res.end('Not Found');
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), siteDataApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
