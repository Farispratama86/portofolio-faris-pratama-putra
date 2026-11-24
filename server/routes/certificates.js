import { Router } from 'express';
import pool from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

const router = Router();

let tableInitialized = false;
async function ensureCertificatesTable() {
  if (tableInitialized) return;
  try {
    await pool.query(`
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
      )
    `);
    tableInitialized = true;
  } catch (err) {
    console.warn('ensureCertificatesTable warning:', err.message);
  }
}

function normalizeCertificate(row) {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    category: row.category,
    issueDate: row.issue_date,
    credentialUrl: row.credential_url || '',
    imageUrl: row.image_url || '',
    imagePublicId: row.image_public_id || '',
    experienceId: row.experience_id || '',
    description: row.description || '',
    sortOrder: row.sort_order,
  };
}

// Publik: ambil semua sertifikat
router.get('/', async (_req, res) => {
  try {
    await ensureCertificatesTable();
    const [rows] = await pool.query('SELECT * FROM certificates ORDER BY sort_order ASC, id DESC');
    return res.json({ data: rows.map(normalizeCertificate) });
  } catch (err) {
    console.error('GET /certificates error:', err);
    return res.status(500).json({ error: 'Gagal mengambil daftar sertifikat.' });
  }
});

// Admin: tambah sertifikat baru
router.post('/', requireAdmin, async (req, res) => {
  try {
    await ensureCertificatesTable();
    const {
      title,
      issuer,
      category = 'Magang',
      issueDate = '',
      credentialUrl = '',
      imageUrl = '',
      imagePublicId = '',
      experienceId = null,
      description = '',
      sortOrder = 0,
    } = req.body || {};

    if (!title || !issuer) {
      return res.status(400).json({ error: 'title dan issuer wajib diisi.' });
    }

    const [result] = await pool.query(
      `INSERT INTO certificates
       (title, issuer, category, issue_date, credential_url, image_url, image_public_id, experience_id, description, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        issuer,
        category,
        issueDate,
        credentialUrl,
        imageUrl,
        imagePublicId,
        experienceId || null,
        description,
        sortOrder,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ?', [result.insertId]);
    return res.status(201).json({ data: normalizeCertificate(rows[0]) });
  } catch (err) {
    console.error('POST /certificates error:', err);
    return res.status(500).json({ error: 'Gagal menambahkan sertifikat.' });
  }
});

// Admin: perbarui sertifikat
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await ensureCertificatesTable();
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM certificates WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
    }

    const prev = existing[0];
    const body = req.body || {};

    await pool.query(
      `UPDATE certificates
       SET title = ?, issuer = ?, category = ?, issue_date = ?, credential_url = ?,
           image_url = ?, image_public_id = ?, experience_id = ?, description = ?, sort_order = ?
       WHERE id = ?`,
      [
        body.title ?? prev.title,
        body.issuer ?? prev.issuer,
        body.category ?? prev.category,
        body.issueDate ?? prev.issue_date,
        body.credentialUrl ?? prev.credential_url,
        body.imageUrl ?? prev.image_url,
        body.imagePublicId ?? prev.image_public_id,
        body.experienceId !== undefined ? (body.experienceId || null) : prev.experience_id,
        body.description ?? prev.description,
        body.sortOrder ?? prev.sort_order,
        id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ?', [id]);
    return res.json({ data: normalizeCertificate(rows[0]) });
  } catch (err) {
    console.error('PUT /certificates/:id error:', err);
    return res.status(500).json({ error: 'Gagal memperbarui sertifikat.' });
  }
});

// Admin: hapus sertifikat
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await ensureCertificatesTable();
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM certificates WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
    }

    const row = existing[0];
    if (row.image_public_id) {
      deleteFromCloudinary(row.image_public_id).catch(() => {});
    }

    await pool.query('DELETE FROM certificates WHERE id = ?', [id]);
    return res.json({ deleted: true, id: Number(id) });
  } catch (err) {
    console.error('DELETE /certificates/:id error:', err);
    return res.status(500).json({ error: 'Gagal menghapus sertifikat.' });
  }
});

export default router;
