import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'
import { sendError } from '../utils/errors.js'
import { logActivity } from '../utils/activity.js'
import { mailService } from '../services/mail.service.js'
import { getOtpEmailTemplate } from '../utils/otpTemplate.js'
import { getPasswordChangedTemplate } from '../utils/passwordChangedTemplate.js'
import { getRegistrationOtpTemplate } from '../utils/getRegistrationOtpTemplate.js'
import { getWelcomeEmailTemplate } from '../utils/getWelcomeEmailTemplate.js'

const getJwtSecret = () => process.env.JWT_SECRET || 'super-secret-jwt-key-production-quality-todo-app-2026'


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !name.trim()) return sendError(res, 400, 'Name is required', 'name')
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return sendError(res, 400, 'Valid email address is required', 'email')
    if (!password || password.length < 8) return sendError(res, 400, 'Password must be at least 8 characters long', 'password')

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return sendError(res, 409, 'An account already exists with this email.', 'email')
    }

    // Auto-delete expired pending registrations to keep the DB clean
    await prisma.pendingRegistration.deleteMany({
      where: { otpExpiry: { lt: new Date() } }
    })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const otp = crypto.randomInt(100000, 999999).toString()
    const hashedOtp = await bcrypt.hash(otp, salt)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    await prisma.pendingRegistration.upsert({
      where: { email: normalizedEmail },
      update: {
        name: name.trim(),
        password: hashedPassword,
        otp: hashedOtp,
        otpExpiry,
        otpAttempts: 0,
      },
      create: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpiry,
        otpAttempts: 0,
      }
    })

    const html = getRegistrationOtpTemplate('TaskFlow', name.trim(), otp)
    
    try {
      await mailService.sendMail({
        to: normalizedEmail,
        subject: 'Verify Your Email Address - TaskFlow',
        html
      })
    } catch (mailError) {
      console.error('Failed to send email due to Render Free Tier SMTP block:', mailError.message)
      console.log(`\n\n=== OTP FOR TESTING: ${otp} ===\n\n`)
    }

    return res.status(201).json({
      message: 'OTP sent to email successfully. Please verify to continue.',
      requireVerification: true
    })
  } catch (error) {
    console.error('Registration Error:', error)
    return sendError(res, 500, 'Server error during registration. Please try again.')
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, timezone } = req.body



    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      const pendingRegistration = await prisma.pendingRegistration.findUnique({
        where: { email: normalizedEmail }
      })
      if (pendingRegistration) {
        return sendError(res, 401, 'Please verify your email before logging in.')
      }
      return sendError(res, 401, 'Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password')
    }

    if (timezone) {
      await prisma.settings.upsert({
        where: { userId: user.id },
        update: { timezone },
        create: {
          userId: user.id,
          timezone
        }
      })
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



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return sendError(res, 400, 'Valid email address is required', 'email')
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return sendError(res, 404, 'No account found with this email address.')
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    
    // Hash the OTP before storing
    const salt = await bcrypt.genSalt(10)
    const hashedOtp = await bcrypt.hash(otp, salt)

    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedOtp, // Reusing resetToken field for the hashed OTP
        resetTokenExpiry,
        resetOtpAttempts: 0,
        resetOtpCreatedAt: new Date(),
      },
    })

    await logActivity(user.id, 'PASSWORD_RESET_OTP_REQUESTED', `Password reset OTP requested`)

    // Send email asynchronously (do not block the response, but log errors if it fails)
    const html = getOtpEmailTemplate('TaskFlow', otp)
    
    // Send email synchronously so we can catch errors if the SMTP server is down
    // (In a very high traffic app, this might be offloaded to a queue)
    try {
      await mailService.sendMail({
        to: user.email,
        subject: 'Your Password Reset OTP - TaskFlow',
        html
      })
    } catch (mailError) {
      console.error('Failed to send email:', mailError.message)
      console.log(`\n\n=== OTP FOR TESTING: ${otp} ===\n\n`)
    }

    return res.json({
      message: 'An OTP has been sent to your email address'
    })
  } catch (error) {
    console.error('ForgotPassword Error:', error)
    return sendError(res, 500, 'Failed to process request')
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return sendError(res, 400, 'Email and OTP are required')
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return sendError(res, 400, 'Invalid OTP or expired session')
    }

    if (user.resetOtpAttempts >= 5) {
      return sendError(res, 429, 'Too many failed attempts. Please request a new OTP.')
    }

    if (new Date() > user.resetTokenExpiry) {
      return sendError(res, 400, 'OTP has expired. Please request a new one.')
    }

    const isValid = await bcrypt.compare(otp, user.resetToken)
    
    if (!isValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetOtpAttempts: user.resetOtpAttempts + 1 }
      })
      return sendError(res, 400, 'Invalid OTP')
    }

    // OTP is valid. Issue a temporary password-reset token (valid for 15 mins)
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password-reset' },
      getJwtSecret(),
      { expiresIn: '15m' }
    )

    // Clear OTP immediately so it cannot be reused
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
        resetOtpAttempts: 0,
        resetOtpCreatedAt: null
      }
    })

    return res.json({
      message: 'OTP verified successfully',
      resetToken
    })
  } catch (error) {
    console.error('VerifyOTP Error:', error)
    return sendError(res, 500, 'Failed to verify OTP')
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body

    if (!resetToken || !newPassword) {
      return sendError(res, 400, 'Token and new password are required')
    }

    // Verify JWT
    let decoded
    try {
      decoded = jwt.verify(resetToken, getJwtSecret())
    } catch {
      return sendError(res, 401, 'Invalid or expired reset session. Please verify your OTP again.')
    }

    if (decoded.type !== 'password-reset') {
      return sendError(res, 401, 'Invalid token type')
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return sendError(res, 404, 'User not found')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        resetOtpAttempts: 0,
        resetOtpCreatedAt: null
      }
    })

    await logActivity(user.id, 'PASSWORD_RESET', 'Password successfully changed')

    // Send password changed email
    try {
      const html = getPasswordChangedTemplate('TaskFlow')
      await mailService.sendMail({
        to: user.email,
        subject: 'Your Password was Changed - TaskFlow',
        html
      })
    } catch (emailError) {
      console.error('Failed to send password changed email:', emailError)
      // We don't fail the request if email fails, as the password was already reset
    }

    return res.json({
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('ResetPassword Error:', error)
    return sendError(res, 500, 'Failed to reset password')
  }
}

