import { sendError } from '../utils/errors.js'

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return sendError(res, 400, 'Full name is required', 'name')
  }

  if (name.trim().length < 2) {
    return sendError(res, 400, 'Name must be at least 2 characters', 'name')
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 400, 'Email address is required', 'email')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return sendError(res, 400, 'Please enter a valid email address', 'email')
  }

  if (!password || typeof password !== 'string') {
    return sendError(res, 400, 'Password is required', 'password')
  }

  if (password.length < 6) {
    return sendError(res, 400, 'Password must be at least 6 characters long', 'password')
  }

  next()
}

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!email || typeof email !== 'string' || !email.trim()) {
    return sendError(res, 400, 'Email address is required', 'email')
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return sendError(res, 400, 'Password is required', 'password')
  }

  next()
}

export const validateTodo = (req, res, next) => {
  const { title } = req.body

  if (!title || typeof title !== 'string' || !title.trim()) {
    return sendError(res, 400, 'Todo title is required', 'title')
  }

  if (title.trim().length < 2) {
    return sendError(res, 400, 'Todo title must be at least 2 characters', 'title')
  }

  next()
}
