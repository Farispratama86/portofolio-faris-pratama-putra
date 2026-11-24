import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || '';

    if (email.toLowerCase() !== adminEmail) {
      return res.status(401).json({ error: 'Kredensial tidak valid.' });
    }

    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Kredensial tidak valid.' });
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({ token, admin: { email: adminEmail } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Gagal memproses login.' });
  }
});

export default router;
