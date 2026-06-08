import express from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/projectController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Coklu alan yukleme: 'image' (kapak) + 'images' (slider)
const projectUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]);

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authMiddleware, projectUpload, create);
router.put('/:id', authMiddleware, projectUpload, update);
router.delete('/:id', authMiddleware, remove);

export default router;