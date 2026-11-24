import { Router } from 'express';
import pool from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

const router = Router();

function normalizeProject(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    categoryLabel: row.category_label,
    year: row.year,
    summary: row.summary,
    highlights: typeof row.highlights === 'string' ? JSON.parse(row.highlights) : row.highlights,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    imageUrl: row.image_url || '',
    imagePublicId: row.image_public_id || '',
    liveUrl: row.live_url || '',
    repoUrl: row.repo_url || '',
    featured: Boolean(row.is_featured),
    sortOrder: row.sort_order,
  };
}

// Publik: ambil semua proyek
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const sql = category && ['web-ml', 'iot', 'desktop'].includes(category)
      ? 'SELECT * FROM projects WHERE category = ? ORDER BY is_featured DESC, sort_order ASC, id DESC'
      : 'SELECT * FROM projects ORDER BY is_featured DESC, sort_order ASC, id DESC';
    const params = category && ['web-ml', 'iot', 'desktop'].includes(category) ? [category] : [];
    const [rows] = await pool.query(sql, params);
    return res.json({ data: rows.map(normalizeProject) });
  } catch (err) {
    console.error('GET /projects error:', err);
    return res.status(500).json({ error: 'Gagal mengambil daftar proyek.' });
  }
});

// Admin: tambah proyek baru
router.post('/', requireAdmin, async (req, res) => {
  try {
    const {
      slug, title, category = 'web-ml', categoryLabel = 'Web UI/UX',
      year = String(new Date().getFullYear()), summary,
      highlights = [], tags = [], imageUrl = '', imagePublicId = '',
      liveUrl = '', repoUrl = '', featured = false, sortOrder = 0,
    } = req.body || {};

    if (!title || !summary) {
      return res.status(400).json({ error: 'title dan summary wajib diisi.' });
    }

    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const [result] = await pool.query(
      `INSERT INTO projects
       (slug, title, category, category_label, year, summary, highlights, tags, image_url, image_public_id, live_url, repo_url, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalSlug, title, category, categoryLabel, year, summary,
        JSON.stringify(highlights), JSON.stringify(tags),
        imageUrl, imagePublicId, liveUrl, repoUrl, featured ? 1 : 0, sortOrder,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    return res.status(201).json({ data: normalizeProject(rows[0]) });
  } catch (err) {
    console.error('POST /projects error:', err);
    return res.status(500).json({ error: 'Gagal menambahkan proyek.' });
  }
});

// Admin: perbarui proyek
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
    }

    const prev = existing[0];
    const body = req.body || {};
    const nextImagePublicId = body.imagePublicId ?? prev.image_public_id;

    await pool.query(
      `UPDATE projects SET
        title = ?, category = ?, category_label = ?, year = ?, summary = ?,
        highlights = ?, tags = ?, image_url = ?, image_public_id = ?,
        live_url = ?, repo_url = ?, is_featured = ?, sort_order = ?
       WHERE id = ?`,
      [
        body.title ?? prev.title,
        body.category ?? prev.category,
        body.categoryLabel ?? prev.category_label,
        body.year ?? prev.year,
        body.summary ?? prev.summary,
        JSON.stringify(body.highlights ?? (typeof prev.highlights === 'string' ? JSON.parse(prev.highlights) : prev.highlights)),
        JSON.stringify(body.tags ?? (typeof prev.tags === 'string' ? JSON.parse(prev.tags) : prev.tags)),
        body.imageUrl ?? prev.image_url,
        nextImagePublicId,
        body.liveUrl ?? prev.live_url,
        body.repoUrl ?? prev.repo_url,
        body.featured !== undefined ? (body.featured ? 1 : 0) : prev.is_featured,
        body.sortOrder ?? prev.sort_order,
        id,
      ]
    );

    // Bersihkan gambar lama di Cloudinary jika diganti dengan gambar baru
    if (prev.image_public_id && nextImagePublicId && prev.image_public_id !== nextImagePublicId) {
      await deleteFromCloudinary(prev.image_public_id).catch(() => {});
    }

    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    return res.json({ data: normalizeProject(rows[0]) });
  } catch (err) {
    console.error('PUT /projects/:id error:', err);
    return res.status(500).json({ error: 'Gagal memperbarui proyek.' });
  }
});

// Admin: hapus proyek beserta fotonya di Cloudinary
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT image_public_id FROM projects WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
    }

    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    if (existing[0].image_public_id) {
      await deleteFromCloudinary(existing[0].image_public_id).catch(() => {});
    }
    return res.json({ deleted: true, id: Number(id) });
  } catch (err) {
    console.error('DELETE /projects/:id error:', err);
    return res.status(500).json({ error: 'Gagal menghapus proyek.' });
  }
});

export default router;
