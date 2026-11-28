// =============================================================================
// PUSAT DATA PORTOFOLIO — Ubah profil, tautan media sosial, foto, pengalaman,
// dan proyek cukup dari file ini saja tanpa menyentuh komponen React.
// =============================================================================

export const PROFILE = {
  fullName: 'Faris Pratama Putra',
  shortBrand: 'Faris',
  brandSuffix: '.PP',
  initials: 'FP',
  // Simpan foto asli Anda di public/images/profil.jpg lalu isi '/images/profil.jpg'
  photoUrl: '',
  role: 'Web UI/UX Developer · Machine Learning Enthusiast · IoT & IT Technician',
  availabilityStatus: 'Terbuka untuk Peluang',
  educationSummary: 'S1 Teknik Informatika (UDB)',
  currentRole: 'Web UI/UX & IT Developer',
  coreSkills: 'Web UI/UX · Machine Learning · IoT',
  campusBadge: 'Mahasiswa S1 Teknik Informatika · Universitas Duta Bangsa Surakarta',
  location: 'Karanganyar / Surakarta, Jawa Tengah',
  cityShort: 'Surakarta, Indonesia',
  education: [
    { institution: 'Universitas Duta Bangsa Surakarta (UDB)', detail: 'S1 Teknik Informatika (Semester 6)' },
    { institution: 'SMK Muhammadiyah 1 Gondangrejo', detail: 'Teknik Komputer dan Jaringan (TKJ)' },
  ],
  bio: 'Membangun antarmuka web yang bersih dan responsif, merancang model klasifikasi berbasis data, hingga mengembangkan sistem IoT dan aplikasi desktop. Berpengalaman magang sebagai Web UI/UX Developer di PT Vinix Seven Aurum (VINIX7) sekaligus aktif sebagai teknisi komputer di Speed Computer Surakarta.',
  email: 'farispakez1209@gmail.com',
  whatsappNumber: '6281219534692',
  whatsappDisplay: '+62 812-1953-4692',
  githubUrl: 'https://github.com/Farispratama86',
  githubDisplay: 'github.com/Farispratama86',
  portfolioUrl: 'https://portofolio-faris-pratama-putra.vercel.app/',
  // Isi URL asli LinkedIn / Instagram / TikTok di bawah ini agar otomatis tampil di Kontak & Footer
  socials: [
    { id: 'github', label: 'GitHub', url: 'https://github.com/Farispratama86' },
    { id: 'linkedin', label: 'LinkedIn', url: '' },   // contoh: 'https://linkedin.com/in/username-anda'
    { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/fpratamaputra' },
    { id: 'tiktok', label: 'TikTok', url: '' },       // contoh: 'https://tiktok.com/@username-anda'
  ],
};

export const EXPERIENCES = [
  {
    id: 'vinix7',
    badge: 'Magang · Hybrid',
    role: 'Web UI/UX Developer',
    company: 'PT Vinix Seven Aurum (VINIX7)',
    period: 'Agustus 2026 – November 2026',
    location: 'Sleman, DIY',
    sections: [
      {
        heading: 'Pengembangan Web & UI/UX',
        bullets: [
          'Merancang antarmuka dan membangun aplikasi marketplace kampus FIKOM Preloved hingga rilis produksi (v1.1.0) di Vercel Serverless & Aiven Cloud MySQL.',
          'Menyusun dokumentasi dan menjalankan pengujian UAT pada 4 skenario utama (registrasi SSO, moderasi iklan, filter katalog & COD WhatsApp, responsivitas mobile).',
        ],
      },
      {
        heading: 'Machine Learning & Evaluasi Data',
        bullets: [
          'Mengembangkan pipeline klasifikasi jalur karier berbasis XGBoost (2.975 data, 13 fitur, 5-Fold Stratified CV bebas data leakage) mengikuti kerangka CRISP-DM.',
          'Membangun antarmuka demo prediksi real-time menggunakan Streamlit untuk presentasi hasil evaluasi model.',
        ],
      },
    ],
  },
  {
    id: 'speed-computer',
    badge: 'Aktif · On-site',
    role: 'Computer Technician',
    company: 'Speed Computer',
    period: 'Juni 2023 – Sekarang',
    location: 'Surakarta, Indonesia',
    sections: [
      {
        heading: 'Troubleshooting & Instalasi',
        bullets: [
          'Menangani diagnosis serta perbaikan perangkat keras (hardware) dan perangkat lunak (software) PC maupun laptop.',
          'Melakukan instalasi sistem operasi Windows/Linux, konfigurasi jaringan LAN/WLAN, serta perakitan dan upgrade komponen.',
        ],
      },
      {
        heading: 'Marketing & Customer Service',
        bullets: [
          'Mengelola pencatatan inventaris stok sparepart dan perangkat komputer secara berkala.',
          'Menjalankan pemasaran digital melalui Facebook Marketplace serta melayani konsultasi pelanggan via WhatsApp Business.',
        ],
      },
    ],
  },
];

export const PROJECTS = [
  {
    id: 'fikom-preloved',
    title: 'FIKOM Preloved — Pasar Preloved Mahasiswa Kampus',
    category: 'web-ml',
    categoryLabel: 'Web UI/UX · Production',
    featured: true,
    year: '2026',
    imageUrl: '', // Simpan di public/images/fikom-preloved.png lalu isi '/images/fikom-preloved.png'
    summary:
      'Aplikasi web marketplace barang preloved khusus mahasiswa kampus yang dibangun saat magang di PT Vinix Seven Aurum, lengkap dengan deployment produksi v1.1.0 dan pengujian UAT terstruktur.',
    highlights: [
      'Berjalan live di produksi pada Vercel Serverless dan database Aiven Cloud MySQL (v1.1.0).',
      'Mencakup registrasi & SSO mahasiswa, unggah iklan dengan moderasi admin, katalog multi-filter, dan transaksi COD via WhatsApp.',
      'Diuji melalui 4 skenario UAT (TC-REG-01 s.d. TC-MOB-04) dengan metrik Task Success Rate, Time-on-Task, dan SEQ.',
    ],
    tags: ['Web UI/UX', 'Vercel Serverless', 'Aiven Cloud MySQL', 'UAT Testing'],
    liveUrl: 'https://fikom-preloved.vercel.app',
    repoUrl: 'https://github.com/Farispratama86',
    svgType: 'fikom',
  },
  {
    id: 'vinix7-xgboost',
    title: 'Klasifikasi Jalur Karier Berbasis XGBoost & Streamlit',
    category: 'web-ml',
    categoryLabel: 'Machine Learning',
    featured: false,
    year: '2026',
    imageUrl: '',
    summary:
      'Sistem klasifikasi multi-kelas untuk memprediksi kecenderungan jalur karier (expand, stay, switch, unsure) pada 2.975 data menggunakan XGBoost dan antarmuka demo interaktif Streamlit.',
    highlights: [
      'Menerapkan kerangka CRISP-DM dengan pemisahan train-test terstratifikasi (80:20) dan 5-Fold CV bebas kebocoran data.',
      'Penanganan ketidakseimbangan kelas (Balanced Class Weight) meningkatkan Test F1-Macro dari baseline 18,68% menjadi 31,73%.',
      'Dilengkapi aplikasi web demo inferensi real-time berbasis Streamlit (app_demo.py).',
    ],
    tags: ['Python', 'XGBoost', 'scikit-learn', 'Streamlit', 'CRISP-DM'],
    liveUrl: '',
    repoUrl: 'https://github.com/Farispratama86',
    svgType: 'xgboost',
  },
  {
    id: 'iot-penyiraman',
    title: 'Sistem Monitoring Penyiraman Tanaman Otomatis Berbasis IoT',
    category: 'iot',
    categoryLabel: 'IoT & Embedded',
    featured: false,
    year: '2025',
    imageUrl: '',
    summary:
      'Prototipe perangkat IoT untuk memantau kelembapan tanah dan mengendalikan penyiraman tanaman secara otomatis maupun jarak jauh melalui Blynk API.',
    highlights: [
      'Menggunakan mikrokontroler ESP8266 dengan modul relay, sensor kelembapan, dan tampilan status LCD.',
      'Terintegrasi dengan Blynk API untuk pemantauan dan kontrol real-time.',
    ],
    tags: ['Arduino / ESP8266', 'C++', 'Blynk API'],
    liveUrl: '',
    repoUrl: 'https://github.com/Farispratama86',
    svgType: 'iot-plant',
  },
  {
    id: 'iot-gas',
    title: 'Sistem Deteksi Dini Kebocoran Gas Berbasis IoT',
    category: 'iot',
    categoryLabel: 'IoT & Embedded',
    featured: false,
    year: '2025',
    imageUrl: '',
    summary:
      'Alat pendeteksi kebocoran gas LPG secara dini berbasis ESP32 dan sensor MQ-2 yang memicu alarm buzzer otomatis ketika kadar gas melewati ambang aman.',
    highlights: [
      'Pembacaan konsentrasi gas secara kontinu menggunakan sensor MQ-2 pada mikrokontroler ESP32.',
      'Dilengkapi alarm peringatan dini berbasis buzzer untuk respons cepat.',
    ],
    tags: ['Arduino / ESP32', 'MQ-2 Sensor', 'Buzzer', 'C++'],
    liveUrl: '',
    repoUrl: 'https://github.com/Farispratama86',
    svgType: 'iot-gas',
  },
  {
    id: 'iot-tinggi-badan',
    title: 'Alat Pengukur Tinggi Badan Otomatis Berbasis IoT',
    category: 'iot',
    categoryLabel: 'IoT & Embedded',
    featured: false,
    year: '2024',
    imageUrl: '',
    summary:
      'Perangkat pengukuran tinggi badan otomatis tanpa kontak memanfaatkan sensor ultrasonik HC-SR04 yang menampilkan hasil pengukuran langsung pada layar LCD.',
    highlights: [
      'Kalkulasi jarak akurat menggunakan sensor ultrasonik HC-SR04 dan Arduino Uno.',
      'Hasil pengukuran ditampilkan instan pada modul LCD Display.',
    ],
    tags: ['Arduino Uno', 'HC-SR04', 'LCD Display', 'C++'],
    liveUrl: '',
    repoUrl: 'https://github.com/Farispratama86',
    svgType: 'iot-height',
  },
  {
    id: 'desktop-inventory',
    title: 'Aplikasi Manajemen Stok Barang (Inventory) Toko Komputer',
    category: 'desktop',
    categoryLabel: 'Desktop App',
    featured: false,
    year: '2024',
    imageUrl: '',
    summary:
      'Aplikasi desktop berbasis Python untuk membantu pencatatan barang masuk/keluar, pemantauan stok sparepart, dan pencarian produk pada toko komputer.',
    highlights: [
      'Antarmuka desktop responsif menggunakan Tkinter / PyQt untuk operasional kasir dan gudang.',
      'Penyimpanan data lokal yang ringan dan cepat menggunakan SQLite.',
    ],
    tags: ['Python', 'Tkinter / PyQt', 'SQLite'],
    liveUrl: '',
    repoUrl: 'https://github.com/Farispratama86',
    svgType: 'desktop-inv',
  },
  {
    id: 'desktop-pos-java',
    title: 'Aplikasi Kasir Toko Desktop (POS) Berbasis Java',
    category: 'desktop',
    categoryLabel: 'Desktop App',
    featured: false,
    year: '2024',
    imageUrl: '',
    summary:
      'Aplikasi Point of Sale (POS) desktop berbasis Java Swing untuk pencatatan transaksi penjualan, perhitungan total otomatis, serta integrasi database MySQL.',
    highlights: [
      'Dibangun menggunakan Java Swing GUI pada NetBeans IDE untuk alur transaksi kasir yang terstruktur.',
      'Terhubung ke database MySQL untuk pencatatan riwayat penjualan dan manajemen produk.',
    ],
    tags: ['Java', 'NetBeans IDE', 'Swing GUI', 'MySQL'],
    liveUrl: '',
    repoUrl: 'https://github.com/Farispratama86',
    svgType: 'desktop-pos',
  },
];

export const DEFAULT_SKILLS = [
  // HARD SKILLS
  { id: 1, name: 'Web UI/UX & Responsive Design', category: 'hard', groupName: 'Web UI/UX & ML', ratePoint: 92, sortOrder: 1 },
  { id: 2, name: 'HTML5 / CSS3 / Tailwind CSS', category: 'hard', groupName: 'Web UI/UX & ML', ratePoint: 94, sortOrder: 2 },
  { id: 3, name: 'Machine Learning (XGBoost & CRISP-DM)', category: 'hard', groupName: 'Web UI/UX & ML', ratePoint: 86, sortOrder: 3 },
  { id: 4, name: 'scikit-learn & Python Data Prep', category: 'hard', groupName: 'Web UI/UX & ML', ratePoint: 88, sortOrder: 4 },
  { id: 5, name: 'Streamlit Web Inferensi Demo', category: 'hard', groupName: 'Web UI/UX & ML', ratePoint: 88, sortOrder: 5 },

  { id: 6, name: 'Python', category: 'hard', groupName: 'Programming Languages', ratePoint: 90, sortOrder: 6 },
  { id: 7, name: 'JavaScript (ES6+ / React)', category: 'hard', groupName: 'Programming Languages', ratePoint: 88, sortOrder: 7 },
  { id: 8, name: 'PHP', category: 'hard', groupName: 'Programming Languages', ratePoint: 82, sortOrder: 8 },
  { id: 9, name: 'Java', category: 'hard', groupName: 'Programming Languages', ratePoint: 80, sortOrder: 9 },
  { id: 10, name: 'C++ / Embedded C', category: 'hard', groupName: 'Programming Languages', ratePoint: 84, sortOrder: 10 },

  { id: 11, name: 'Arduino IDE & ESP8266 / ESP32', category: 'hard', groupName: 'IoT & Embedded', ratePoint: 88, sortOrder: 11 },
  { id: 12, name: 'Blynk Cloud & IoT REST API', category: 'hard', groupName: 'IoT & Embedded', ratePoint: 86, sortOrder: 12 },
  { id: 13, name: 'Sensor Integration (MQ-2, HC-SR04)', category: 'hard', groupName: 'IoT & Embedded', ratePoint: 85, sortOrder: 13 },
  { id: 14, name: 'Microcontroller & Relay Automation', category: 'hard', groupName: 'IoT & Embedded', ratePoint: 87, sortOrder: 14 },

  { id: 15, name: 'MySQL / TiDB & Aiven Cloud DB', category: 'hard', groupName: 'Database, Cloud & IT', ratePoint: 88, sortOrder: 15 },
  { id: 16, name: 'Git & GitHub Version Control', category: 'hard', groupName: 'Database, Cloud & IT', ratePoint: 90, sortOrder: 16 },
  { id: 17, name: 'Troubleshooting HW/SW & Windows/Linux', category: 'hard', groupName: 'Database, Cloud & IT', ratePoint: 95, sortOrder: 17 },
  { id: 18, name: 'Jaringan LAN/WLAN & Mikrotik', category: 'hard', groupName: 'Database, Cloud & IT', ratePoint: 86, sortOrder: 18 },
  { id: 19, name: 'Vercel & Cloud Deployment', category: 'hard', groupName: 'Database, Cloud & IT', ratePoint: 88, sortOrder: 19 },

  // SOFT SKILLS
  { id: 20, name: 'Troubleshooting & Critical Thinking', category: 'soft', groupName: 'Problem Solving & Analisis', ratePoint: 94, sortOrder: 20 },
  { id: 21, name: 'Analisis Masalah & Debugging Terstruktur', category: 'soft', groupName: 'Problem Solving & Analisis', ratePoint: 92, sortOrder: 21 },
  { id: 22, name: 'Riset & Evaluasi Berbasis Data', category: 'soft', groupName: 'Problem Solving & Analisis', ratePoint: 88, sortOrder: 22 },

  { id: 23, name: 'Kerja Sama Tim & Kolaborasi Antar Divisi', category: 'soft', groupName: 'Komunikasi & Tim', ratePoint: 92, sortOrder: 23 },
  { id: 24, name: 'Komunikasi Interpersonal & Presentasi Teknis', category: 'soft', groupName: 'Komunikasi & Tim', ratePoint: 88, sortOrder: 24 },
  { id: 25, name: 'Customer Service & Negosiasi Klien', category: 'soft', groupName: 'Komunikasi & Tim', ratePoint: 86, sortOrder: 25 },

  { id: 26, name: 'Manajemen Waktu & Ketepatan Deadline', category: 'soft', groupName: 'Manajemen & Kerja Profesional', ratePoint: 90, sortOrder: 26 },
  { id: 27, name: 'Adaptabilitas Cepat Terhadap Teknologi Baru', category: 'soft', groupName: 'Manajemen & Kerja Profesional', ratePoint: 95, sortOrder: 27 },
  { id: 28, name: 'Kemandirian Kerja & Inisiatif Solutif', category: 'soft', groupName: 'Manajemen & Kerja Profesional', ratePoint: 92, sortOrder: 28 },
];

export function getSkillRatingLabel(rate) {
  const r = Number(rate) || 0;
  if (r >= 92) return { label: 'Expert / Sangat Mahir', color: 'tone-emerald-text', badgeClass: 'tone-emerald' };
  if (r >= 85) return { label: 'Advanced / Mahir', color: 'text-accent', badgeClass: 'tone-sky' };
  if (r >= 75) return { label: 'Proficient / Mampu', color: 'text-indigo-500', badgeClass: 'tone-indigo' };
  return { label: 'Intermediate / Menengah', color: 'tone-amber-text', badgeClass: 'tone-amber' };
}

export const SKILLS = [
  {
    id: 'web-ml',
    title: 'Web UI/UX & ML',
    icon: 'layout',
    colorClass: 'bg-sky-500/15 text-sky-400',
    items: ['Web UI/UX', 'HTML5 / CSS3', 'XGBoost', 'scikit-learn', 'Streamlit', 'CRISP-DM'],
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    icon: 'code',
    colorClass: 'bg-indigo-500/15 text-indigo-400',
    items: ['Python', 'Java', 'PHP', 'JavaScript', 'C++'],
  },
  {
    id: 'iot',
    title: 'IoT & Embedded',
    icon: 'cpu',
    colorClass: 'bg-emerald-500/15 text-emerald-400',
    items: ['Arduino IDE', 'ESP32 / ESP8266', 'Blynk API', 'Sensor MQ-2 & HC-SR04', 'Microcontroller'],
  },
  {
    id: 'db-it',
    title: 'Database, Cloud & IT',
    icon: 'database',
    colorClass: 'bg-amber-500/15 text-amber-400',
    items: ['MySQL / Aiven', 'SQLite', 'Vercel & Netlify', 'Git / GitHub', 'LAN/WLAN & Mikrotik', 'Troubleshooting HW/SW'],
  },
];

// Opsi status terstruktur untuk Pengalaman & Magang di Admin Panel
export const EXPERIENCE_STATUS_OPTIONS = [
  {
    category: 'aktif',
    groupLabel: '🟢 Masih Aktif Bekerja',
    options: [
      'Aktif · On-site',
      'Aktif · Hybrid',
      'Aktif · Remote',
      'Aktif Bekerja',
    ],
  },
  {
    category: 'resign',
    groupLabel: '⚪ Resign (Nonaktif)',
    options: [
      'Resign (Nonaktif)',
      'Resign',
      'Nonaktif',
      'Selesai Kontrak',
    ],
  },
  {
    category: 'magang',
    groupLabel: '🔵 Magang / Bootcamp',
    options: [
      'Magang · Hybrid',
      'Magang · On-site',
      'Magang · Remote',
      'Magang',
      'Bootcamp',
      'Bootcamp Fullstack',
    ],
  },
  {
    category: 'pelatihan',
    groupLabel: '🟣 Pelatihan Skill',
    options: [
      'Pelatihan Skill',
      'Pelatihan · Online',
      'Pelatihan · On-site',
      'Sertifikasi Profesi',
      'Workshop & Kursus',
    ],
  },
];

// Helper visual badge warna berdasarkan kata kunci status
export function getBadgeStyle(badge = '') {
  const b = (badge || '').toLowerCase();
  if (b.includes('aktif') || b.includes('active')) {
    return {
      type: 'aktif',
      label: 'Aktif Bekerja',
      chipClass: 'tone-emerald border',
      dotClass: 'bg-emerald-500',
    };
  }
  if (b.includes('resign') || b.includes('nonaktif') || b.includes('alumni') || b.includes('selesai')) {
    return {
      type: 'resign',
      label: 'Resign / Nonaktif',
      chipClass: 'tone-slate border',
      dotClass: 'bg-slate-400',
    };
  }
  if (b.includes('magang') || b.includes('intern') || b.includes('bootcamp')) {
    return {
      type: 'magang',
      label: 'Magang / Bootcamp',
      chipClass: 'tone-sky border',
      dotClass: 'bg-sky-500',
    };
  }
  if (
    b.includes('pelatihan') ||
    b.includes('skill') ||
    b.includes('sertifikasi') ||
    b.includes('course') ||
    b.includes('kursus') ||
    b.includes('training') ||
    b.includes('workshop')
  ) {
    return {
      type: 'pelatihan',
      label: 'Pelatihan Skill',
      chipClass: 'tone-purple border',
      dotClass: 'bg-purple-500',
    };
  }
  return {
    type: 'custom',
    label: 'Kustom',
    chipClass: 'tone-cyan border',
    dotClass: 'bg-cyan-500',
  };
}

// Helper visual badge warna untuk Kategori Sertifikat
export function getCertificateCategoryStyle(category = '') {
  const c = (category || '').toLowerCase();
  if (c.includes('webinar') || c.includes('seminar')) {
    return {
      type: 'seminar-webinar',
      label: category || 'Seminar / Webinar',
      badgeClass: 'tone-cyan border',
      dotClass: 'bg-cyan-500',
    };
  }
  if (c.includes('magang') || c.includes('intern')) {
    return {
      type: 'magang',
      label: category || 'Magang',
      badgeClass: 'tone-amber border',
      dotClass: 'bg-amber-500',
    };
  }
  if (c.includes('pelatihan') || c.includes('skill') || c.includes('bootcamp') || c.includes('kursus') || c.includes('workshop')) {
    return {
      type: 'pelatihan',
      label: category || 'Pelatihan Skill',
      badgeClass: 'tone-purple border',
      dotClass: 'bg-purple-500',
    };
  }
  if (c.includes('profesi') || c.includes('sertifikasi')) {
    return {
      type: 'profesi',
      label: category || 'Sertifikasi Profesi',
      badgeClass: 'tone-emerald border',
      dotClass: 'bg-emerald-500',
    };
  }
  if (c.includes('penghargaan') || c.includes('lomba') || c.includes('award')) {
    return {
      type: 'penghargaan',
      label: category || 'Penghargaan',
      badgeClass: 'tone-rose border',
      dotClass: 'bg-rose-500',
    };
  }
  if (c.includes('teknis') || c.includes('kerja')) {
    return {
      type: 'teknis',
      label: category || 'Kerja / Teknis',
      badgeClass: 'tone-blue border',
      dotClass: 'bg-blue-500',
    };
  }
  return {
    type: 'default',
    label: category || 'Sertifikat',
    badgeClass: 'tone-sky border',
    dotClass: 'bg-sky-500',
  };
}

export const CERTIFICATES = [
  {
    id: 'vinix7-intern',
    title: 'Sertifikat Praktik Kerja Lapangan (Magang) — Web UI/UX Developer',
    issuer: 'PT Vinix Seven Aurum (VINIX7)',
    category: 'Magang',
    issueDate: 'November 2026',
    credentialUrl: '',
    imageUrl: '',
    experienceId: 'vinix7',
    description: 'Sertifikat resmi penyelesaian program magang industri sebagai Web UI/UX Developer. Berkontribusi dalam pengembangan marketplace kampus FIKOM Preloved (v1.1.0) dan perancangan klasifikasi jalur karier berbasis XGBoost.',
  },
  {
    id: 'speed-computer-tech',
    title: 'Sertifikat Pengalaman & Keahlian Teknisi Komputer',
    issuer: 'Speed Computer Surakarta',
    category: 'Kerja / Teknis',
    issueDate: '2024',
    credentialUrl: '',
    imageUrl: '',
    experienceId: 'speed-computer',
    description: 'Keterangan keahlian teknisi komputer: perakitan perangkat PC/laptop, diagnosis kerusakan hardware & software, konfigurasi jaringan LAN/WLAN, dan instalasi sistem operasi.',
  },
];

