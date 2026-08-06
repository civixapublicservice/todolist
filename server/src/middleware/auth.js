import jwt from 'jsonwebtoken'
import { sendError } from '../utils/errors.js'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return sendError(res, 401, 'Authentication token required')
  }

  try {
    const secret = process.env.JWT_SECRET || 'super-secret-jwt-key-production-quality-todo-app-2026'
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (err) {
    return sendError(res, 401, 'Invalid or expired authentication token')
  }
}
