import { put } from '@vercel/blob';
import { isAdmin, json } from '../lib/server.js';

export default async function handler(req) {
  if (!(await isAdmin(req))) return json({ error: 'Unauthorized' }, 401);
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') return json({ error: 'File tidak ditemukan' }, 400);
    if (file.size > 8 * 1024 * 1024) return json({ error: 'Maksimal 8 MB' }, 400);
    const safe = (file.name || 'proof').replace(/[^a-zA-Z0-9._-]/g, '_');
    const b = await put(`proofs/${Date.now()}-${safe}`, file, { access: 'public' });
    return json({ url: b.url, name: safe });
  } catch {
    return json({ error: 'Gagal mengunggah file' }, 500);
  }
}
