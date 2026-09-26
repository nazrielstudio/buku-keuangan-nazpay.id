# NAZPAY — Bukti Buku Keuangan (Vercel)

Versi ini dibuat untuk Vercel tanpa PHP/Supabase.

## Struktur
- `index.html` — frontend
- `api/` — Vercel Functions untuk login, data, logout, dan upload
- `lib/server.js` — helper session dan Blob

## Deploy
1. Import repository ke Vercel.
2. Hubungkan Vercel Blob Store ke project agar `BLOB_READ_WRITE_TOKEN` tersedia.
3. Isi Environment Variables:
   - `ADMIN_PIN` = PIN admin rahasia
   - `SESSION_SECRET` = random secret minimal 32 karakter
   - `BLOB_READ_WRITE_TOKEN` = otomatis dari Vercel Blob
4. Deploy.

Jangan memasukkan secret asli ke GitHub.
