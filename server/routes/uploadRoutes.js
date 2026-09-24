import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `leo-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|svg|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp, svg, avif)'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload single or multiple images
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const host = req.get('host');
    const protocol = req.protocol;

    const urls = req.files.map(file => `${protocol}://${host}/uploads/${file.filename}`);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      urls,
      files: req.files.map(f => ({
        filename: f.filename,
        url: `${protocol}://${host}/uploads/${f.filename}`,
        size: f.size,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
