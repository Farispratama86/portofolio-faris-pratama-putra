# Portofolio Full-Stack — Faris Pratama Putra









Aplikasi web portofolio pribadi berbasis **Full-Stack JavaScript (React + Vite + Express)** dalam satu repositori terpadu. Dilengkapi halaman **Admin CMS (`/admin`)** terproteksi JWT, **editor crop & zoom foto (16:9 & 4:3)** berbasis HTML5 Canvas dengan kompresi WebP ke Cloudinary, serta fitur **Cetak CV PDF (Format ATS A4)** yang otomatis tersinkronisasi dengan database cloud tanpa batas.

---

## Fitur Utama

- **Portofolio Publik Responsif (`/`)** — Mendukung mode gelap & terang (*Dark/Light Mode*), navigasi *scroll-spy*, filter kategori proyek (`Web & ML`, `IoT`, `Desktop`), modal detail studi kasus, dan formulir kontak cepat via WhatsApp & Email.
- **Admin CMS Terproteksi JWT (`/admin`)** — Kelola data **Proyek**, **Pengalaman Kerja & Magang**, serta **Profil & Tautan Media Sosial** secara langsung dari browser tanpa mengubah kode.
- **Editor Crop & Zoom Foto Terintegrasi** — Memotong gambar sesuai rasio terkunci (**16:9** untuk kartu proyek, **4:3** untuk foto profil), mengonversinya otomatis ke `.webp` sebelum diunggah ke **Cloudinary**, dan menghapus gambar lama secara otomatis saat diganti.
- **Cetak CV PDF Format ATS Dinamis** — Menghasilkan dokumen CV A4 bergaya serif profesional yang selalu mengikuti seluruh pengalaman magang dan daftar proyek terbaru dari database.
- **Arsitektur Satu Repositori (*Unified Full-Stack*)** — Cukup satu kali `npm install`, satu perintah `npm run dev` di lokal, dan satu kali deploy ke **Vercel** (Frontend SPA + Express Serverless API).

---

## Tech Stack

| Lapisan | Teknologi |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons, HTML5 Canvas Cropper |
| **Backend** | Node.js, Express 4, Multer (`memoryStorage`), Helmet, CORS |
| **Database** | TiDB Cloud Starter (MySQL-compatible, koneksi SSL via `mysql2/promise`) |
| **Media Storage** | Cloudinary (optimasi otomatis format WebP & pembersihan aset lama) |
| **Keamanan** | JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), Parameterized SQL Queries |
| **Deployment** | Vercel (Static Build `dist/` + Serverless Function `api/index.js`) |

---

## Struktur Proyek

```text
portofolio-faris-fullstack/
├── api/
│   └── index.js                 # Entry point Vercel Serverless
├── public/
│   └── images/                  # Aset gambar statis (opsional)
├── scripts/
│   └── hash-password.js         # Utilitas generator hash bcrypt password admin
├── server/
│   ├── config/
│   │   ├── db.js                # Connection pool MySQL (SSL)
│   │   └── cloudinary.js        # Konfigurasi & helper upload/hapus Cloudinary
│   ├── middleware/
│   │   └── auth.js              # Middleware verifikasi JWT Admin
│   ├── routes/
│   │   ├── auth.js              # Endpoint login admin
│   │   ├── projects.js          # CRUD proyek + pembersihan gambar lama
│   │   ├── experiences.js       # CRUD pengalaman kerja & magang
│   │   ├── profile.js           # Pengaturan profil, foto & sosial media
│   │   └── upload.js            # Upload & optimasi gambar ke Cloudinary
│   ├── app.js                   # Konfigurasi Express & static serving dist/
│   └── server.js                # Runner server lokal (port 4000)
├── sql/
│   └── schema.sql               # Skema tabel projects & experiences + data awal
├── src/
│   ├── components/              # Navbar, ProjectMockup, ProjectModal, CvModal, ImageCropperModal
│   ├── data/portfolioData.js    # Data profil default & fallback offline
│   ├── pages/
│   │   ├── PortfolioHome.jsx    # Halaman utama (/)
│   │   └── AdminPanel.jsx       # Halaman CMS (/admin)
│   ├── services/api.js          # HTTP client terpusat ke /api/*
│   ├── App.jsx                  # Pengatur rute '/' dan '/admin'
│   └── index.css                # Styling tema & aturan cetak A4 (@media print)
├── .env.example                 # Template variabel lingkungan
├── package.json                 # Skrip unified dev, build, dan start
├── vercel.json                  # Konfigurasi build & rewrite Vercel
└── vite.config.js               # Konfigurasi Vite & proxy /api -> localhost:4000
```

