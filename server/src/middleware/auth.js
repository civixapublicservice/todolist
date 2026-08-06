import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'
import { sendError } from '../utils/errors.js'

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return sendError(res, 401, 'Authentication token required')
  }

  try {
    const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-production-quality-todo-app-2026'
    const decoded = jwt.verify(token, secret)
    
    // Authorization: Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    })

    if (!user) {
      return sendError(res, 401, 'User account no longer exists or is unauthorized')
    }

    req.user = { userId: user.id, email: user.email, name: user.name }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Session expired. Please log in again.')
    }
    return sendError(res, 401, 'Invalid or expired authentication token')
  }
}
