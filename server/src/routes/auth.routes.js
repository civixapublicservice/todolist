import { Router } from 'express'
import { register, login, getCurrentUser, forgotPassword, verifyOtp, resetPassword, verifyRegistration, resendRegistrationOtp, changeRegistrationEmail } from '../controllers/auth.controller.js'
import { validateRegister, validateLogin, validateForgotPassword, validateVerifyOtp, validateResetPassword } from '../middleware/validate.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', validateRegister, register)
router.post('/verify-registration', verifyRegistration)
router.post('/resend-registration-otp', resendRegistrationOtp)
router.post('/change-registration-email', changeRegistrationEmail)

router.post('/login', validateLogin, login)
router.get('/me', authenticateToken, getCurrentUser)

router.post('/forgot-password', validateForgotPassword, forgotPassword)
router.post('/verify-reset-otp', validateVerifyOtp, verifyOtp)
router.post('/reset-password', validateResetPassword, resetPassword)

export default router
