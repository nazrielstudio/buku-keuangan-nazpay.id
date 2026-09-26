# NAZPAY — Bukti Buku Keuangan (Vercel)

Versi ini khusus Vercel. Tidak memakai PHP dan tidak memakai Supabase.

## Deploy
1. Upload/import folder ini ke GitHub atau Vercel.
2. Hubungkan Vercel Blob Store ke project agar `BLOB_READ_WRITE_TOKEN` tersedia.
3. Environment Variables:
   - `ADMIN_PIN` = `nazpayid123`
   - `SESSION_SECRET` = random secret minimal 32 karakter
4. Deploy.

## Catatan
Data persisten disimpan sebagai JSON di Vercel Blob untuk versi sederhana. Untuk volume transaksi besar/produksi skala tinggi, pindahkan data ke database managed (mis. Vercel Postgres/Neon) tanpa mengubah UI.
