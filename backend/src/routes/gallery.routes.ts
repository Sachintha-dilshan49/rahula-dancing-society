import { Router } from 'express';
import * as galleryController from '../controllers/gallery.controller';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/', galleryController.getAll);
router.post('/', upload.single('file'), galleryController.create);
router.delete('/:id', galleryController.remove);
router.patch('/:id/views', galleryController.incrementViews);

export default router;
