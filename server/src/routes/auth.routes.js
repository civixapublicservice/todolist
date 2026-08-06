import { Router } from 'express'
import { register, login, getCurrentUser, forgotPassword, resetPassword } from '../controllers/auth.controller.js'
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middleware/validate.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.get('/me', authenticateToken, getCurrentUser)

router.post('/forgot-password', validateForgotPassword, forgotPassword)
router.post('/reset-password/:token', validateResetPassword, resetPassword)

export default router
