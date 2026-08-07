import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

class MailService {
  constructor() {
    this.resend = null
  }

  /**
   * Initializes the Resend client.
   */
  getResend() {
    if (this.resend) return this.resend

    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY is not configured. Emails will fail.')
    }

    this.resend = new Resend(process.env.RESEND_API_KEY)
    return this.resend
  }

  /**
   * Send an email using Resend
   * @param {Object} options 
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML content
   * @returns {Promise<Object>} Delivery info
   */
  async sendMail({ to, subject, html }) {
    try {
      const resend = this.getResend()
      
      // Resend free tier requires the from address to be onboarding@resend.dev
      // unless you verify your own domain.
      const mailOptions = {
        from: 'TaskFlow <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }

      const { data, error } = await resend.emails.send(mailOptions)

      if (error) {
        console.error('Failed to send email with Resend:', error.message)
        throw new Error(error.message)
      }

      console.log('Email sent via Resend:', data)
      return data
    } catch (error) {
      console.error('Failed to send email:', error.message)
      throw error
    }
  }
}

// Export a singleton instance
export const mailService = new MailService()
