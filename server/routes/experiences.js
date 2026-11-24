import { Router } from 'express';
import pool from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

function normalizeExperience(row) {
  return {
    id: row.id,
    badge: row.badge,
    role: row.role,
    company: row.company,
    period: row.period,
    location: row.location,
    sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
    sortOrder: row.sort_order,
  };
}

// Publik: ambil semua pengalaman kerja & magang
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM experiences ORDER BY sort_order ASC, id DESC');
    return res.json({ data: rows.map(normalizeExperience) });
  } catch (err) {
    console.error('GET /experiences error:', err);
    return res.status(500).json({ error: 'Gagal mengambil daftar pengalaman.' });
  }
});

// Admin: tambah program magang / pengalaman kerja baru
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { badge, role, company, period, location, sections = [], sortOrder = 0 } = req.body || {};
    if (!role || !company || !period) {
      return res.status(400).json({ error: 'role, company, dan period wajib diisi.' });
    }

    const [result] = await pool.query(
      `INSERT INTO experiences (badge, role, company, period, location, sections, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [badge || 'Magang', role, company, period, location || 'Indonesia', JSON.stringify(sections), sortOrder]
    );

    const [rows] = await pool.query('SELECT * FROM experiences WHERE id = ?', [result.insertId]);
    return res.status(201).json({ data: normalizeExperience(rows[0]) });
  } catch (err) {
    console.error('POST /experiences error:', err);
    return res.status(500).json({ error: 'Gagal menambahkan pengalaman.' });
  }
});

// Admin: perbarui pengalaman
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM experiences WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Pengalaman tidak ditemukan.' });
    }

    const prev = existing[0];
    const body = req.body || {};
    await pool.query(
      `UPDATE experiences SET badge = ?, role = ?, company = ?, period = ?, location = ?, sections = ?, sort_order = ?
       WHERE id = ?`,
      [
        body.badge ?? prev.badge,
        body.role ?? prev.role,
        body.company ?? prev.company,
        body.period ?? prev.period,
        body.location ?? prev.location,
        JSON.stringify(body.sections ?? (typeof prev.sections === 'string' ? JSON.parse(prev.sections) : prev.sections)),
        body.sortOrder ?? prev.sort_order,
        id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM experiences WHERE id = ?', [id]);
    return res.json({ data: normalizeExperience(rows[0]) });
  } catch (err) {
    console.error('PUT /experiences/:id error:', err);
    return res.status(500).json({ error: 'Gagal memperbarui pengalaman.' });
  }
});

// Admin: hapus pengalaman
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM experiences WHERE id = ?', [id]);
    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Pengalaman tidak ditemukan.' });
    }
    return res.json({ deleted: true, id: Number(id) });
  } catch (err) {
    console.error('DELETE /experiences/:id error:', err);
    return res.status(500).json({ error: 'Gagal menghapus pengalaman.' });
  }
});

export default router;
