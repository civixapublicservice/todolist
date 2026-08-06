import { Router } from 'express'
import { updateProfile, changePassword } from '../controllers/settings.controller.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)
router.put('/profile', updateProfile)
router.put('/password', changePassword)

export default router
