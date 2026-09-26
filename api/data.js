import { load, save, isAdmin, json } from '../lib/server.js';

export default async function handler(req) {
  if (!(await isAdmin(req))) return json({ error: 'Unauthorized' }, 401);
  if (req.method === 'GET') return json(await load());
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      if (!body || typeof body !== 'object') return json({ error: 'Data tidak valid' }, 400);
      return json(await save(body));
    } catch {
      return json({ error: 'Gagal menyimpan data' }, 500);
    }
  }
  return json({ error: 'Method Not Allowed' }, 405);
}
