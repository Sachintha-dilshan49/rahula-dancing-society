import { Router } from 'express';
import * as achievementController from '../controllers/achievement.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', achievementController.getAll);
router.post('/', authenticate, authorize(['TEACHER', 'ADMIN']), achievementController.create);
router.put('/:id', authenticate, authorize(['TEACHER', 'ADMIN']), achievementController.update);
router.delete('/:id', authenticate, authorize(['TEACHER', 'ADMIN']), achievementController.remove);

export default router;
