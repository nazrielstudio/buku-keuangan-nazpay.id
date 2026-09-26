import { json, cookie } from '../lib/server.js';

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
  return json({ ok: true }, 200, { 'set-cookie': cookie('nazpay_session', '', 0) });
}
