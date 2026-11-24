-- Skema Database MySQL 8 (Aiven Cloud MySQL)
-- Portofolio Faris Pratama Putra

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  category ENUM('web-ml', 'iot', 'desktop') NOT NULL DEFAULT 'web-ml',
  category_label VARCHAR(80) NOT NULL,
  year VARCHAR(10) NOT NULL,
  summary TEXT NOT NULL,
  highlights JSON NOT NULL,
  tags JSON NOT NULL,
  image_url VARCHAR(500) DEFAULT '',
  image_public_id VARCHAR(255) DEFAULT '',
  live_url VARCHAR(500) DEFAULT '',
  repo_url VARCHAR(500) DEFAULT '',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  badge VARCHAR(80) NOT NULL,
  role VARCHAR(150) NOT NULL,
  company VARCHAR(150) NOT NULL,
  period VARCHAR(100) NOT NULL,
  location VARCHAR(120) NOT NULL,
  sections JSON NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  issuer VARCHAR(150) NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Magang',
  issue_date VARCHAR(60) NOT NULL,
  credential_url VARCHAR(500) DEFAULT '',
  image_url VARCHAR(500) DEFAULT '',
  image_public_id VARCHAR(255) DEFAULT '',
  experience_id VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category ENUM('hard', 'soft') NOT NULL DEFAULT 'hard',
  group_name VARCHAR(100) NOT NULL DEFAULT 'Umum',
  rate_point INT NOT NULL DEFAULT 85,
  icon VARCHAR(60) DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Data awal keahlian Hard Skill & Soft Skill dengan Rate Points
INSERT INTO skills (name, category, group_name, rate_point, sort_order) VALUES
('Web UI/UX & Responsive Design', 'hard', 'Web UI/UX & ML', 92, 1),
('HTML5 / CSS3 / Tailwind CSS', 'hard', 'Web UI/UX & ML', 94, 2),
('Machine Learning (XGBoost & CRISP-DM)', 'hard', 'Web UI/UX & ML', 86, 3),
('scikit-learn & Python Data Prep', 'hard', 'Web UI/UX & ML', 88, 4),
('Streamlit Web Inferensi Demo', 'hard', 'Web UI/UX & ML', 88, 5),

('Python', 'hard', 'Programming Languages', 90, 6),
('JavaScript (ES6+ / React)', 'hard', 'Programming Languages', 88, 7),
('PHP', 'hard', 'Programming Languages', 82, 8),
('Java', 'hard', 'Programming Languages', 80, 9),
('C++ / Embedded C', 'hard', 'Programming Languages', 84, 10),

('Arduino IDE & ESP8266 / ESP32', 'hard', 'IoT & Embedded', 88, 11),
('Blynk Cloud & IoT REST API', 'hard', 'IoT & Embedded', 86, 12),
('Sensor Integration (MQ-2, HC-SR04)', 'hard', 'IoT & Embedded', 85, 13),
('Microcontroller & Relay Automation', 'hard', 'IoT & Embedded', 87, 14),

('MySQL / TiDB & Aiven Cloud DB', 'hard', 'Database, Cloud & IT', 88, 15),
('Git & GitHub Version Control', 'hard', 'Database, Cloud & IT', 90, 16),
('Troubleshooting HW/SW & Windows/Linux', 'hard', 'Database, Cloud & IT', 95, 17),
('Jaringan LAN/WLAN & Mikrotik', 'hard', 'Database, Cloud & IT', 86, 18),
('Vercel & Cloud Deployment', 'hard', 'Database, Cloud & IT', 88, 19),

('Troubleshooting & Critical Thinking', 'soft', 'Problem Solving & Analisis', 94, 20),
('Analisis Masalah & Debugging Terstruktur', 'soft', 'Problem Solving & Analisis', 92, 21),
('Riset & Evaluasi Berbasis Data', 'soft', 'Problem Solving & Analisis', 88, 22),

('Kerja Sama Tim & Kolaborasi Antar Divisi', 'soft', 'Komunikasi & Tim', 92, 23),
('Komunikasi Interpersonal & Presentasi Teknis', 'soft', 'Komunikasi & Tim', 88, 24),
('Customer Service & Negosiasi Klien', 'soft', 'Komunikasi & Tim', 86, 25),

('Manajemen Waktu & Ketepatan Deadline', 'soft', 'Manajemen & Kerja Profesional', 90, 26),
('Adaptabilitas Cepat Terhadap Teknologi Baru', 'soft', 'Manajemen & Kerja Profesional', 95, 27),
('Kemandirian Kerja & Inisiatif Solutif', 'soft', 'Manajemen & Kerja Profesional', 92, 28);

-- Data awal sertifikat
INSERT INTO certificates (title, issuer, category, issue_date, credential_url, image_url, experience_id, description, sort_order) VALUES
(
  'Sertifikat Praktik Kerja Lapangan (Magang) — Web UI/UX Developer',
  'PT Vinix Seven Aurum (VINIX7)',
  'Magang',
  'November 2026',
  '',
  '',
  'vinix7',
  'Sertifikat resmi penyelesaian program magang industri sebagai Web UI/UX Developer dalam pengembangan aplikasi web FIKOM Preloved dan pipeline Machine Learning XGBoost.',
  1
);

