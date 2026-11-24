# Portofolio Faris Pratama Putra — Full-Stack Terpadu (1 Folder)

Frontend React + Tailwind + Admin Panel (Crop 16:9) + Backend Express + TiDB Cloud MySQL + Cloudinary digabung dalam **1 proyek, 1 `package.json`, dan 1 perintah `npm run dev`**.

## Cara Menjalankan (Cukup 3 Langkah)
1. **Salin file `.env` Anda** yang sudah terisi kredensial TiDB Cloud, Cloudinary, dan `ADMIN_PASSWORD_HASH` ke folder utama proyek ini (sejajar dengan `package.json`).
2. Jalankan sekali saja di terminal:
```bash
npm install
```
3. Jalankan aplikasi (Backend + Frontend langsung jalan bersamaan di 1 terminal):
```bash
npm run dev
```
4. Buka di browser Chrome:
   - **Halaman Portofolio Utama:** `http://localhost:5173`
   - **Halaman Admin + Crop Foto 16:9:** `http://localhost:5173/admin`

## Struktur Singkat
- `server/` → Backend Express (API `/api/projects`, `/api/experiences`, `/api/upload`, `/api/auth/login`)
- `src/` → Frontend React (Halaman Portofolio `/` & Admin CMS `/admin`)
- `sql/schema.sql` → Skema tabel database (sudah Anda import di TiDB Cloud)
