import { Router } from 'express'
import { testSmtpConnection } from '../controllers/mail.controller.js'

const router = Router()

// Endpoint to test SMTP configuration and send a test email
router.post('/test', testSmtpConnection)

export default router
