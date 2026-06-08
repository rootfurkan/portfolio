import express from 'express';
import { getAll, create, update, remove } from '../controllers/certificateController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

export default router;