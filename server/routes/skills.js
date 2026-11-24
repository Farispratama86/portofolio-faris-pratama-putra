import { Router } from 'express';
import pool from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

let tableInitialized = false;
async function ensureSkillsTable() {
  if (tableInitialized) return;
  try {
    await pool.query(`
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
      )
    `);

    // Cek apakah tabel kosong, jika iya seed data awal
    const [countRows] = await pool.query('SELECT COUNT(*) as count FROM skills');
    if (countRows[0]?.count === 0) {
      await pool.query(`
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
        ('Kemandirian Kerja & Inisiatif Solutif', 'soft', 'Manajemen & Kerja Profesional', 92, 28)
      `);
    }
    tableInitialized = true;
  } catch (err) {
    console.warn('ensureSkillsTable warning:', err.message);
  }
}

function normalizeSkill(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category || 'hard',
    groupName: row.group_name || 'Umum',
    ratePoint: Number(row.rate_point) || 85,
    icon: row.icon || '',
    sortOrder: row.sort_order || 0,
  };
}

// Publik: ambil semua keahlian (Hard Skill & Soft Skill)
router.get('/', async (_req, res) => {
  try {
    await ensureSkillsTable();
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY category ASC, sort_order ASC, id ASC');
    return res.json({ data: rows.map(normalizeSkill) });
  } catch (err) {
    console.error('GET /skills error:', err);
    return res.status(500).json({ error: 'Gagal mengambil daftar keahlian.' });
  }
});

// Admin: tambah keahlian baru
router.post('/', requireAdmin, async (req, res) => {
  try {
    await ensureSkillsTable();
    const {
      name,
      category = 'hard',
      groupName = 'Umum',
      ratePoint = 85,
      icon = '',
      sortOrder = 0,
    } = req.body || {};

    if (!name) {
      return res.status(400).json({ error: 'name wajib diisi.' });
    }

    const validCategory = category === 'soft' ? 'soft' : 'hard';
    const rate = Math.min(100, Math.max(1, Number(ratePoint) || 85));

    const [result] = await pool.query(
      `INSERT INTO skills (name, category, group_name, rate_point, icon, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, validCategory, groupName || 'Umum', rate, icon, sortOrder]
    );

    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [result.insertId]);
    return res.status(201).json({ data: normalizeSkill(rows[0]) });
  } catch (err) {
    console.error('POST /skills error:', err);
    return res.status(500).json({ error: 'Gagal menambahkan keahlian.' });
  }
});

// Admin: perbarui keahlian
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await ensureSkillsTable();
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Keahlian tidak ditemukan.' });
    }

    const prev = existing[0];
    const body = req.body || {};
    const validCategory = body.category ? (body.category === 'soft' ? 'soft' : 'hard') : prev.category;
    const rate = body.ratePoint !== undefined ? Math.min(100, Math.max(1, Number(body.ratePoint) || 85)) : prev.rate_point;

    await pool.query(
      `UPDATE skills
       SET name = ?, category = ?, group_name = ?, rate_point = ?, icon = ?, sort_order = ?
       WHERE id = ?`,
      [
        body.name ?? prev.name,
        validCategory,
        body.groupName ?? prev.group_name,
        rate,
        body.icon ?? prev.icon,
        body.sortOrder ?? prev.sort_order,
        id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
    return res.json({ data: normalizeSkill(rows[0]) });
  } catch (err) {
    console.error('PUT /skills/:id error:', err);
    return res.status(500).json({ error: 'Gagal memperbarui keahlian.' });
  }
});

// Admin: hapus keahlian
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await ensureSkillsTable();
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Keahlian tidak ditemukan.' });
    }
    return res.json({ deleted: true, id: Number(id) });
  } catch (err) {
    console.error('DELETE /skills/:id error:', err);
    return res.status(500).json({ error: 'Gagal menghapus keahlian.' });
  }
});

export default router;
