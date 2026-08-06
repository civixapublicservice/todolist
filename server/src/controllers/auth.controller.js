import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'
import { sendError } from '../utils/errors.js'
import { logActivity } from '../utils/activity.js'

const getJwtSecret = () => process.env.JWT_SECRET || 'super-secret-jwt-key-production-quality-todo-app-2026'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return sendError(res, 409, 'An account with this email address already exists', 'email')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '24h' }
    )

    await logActivity(user.id, 'USER_REGISTERED', `User account created: ${user.name}`)

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user,
    })
  } catch (error) {
    console.error('Registration Error:', error)
    return sendError(res, 500, 'Server error during registration. Please try again.')
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return sendError(res, 401, 'Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '24h' }
    )

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    await logActivity(user.id, 'USER_LOGGED_IN', `User signed in successfully`)

    return res.json({
      message: 'Login successful',
      token,
      user: userProfile,
    })
  } catch (error) {
    console.error('Login Error:', error)
    return sendError(res, 500, 'Server error during login. Please try again.')
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return sendError(res, 404, 'User account not found')
    }

    return res.json({ user })
  } catch (error) {
    console.error('GetCurrentUser Error:', error)
    return sendError(res, 500, 'Failed to fetch user session')
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })
    return res.json({ users })
  } catch (error) {
    console.error('GetAllUsers Error:', error)
    return sendError(res, 500, 'Failed to fetch users')
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return sendError(res, 404, 'User with this email not found')
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    await logActivity(user.id, 'PASSWORD_RESET_REQUESTED', `Password reset requested`)

    return res.json({
      message: 'Reset link generated successfully',
      resetLink: `http://localhost:5173/reset-password/${resetToken}`
    })
  } catch (error) {
    console.error('ForgotPassword Error:', error)
    return sendError(res, 500, 'Failed to generate reset link')
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return sendError(res, 400, 'Invalid or expired reset token')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    })

    await logActivity(user.id, 'PASSWORD_RESET', `Password successfully reset`)

    return res.json({
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('ResetPassword Error:', error)
    return sendError(res, 500, 'Failed to reset password')
  }
}
