import express from 'express'
import { register, login, me, changePassword } from '../controllers/authController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, me)
router.put('/change-password', authMiddleware, changePassword)

export default router