export const verifyRegistration = async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return sendError(res, 400, 'Email and OTP are required')

    const normalizedEmail = email.trim().toLowerCase()
    
    const pending = await prisma.pendingRegistration.findUnique({
      where: { email: normalizedEmail }
    })

    if (!pending) return sendError(res, 404, 'Registration session not found or expired')

    if (pending.otpAttempts >= 5) {
      return sendError(res, 429, 'Too many failed attempts. Please request a new OTP.')
    }

    if (new Date() > pending.otpExpiry) {
      return sendError(res, 400, 'Verification code expired. Please request a new code.')
    }

    const isValid = await bcrypt.compare(otp, pending.otp)
    
    if (!isValid) {
      await prisma.pendingRegistration.update({
        where: { email: normalizedEmail },
        data: { otpAttempts: pending.otpAttempts + 1 }
      })
      return sendError(res, 400, 'Invalid verification code.')
    }

    // OTP is valid, create real user
    const user = await prisma.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.password,
      }
    })

    // Delete pending registration
    await prisma.pendingRegistration.delete({
      where: { email: normalizedEmail }
    })

    await logActivity(user.id, 'USER_REGISTERED', `User account created: ${user.name}`)

    try {
      const html = getWelcomeEmailTemplate('TaskFlow', user.name)
      await mailService.sendMail({
        to: user.email,
        subject: 'Welcome to TaskFlow',
        html
      })
    } catch (e) {
      console.error('Failed to send welcome email', e)
    }

    return res.json({ message: 'Email verified successfully. Your account has been created.' })
  } catch (error) {
    console.error('VerifyRegistration Error:', error)
    return sendError(res, 500, 'Failed to verify email')
  }
}

export const resendRegistrationOtp = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return sendError(res, 400, 'Email is required')
    
    const normalizedEmail = email.trim().toLowerCase()
    
    const pending = await prisma.pendingRegistration.findUnique({
      where: { email: normalizedEmail }
    })

    if (!pending) return sendError(res, 404, 'Registration session not found')

    const otp = crypto.randomInt(100000, 999999).toString()
    const salt = await bcrypt.genSalt(10)
    const hashedOtp = await bcrypt.hash(otp, salt)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.pendingRegistration.update({
      where: { email: normalizedEmail },
      data: {
        otp: hashedOtp,
        otpExpiry,
        otpAttempts: 0
      }
    })

    const html = getRegistrationOtpTemplate('TaskFlow', pending.name, otp)
    try {
      await mailService.sendMail({
        to: normalizedEmail,
        subject: 'Verify Your Email Address - TaskFlow',
        html
      })
    } catch (mailError) {
      console.error('Failed to send email:', mailError.message)
      console.log(`\n\n=== OTP FOR TESTING: ${otp} ===\n\n`)
    }

    return res.json({ message: 'A new verification code has been sent.' })
  } catch (error) {
    console.error('ResendRegistrationOtp Error:', error)
    return sendError(res, 500, 'Failed to resend code')
  }
}

export const changeRegistrationEmail = async (req, res) => {
  try {
    const { oldEmail, newEmail } = req.body
    if (!oldEmail || !newEmail) return sendError(res, 400, 'Both old and new emails are required')

    const normalizedOld = oldEmail.trim().toLowerCase()
    const normalizedNew = newEmail.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedNew }
    })

    if (existingUser) return sendError(res, 409, 'An account already exists with this email.')

    const pending = await prisma.pendingRegistration.findUnique({
      where: { email: normalizedOld }
    })

    if (!pending) return sendError(res, 404, 'Registration session not found')

    // Create new pending and delete old one inside a transaction to prevent duplicates
    const otp = crypto.randomInt(100000, 999999).toString()
    const salt = await bcrypt.genSalt(10)
    const hashedOtp = await bcrypt.hash(otp, salt)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.$transaction([
      prisma.pendingRegistration.delete({ where: { email: normalizedOld } }),
      prisma.pendingRegistration.upsert({
        where: { email: normalizedNew },
        update: {
          name: pending.name,
          password: pending.password,
          otp: hashedOtp,
          otpExpiry,
          otpAttempts: 0
        },
        create: {
          name: pending.name,
          email: normalizedNew,
          password: pending.password,
          otp: hashedOtp,
          otpExpiry,
          otpAttempts: 0
        }
      })
    ])

    const html = getRegistrationOtpTemplate('TaskFlow', pending.name, otp)
    await mailService.sendMail({
      to: normalizedNew,
      subject: 'Verify Your Email Address - TaskFlow',
      html
    })

    return res.json({ message: 'Email updated and new verification code sent.' })
  } catch (error) {
    console.error('ChangeRegistrationEmail Error:', error)
    return sendError(res, 500, 'Failed to change email')
  }
}
