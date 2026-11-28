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
      availability_status VARCHAR(255) DEFAULT '',
      education VARCHAR(255) DEFAULT '',
      \`current_role\` VARCHAR(255) DEFAULT '',
      core_skills VARCHAR(255) DEFAULT '',
      location VARCHAR(255) DEFAULT '',
      github_url VARCHAR(500) DEFAULT '',
      linkedin_url VARCHAR(500) DEFAULT '',
      instagram_url VARCHAR(500) DEFAULT '',
      tiktok_url VARCHAR(500) DEFAULT '',
      whatsapp VARCHAR(100) DEFAULT '',
      email VARCHAR(255) DEFAULT '',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const requiredColumns = [
    ['availability_status', "VARCHAR(255) DEFAULT ''"],
    ['education', "VARCHAR(255) DEFAULT ''"],
    ['current_role', "VARCHAR(255) DEFAULT ''"],
    ['core_skills', "VARCHAR(255) DEFAULT ''"],
    ['location', "VARCHAR(255) DEFAULT ''"],
    ['github_url', "VARCHAR(500) DEFAULT ''"],
    ['linkedin_url', "VARCHAR(500) DEFAULT ''"],
    ['instagram_url', "VARCHAR(500) DEFAULT ''"],
    ['tiktok_url', "VARCHAR(500) DEFAULT ''"],
    ['whatsapp', "VARCHAR(100) DEFAULT ''"],
    ['email', "VARCHAR(255) DEFAULT ''"],
  ];

  const [existingCols] = await pool.query(`SHOW COLUMNS FROM profile_settings`);
  const existingSet = new Set(existingCols.map((c) => c.Field));

  for (const [colName, colDef] of requiredColumns) {
    if (!existingSet.has(colName)) {
      await pool.query(`ALTER TABLE profile_settings ADD COLUMN \`${colName}\` ${colDef}`);
    }
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
      availabilityStatus: '',
      education: '',
      currentRole: '',
      coreSkills: '',
      location: '',
      githubUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      tiktokUrl: '',
      whatsapp: '',
      email: '',
    };
  }
  return {
    photoUrl: row.photo_url || '',
    photoPublicId: row.photo_public_id || '',
    role: row.role || '',
    bio: row.bio || '',
    availabilityStatus: row.availability_status || '',
    education: row.education || '',
    currentRole: row.current_role || '',
    coreSkills: row.core_skills || '',
    location: row.location || '',
    githubUrl: row.github_url || '',
    linkedinUrl: row.linkedin_url || '',
    instagramUrl: row.instagram_url || '',
    tiktokUrl: row.tiktok_url || '',
    whatsapp: row.whatsapp || '',
    email: row.email || '',
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
        availability_status = ?, education = ?, \`current_role\` = ?, core_skills = ?, location = ?,
        github_url = ?, linkedin_url = ?, instagram_url = ?, tiktok_url = ?,
        whatsapp = ?, email = ?
       WHERE id = 1`,
      [
        nextPhotoUrl,
        nextPhotoPublicId,
        body.role !== undefined ? body.role : (prev.role || ''),
        body.bio !== undefined ? body.bio : (prev.bio || ''),
        body.availabilityStatus !== undefined ? body.availabilityStatus : (prev.availability_status || ''),
        body.education !== undefined ? body.education : (prev.education || ''),
        body.currentRole !== undefined ? body.currentRole : (prev.current_role || ''),
        body.coreSkills !== undefined ? body.coreSkills : (prev.core_skills || ''),
        body.location !== undefined ? body.location : (prev.location || ''),
        body.githubUrl !== undefined ? body.githubUrl : (prev.github_url || ''),
        body.linkedinUrl !== undefined ? body.linkedinUrl : (prev.linkedin_url || ''),
        body.instagramUrl !== undefined ? body.instagramUrl : (prev.instagram_url || ''),
        body.tiktokUrl !== undefined ? body.tiktokUrl : (prev.tiktok_url || ''),
        body.whatsapp !== undefined ? body.whatsapp : (prev.whatsapp || ''),
        body.email !== undefined ? body.email : (prev.email || ''),
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
