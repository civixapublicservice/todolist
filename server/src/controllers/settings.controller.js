import bcrypt from 'bcryptjs'
import { prisma } from '../config/db.js'
import { sendError } from '../utils/errors.js'
import { logActivity } from '../utils/activity.js'

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId
    const { name, email } = req.body

    if (!name || !name.trim()) {
      return sendError(res, 400, 'Full name is required', 'name')
    }

    if (!email || !email.trim()) {
      return sendError(res, 400, 'Email address is required', 'email')
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        NOT: { id: userId },
      },
    })

    if (existingUser) {
      return sendError(res, 409, 'Email address is already in use by another account', 'email')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        email: normalizedEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    await logActivity(userId, 'PROFILE_UPDATED', `Updated profile name and email`)

    return res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('UpdateProfile Error:', error)
    return sendError(res, 500, 'Failed to update profile settings')
  }
}

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId
    const { currentPassword, newPassword } = req.body

    if (!currentPassword) {
      return sendError(res, 400, 'Current password is required', 'currentPassword')
    }

    if (!newPassword || newPassword.length < 6) {
      return sendError(res, 400, 'New password must be at least 6 characters long', 'newPassword')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return sendError(res, 404, 'User account not found')
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return sendError(res, 401, 'Current password is incorrect', 'currentPassword')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    await logActivity(userId, 'PASSWORD_CHANGED', `Changed account password`)

    return res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('ChangePassword Error:', error)
    return sendError(res, 500, 'Failed to update password')
  }
}
