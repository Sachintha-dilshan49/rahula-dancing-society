import { Router } from 'express';
import * as galleryController from '../controllers/gallery.controller';
import { upload } from '../middlewares/upload';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', galleryController.getAll);
router.patch('/:id/views', galleryController.incrementViews);
router.post('/', authenticate, authorize(['TEACHER', 'ADMIN']), upload.single('file'), galleryController.create);
router.delete('/:id', authenticate, authorize(['TEACHER', 'ADMIN']), galleryController.remove);

export default router;
