import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { getStore } from '@netlify/blobs';

export const STORE_NAME = 'airconsin-data';

export const DATA_DIR = path.resolve(process.cwd(), 'data');
export const DATA_FILE = path.resolve(DATA_DIR, 'site-data.json');
export const INQUIRIES_FILE = path.resolve(DATA_DIR, 'inquiries.json');

// Ensure data directory exists in environments with writable disk
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem in some serverless environments is normal
}

// ---------------- Admin Security & Auth ----------------

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || '8849';
}

export function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'airconsin-secure-session-salt-2025';
}

export function createAdminToken(): string {
  const secret = getSessionSecret();
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days validity
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(authHeader: string | null | undefined): boolean {
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
    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr);
    if (payload.role !== 'admin') return false;
    if (typeof payload.exp === 'number' && Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

// ---------------- Netlify Blobs Access ----------------

export function getBlobStore() {
  try {
    const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.SITE_ID;
    const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    if (siteID && token) {
      return getStore({ name: STORE_NAME, siteID, token });
    }
    return getStore(STORE_NAME);
  } catch (err) {
    // Local dev or non-Netlify environment
    return null;
  }
}

// Fallback initial data if file doesn't exist
function getLocalSeedData(): Record<string, any> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      if (raw && raw.trim().length > 0) {
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.warn('Failed to read local seed data:', err);
  }
  return {};
}

// Sanitize public site data: strips admin password and private inquiries
export function sanitizeSiteData(data: Record<string, any>): Record<string, any> {
  const clone = { ...data };
  if (clone.settings) {
    clone.settings = { ...clone.settings };
    delete clone.settings.adminPassword;
  }
  delete clone.inquiries;
  return clone;
}

// ---------------- Site Data Store (Persistent) ----------------

export async function getStoredSiteData(): Promise<Record<string, any>> {
  const store = getBlobStore();
  if (store) {
    try {
      const blob = await store.get('site-data', { type: 'json' });
      if (blob && typeof blob === 'object' && Object.keys(blob).length > 0) {
        return blob as Record<string, any>;
      }
    } catch (err) {
      console.warn('Netlify Blobs get(site-data) note:', err);
    }
  }

  // Not in Blobs yet or Blobs unavailable: load seed from data/site-data.json
  const seed = getLocalSeedData();
  if (store && Object.keys(seed).length > 0) {
    // Initialize Netlify Blobs with initial data so future deploys retain updates!
    try {
      await store.setJSON('site-data', seed);
    } catch (err) {
      console.warn('Netlify Blobs seeding note:', err);
    }
  }
  return seed;
}

export async function saveStoredSiteData(data: Record<string, any>): Promise<void> {
  const store = getBlobStore();
  if (store) {
    try {
      await store.setJSON('site-data', data);
    } catch (err) {
      console.error('Netlify Blobs setJSON error:', err);
      throw err;
    }
  }

  // Also write to local disk if filesystem is writable
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch {
    // Read-only filesystem in serverless production is expected
  }
}

export async function resetStoredSiteData(): Promise<void> {
  const store = getBlobStore();
  if (store) {
    try {
      await store.delete('site-data');
    } catch (err) {
      console.warn('Netlify Blobs reset note:', err);
    }
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
  } catch {}
}

// ---------------- Inquiries Store (Private) ----------------

export async function getStoredInquiries(): Promise<any[]> {
  const store = getBlobStore();
  if (store) {
    try {
      const blob = await store.get('inquiries', { type: 'json' });
      if (Array.isArray(blob)) {
        return blob;
      }
    } catch (err) {
      console.warn('Netlify Blobs get(inquiries) note:', err);
    }
  }

  // Local filesystem fallback
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const raw = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      if (raw && raw.trim().length > 0) {
        return JSON.parse(raw);
      }
    }
  } catch {}

  // Fallback seed from data/site-data.json inquiries if any
  const seed = getLocalSeedData();
  if (Array.isArray(seed.inquiries)) {
    return seed.inquiries;
  }
  return [];
}

export async function saveStoredInquiries(inquiries: any[]): Promise<void> {
  const store = getBlobStore();
  if (store) {
    try {
      await store.setJSON('inquiries', inquiries);
    } catch (err) {
      console.error('Netlify Blobs setJSON(inquiries) error:', err);
      throw err;
    }
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch {}
}

// ---------------- HTTP Response Helpers ----------------

export function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