---

## Daftar Endpoint REST API

| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Publik | Memeriksa status kesehatan server |
| `POST` | `/api/auth/login` | Publik | Login admin dan mendapatkan token JWT |
| `GET` | `/api/profile` | Publik | Mengambil foto profil, bio, dan tautan media sosial |
| `PUT` | `/api/profile` | Admin (JWT) | Memperbarui foto profil, bio, dan tautan media sosial |
| `GET` | `/api/projects` | Publik | Mengambil daftar proyek (opsional `?category=web-ml`) |
| `POST` | `/api/projects` | Admin (JWT) | Menambahkan proyek baru |
| `PUT` | `/api/projects/:id` | Admin (JWT) | Memperbarui proyek atau mengganti foto proyek |
| `DELETE` | `/api/projects/:id` | Admin (JWT) | Menghapus proyek beserta fotonya di Cloudinary |
| `GET` | `/api/experiences` | Publik | Mengambil daftar pengalaman kerja & magang |
| `POST` | `/api/experiences` | Admin (JWT) | Menambahkan pengalaman atau program magang baru |
| `PUT` | `/api/experiences/:id` | Admin (JWT) | Memperbarui data pengalaman |
| `DELETE` | `/api/experiences/:id` | Admin (JWT) | Menghapus data pengalaman |
| `POST` | `/api/upload?type=project\|profile` | Admin (JWT) | Mengunggah gambar hasil crop (`multipart/form-data`) ke Cloudinary |

---

## Menjalankan Secara Lokal

### Prasyarat
- **Node.js** v18 atau lebih baru
- Database MySQL cloud (seperti **TiDB Cloud Starter**) atau MySQL lokal
- Akun **Cloudinary** untuk penyimpanan foto

### Langkah Instalasi

1. **Clone repositori dan masuk ke folder proyek**
   ```bash
   git clone https://github.com/Farispratama86/portofolio-faris.git
   cd portofolio-faris
   ```

2. **Install seluruh dependensi (frontend & backend)**
   ```bash
   npm install
   ```

3. **Konfigurasi environment variables**
   Salin `.env.example` menjadi `.env`, lalu lengkapi kredensial database MySQL, Cloudinary, `JWT_SECRET`, dan `ADMIN_EMAIL`.

4. **Buat hash password admin**
   ```bash
   npm run hash-password -- "PasswordAdminAnda"
   ```
   Salin hasil hash `$2a$10$...` ke variabel `ADMIN_PASSWORD_HASH` di `.env`.

5. **Import skema database**
   Jalankan isi file `sql/schema.sql` pada database MySQL Anda untuk membuat tabel `projects` dan `experiences` (tabel `profile_settings` akan dibuat otomatis saat endpoint `/api/profile` pertama kali diakses).

6. **Jalankan server pengembangan (API + Frontend sekaligus)**
   ```bash
   npm run dev
   ```
   - **Portofolio Publik:** `http://localhost:5173`
   - **Admin CMS:** `http://localhost:5173/admin`

---

## Deployment ke Vercel

1. Push repositori ini ke GitHub (pastikan `.env` tidak ikut ter-commit).
2. Di dashboard **Vercel**, pilih **Add New → Project** lalu import repositori ini.
3. Masukkan seluruh variabel dari `.env` lokal ke menu **Settings → Environment Variables** di Vercel.
4. Klik **Deploy** — `vercel.json` akan otomatis membangun frontend (`dist/`) dan menjalankan Express API di `/api/*`.

---

## Author

**Faris Pratama Putra**  
Mahasiswa S1 Teknik Informatika — Universitas Duta Bangsa Surakarta  

- **GitHub:** [github.com/Farispratama86](https://github.com/Farispratama86)
- **Instagram:** [@fpratamaputra](https://instagram.com/fpratamaputra)
- **Email:** farispakez1209@gmail.com
- **Proyek Terkait:** [FIKOM Preloved](https://fikom-preloved.vercel.app)
