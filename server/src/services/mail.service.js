import nodemailer from 'nodemailer'
import { mailConfig } from '../config/mail.config.js'

class MailService {
  constructor() {
    this.transporter = null
  }

  /**
   * Initializes the transporter if it hasn't been created yet.
   * Throws an error if credentials are not provided in production.
   */
  getTransporter() {
    if (this.transporter) return this.transporter

    if (!mailConfig.auth.user || !mailConfig.auth.pass) {
      console.warn('⚠️ SMTP credentials are not configured. Emails will fail.')
    }

    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },
      // Settings specific for reliability with production SMTPs
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      connectionTimeout: 10000,
      greetingTimeout: 5000,
    })

    return this.transporter
  }

  /**
   * Verifies the SMTP connection
   * @returns {Promise<boolean>} True if successful, throws error if failed
   */
  async verifyConnection() {
    try {
      const transporter = this.getTransporter()
      await transporter.verify()
      return true
    } catch (error) {
      console.error('SMTP Connection Verification Failed:', error.message)
      throw error
    }
  }

  /**
   * Send an email
   * @param {Object} options 
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML content
   * @returns {Promise<Object>} Delivery info
   */
  async sendMail({ to, subject, html }) {
    try {
      const transporter = this.getTransporter()
      
      const mailOptions = {
        from: mailConfig.from,
        to,
        subject,
        html,
      }

      const info = await transporter.sendMail(mailOptions)
      return info
    } catch (error) {
      console.error('Failed to send email:', error.message)
      throw error
    }
  }
}

// Export a singleton instance
export const mailService = new MailService()
