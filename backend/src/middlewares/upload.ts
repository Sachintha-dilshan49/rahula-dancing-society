import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4|mov/i;
  const ok = allowed.test(path.extname(file.originalname)) && allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Only images and video files are allowed'));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });
