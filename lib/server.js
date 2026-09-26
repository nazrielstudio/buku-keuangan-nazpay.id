import { put, list } from '@vercel/blob';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'change-this-secret-change-this-secret');
export const PIN = process.env.ADMIN_PIN || 'change-this-pin';
export const seed = {
  transactions: [],
  testimonials: [],
  partners: [],
  settings: { brand: 'NAZPAY', contact: 'Kontak resmi NAZPAY' }
};

export async function load() {
  try {
    const r = await list({ prefix: 'data/' });
    const x = r.blobs.find(b => b.pathname === 'data/nazpay-data.json');
    if (!x) return seed;
    const res = await fetch(x.url, { cache: 'no-store' });
    if (!res.ok) return seed;
    return await res.json();
  } catch {
    return seed;
  }
}

export async function save(data) {
  await put('data/nazpay-data.json', JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    allowOverwrite: true
  });
  return data;
}

export async function isAdmin(req) {
  const c = req.headers.get('cookie') || '';
  const m = c.match(/(?:^|;\s*)nazpay_session=([^;]+)/);
  if (!m) return false;
  try {
    await jwtVerify(m[1], secret);
    return true;
  } catch {
    return false;
  }
}

export async function createSession() {
  return await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret);
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers }
  });
}

export function cookie(name, value, maxAge) {
  return `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}
