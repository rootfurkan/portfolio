import express from 'express';
import { getProfile, updateProfile, uploadPhoto } from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', authMiddleware, updateProfile);
router.post('/photo', authMiddleware, upload.single('photo'), uploadPhoto);

export default router;