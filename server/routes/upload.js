import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.js';
import { deleteFromCloudinary, uploadBufferToCloudinary } from '../config/cloudinary.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // Naikkan ke 15 MB untuk mendukung output 2000×1500 WebP HQ
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Format gambar harus JPG, PNG, atau WebP.'));
  },
});

// POST /api/upload?type=project|profile
// Frontend dapat mengirim gambar yang sudah di-crop di browser (react-easy-crop / canvas),
// lalu Cloudinary mengoptimalkan ke WebP & memastikan rasio tetap rapi.
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File gambar (field: image) wajib diunggah.' });
    }

    const type = req.query.type === 'profile' ? 'profile' : req.query.type === 'certificate' ? 'certificate' : 'project';
    const transformation =
      type === 'profile'
        ? [{ width: 2000, height: 1500, crop: 'limit' }, { quality: 'auto:best' }]
        : type === 'certificate'
        ? [{ width: 2000, height: 1500, crop: 'limit' }, { quality: 'auto:best' }]
        : [{ width: 1920, height: 1080, crop: 'limit' }, { quality: 'auto:best' }];

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: `portofolio-faris/${type}`,
      transformation,
    });

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: err.message || 'Gagal mengunggah gambar.' });
  }
});

// DELETE /api/upload — hapus foto lama di Cloudinary saat diganti
router.delete('/', requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.body || {};
    if (!publicId) {
      return res.status(400).json({ error: 'publicId wajib diisi.' });
    }
    await deleteFromCloudinary(publicId);
    return res.json({ deleted: true, publicId });
  } catch (err) {
    console.error('Delete image error:', err);
    return res.status(500).json({ error: 'Gagal menghapus gambar dari Cloudinary.' });
  }
});

export default router;
