import { Router } from 'express';
import pool from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

const router = Router();

let tableReady = false;
async function ensureProfileTable() {
  if (tableReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profile_settings (
      id INT PRIMARY KEY DEFAULT 1,
      photo_url VARCHAR(500) DEFAULT '',
      photo_public_id VARCHAR(255) DEFAULT '',
      role VARCHAR(255) DEFAULT '',
      bio TEXT,
      github_url VARCHAR(500) DEFAULT '',
      linkedin_url VARCHAR(500) DEFAULT '',
      instagram_url VARCHAR(500) DEFAULT '',
      tiktok_url VARCHAR(500) DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  try {
    await pool.query(`ALTER TABLE profile_settings ADD COLUMN github_url VARCHAR(500) DEFAULT ''`);
  } catch {
    // column already exists
  }
  await pool.query(`INSERT IGNORE INTO profile_settings (id) VALUES (1)`);
  tableReady = true;
}

function normalizeProfile(row) {
  if (!row) {
    return {
      photoUrl: '',
      photoPublicId: '',
      role: '',
      bio: '',
      githubUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      tiktokUrl: '',
    };
  }
  return {
    photoUrl: row.photo_url || '',
    photoPublicId: row.photo_public_id || '',
    role: row.role || '',
    bio: row.bio || '',
    githubUrl: row.github_url || '',
    linkedinUrl: row.linkedin_url || '',
    instagramUrl: row.instagram_url || '',
    tiktokUrl: row.tiktok_url || '',
  };
}

router.get('/', async (_req, res) => {
  try {
    await ensureProfileTable();
    const [rows] = await pool.query('SELECT * FROM profile_settings WHERE id = 1');
    return res.json({ data: normalizeProfile(rows[0]) });
  } catch (err) {
    console.error('GET /profile error:', err);
    return res.status(500).json({ error: 'Gagal mengambil data profil.' });
  }
});

router.put('/', requireAdmin, async (req, res) => {
  try {
    await ensureProfileTable();
    const [existing] = await pool.query('SELECT * FROM profile_settings WHERE id = 1');
    const prev = existing[0] || {};
    const body = req.body || {};

    const nextPhotoUrl = body.photoUrl !== undefined ? body.photoUrl : (prev.photo_url || '');
    const nextPhotoPublicId = body.photoPublicId !== undefined ? body.photoPublicId : (prev.photo_public_id || '');

    await pool.query(
      `UPDATE profile_settings SET
        photo_url = ?, photo_public_id = ?, role = ?, bio = ?,
        github_url = ?, linkedin_url = ?, instagram_url = ?, tiktok_url = ?
       WHERE id = 1`,
      [
        nextPhotoUrl,
        nextPhotoPublicId,
        body.role !== undefined ? body.role : (prev.role || ''),
        body.bio !== undefined ? body.bio : (prev.bio || ''),
        body.githubUrl !== undefined ? body.githubUrl : (prev.github_url || ''),
        body.linkedinUrl !== undefined ? body.linkedinUrl : (prev.linkedin_url || ''),
        body.instagramUrl !== undefined ? body.instagramUrl : (prev.instagram_url || ''),
        body.tiktokUrl !== undefined ? body.tiktokUrl : (prev.tiktok_url || ''),
      ]
    );

    if (prev.photo_public_id && nextPhotoPublicId && prev.photo_public_id !== nextPhotoPublicId) {
      await deleteFromCloudinary(prev.photo_public_id).catch(() => {});
    }

    const [rows] = await pool.query('SELECT * FROM profile_settings WHERE id = 1');
    return res.json({ data: normalizeProfile(rows[0]) });
  } catch (err) {
    console.error('PUT /profile error:', err);
    return res.status(500).json({ error: 'Gagal memperbarui profil.' });
  }
});

export default router;