-- Data awal pengalaman (idempoten: hanya jalankan sekali saat setup awal)
INSERT INTO experiences (badge, role, company, period, location, sections, sort_order) VALUES
(
  'Magang · Hybrid',
  'Web UI/UX Developer',
  'PT Vinix Seven Aurum (VINIX7)',
  'Agustus 2026 – November 2026',
  'Sleman, DIY',
  JSON_ARRAY(
    JSON_OBJECT(
      'heading', 'Pengembangan Web & UI/UX',
      'bullets', JSON_ARRAY(
        'Merancang antarmuka dan membangun aplikasi marketplace kampus FIKOM Preloved hingga rilis produksi (v1.1.0) di Vercel Serverless & Aiven Cloud MySQL.',
        'Menyusun dokumentasi dan menjalankan pengujian UAT pada 4 skenario utama (registrasi SSO, moderasi iklan, filter katalog & COD WhatsApp, responsivitas mobile).'
      )
    ),
    JSON_OBJECT(
      'heading', 'Machine Learning & Evaluasi Data',
      'bullets', JSON_ARRAY(
        'Mengembangkan pipeline klasifikasi jalur karier berbasis XGBoost (2.975 data, 13 fitur, 5-Fold Stratified CV bebas data leakage) mengikuti kerangka CRISP-DM.',
        'Membangun antarmuka demo prediksi real-time menggunakan Streamlit untuk presentasi hasil evaluasi model.'
      )
    )
  ),
  1
),
(
  'Aktif · On-site',
  'Computer Technician',
  'Speed Computer',
  'Juni 2023 – Sekarang',
  'Surakarta, Indonesia',
  JSON_ARRAY(
    JSON_OBJECT(
      'heading', 'Troubleshooting & Instalasi',
      'bullets', JSON_ARRAY(
        'Menangani diagnosis serta perbaikan perangkat keras (hardware) dan perangkat lunak (software) PC maupun laptop.',
        'Melakukan instalasi sistem operasi Windows/Linux, konfigurasi jaringan LAN/WLAN, serta perakitan dan upgrade komponen.'
      )
    ),
    JSON_OBJECT(
      'heading', 'Marketing & Customer Service',
      'bullets', JSON_ARRAY(
        'Mengelola pencatatan inventaris stok sparepart dan perangkat komputer secara berkala.',
        'Menjalankan pemasaran digital melalui Facebook Marketplace serta melayani konsultasi pelanggan via WhatsApp Business.'
      )
    )
  ),
  2
);

-- Data awal proyek utama
INSERT INTO projects (slug, title, category, category_label, year, summary, highlights, tags, live_url, repo_url, is_featured, sort_order) VALUES
(
  'fikom-preloved',
  'FIKOM Preloved — Pasar Preloved Mahasiswa Kampus',
  'web-ml',
  'Web UI/UX · Production',
  '2026',
  'Aplikasi web marketplace barang preloved khusus mahasiswa kampus yang dibangun saat magang di PT Vinix Seven Aurum, lengkap dengan deployment produksi v1.1.0 dan pengujian UAT terstruktur.',
  JSON_ARRAY(
    'Berjalan live di produksi pada Vercel Serverless dan database Aiven Cloud MySQL (v1.1.0).',
    'Mencakup registrasi & SSO mahasiswa, unggah iklan dengan moderasi admin, katalog multi-filter, dan transaksi COD via WhatsApp.',
    'Diuji melalui 4 skenario UAT (TC-REG-01 s.d. TC-MOB-04) dengan metrik Task Success Rate, Time-on-Task, dan SEQ.'
  ),
  JSON_ARRAY('Web UI/UX', 'Vercel Serverless', 'Aiven Cloud MySQL', 'UAT Testing'),
  'https://fikom-preloved.vercel.app',
  'https://github.com/Farispratama86',
  1,
  1
),
(
  'vinix7-xgboost',
  'Klasifikasi Jalur Karier Berbasis XGBoost & Streamlit',
  'web-ml',
  'Machine Learning',
  '2026',
  'Sistem klasifikasi multi-kelas untuk memprediksi kecenderungan jalur karier (expand, stay, switch, unsure) pada 2.975 data menggunakan XGBoost dan antarmuka demo interaktif Streamlit.',
  JSON_ARRAY(
    'Menerapkan kerangka CRISP-DM dengan pemisahan train-test terstratifikasi (80:20) dan 5-Fold CV bebas kebocoran data.',
    'Penanganan ketidakseimbangan kelas meningkatkan Test F1-Macro dari baseline 18,68% menjadi 31,73%.',
    'Dilengkapi aplikasi web demo inferensi real-time berbasis Streamlit (app_demo.py).'
  ),
  JSON_ARRAY('Python', 'XGBoost', 'scikit-learn', 'Streamlit', 'CRISP-DM'),
  '',
  'https://github.com/Farispratama86',
  0,
  2
);
