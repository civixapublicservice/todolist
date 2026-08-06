import { Router } from 'express'
import { register, login, getCurrentUser } from '../controllers/auth.controller.js'
import { validateRegister, validateLogin } from '../middleware/validate.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/me', authenticateToken, getCurrentUser)

export default router
