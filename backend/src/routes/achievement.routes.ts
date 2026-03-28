import { Router } from 'express';
import * as achievementController from '../controllers/achievement.controller';

const router = Router();

router.get('/', achievementController.getAll);
router.post('/', achievementController.create);
router.put('/:id', achievementController.update);
router.delete('/:id', achievementController.remove);

export default router;
