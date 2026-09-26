import { PIN, createSession, json, cookie } from '../lib/server.js';

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
  try {
    const body = await req.json();
    if (String(body?.pin ?? '') !== String(PIN)) return json({ ok: false, error: 'PIN salah' }, 401);
    const token = await createSession();
    return json({ ok: true }, 200, { 'set-cookie': cookie('nazpay_session', token, 43200) });
  } catch {
    return json({ ok: false, error: 'Permintaan tidak valid' }, 400);
  }
}
