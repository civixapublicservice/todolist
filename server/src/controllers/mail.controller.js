import { mailService } from '../services/mail.service.js'
import { getTestEmailTemplate } from '../utils/mailTemplate.js'
import { sendError } from '../utils/errors.js'

export const testSmtpConnection = async (req, res) => {
  try {
    const { to } = req.body

    if (!to || !/^\S+@\S+\.\S+$/.test(to)) {
      return sendError(res, 400, 'Valid recipient email address is required (field: "to")')
    }

    // 1. Verify SMTP Connection first
    try {
      await mailService.verifyConnection()
    } catch (connectionError) {
      return res.status(502).json({
        error: 'SMTP Connection Failed',
        details: connectionError.message,
        suggestion: 'Check your SMTP_HOST, SMTP_PORT, and SMTP_SECURE configuration.'
      })
    }

    // 2. Send the test email
    const html = getTestEmailTemplate('TaskFlow')
    
    try {
      const info = await mailService.sendMail({
        to,
        subject: 'SMTP Configuration Test - TaskFlow',
        html
      })

      return res.json({
        message: 'SMTP configuration is valid and test email was sent successfully!',
        messageId: info.messageId,
        recipient: to
      })
    } catch (sendErrorPayload) {
      return res.status(502).json({
        error: 'Failed to send test email',
        details: sendErrorPayload.message,
        suggestion: 'Connection succeeded, but sending failed. Check your SMTP_USER and SMTP_PASSWORD credentials, and verify FROM_EMAIL is allowed by your provider.'
      })
    }

  } catch (error) {
    console.error('Unhandled error in testSmtpConnection:', error)
    return sendError(res, 500, 'Internal server error while testing SMTP')
  }
}
