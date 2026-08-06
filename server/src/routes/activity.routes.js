import { Router } from 'express'
import { getActivities } from '../controllers/activity.controller.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)
router.get('/', getActivities)

export default router
