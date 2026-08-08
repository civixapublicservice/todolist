import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

class MailService {
  /**
   * Send an email using Brevo (Sendinblue) API v3
   * @param {Object} options 
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML content
   * @returns {Promise<Object>} Delivery info
   */
  async sendMail({ to, subject, html }) {
    try {
      const apiKey = process.env.BREVO_API_KEY
      
      if (!apiKey) {
        console.warn('⚠️ BREVO_API_KEY is not configured. Emails will fail.')
      }

      // We extract just the email address if mailConfig.from contains name (e.g. "Name" <email>)
      const senderEmail = process.env.SMTP_USER || 'ramesh.s@prasklatechnology.com'

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { 
            name: 'TaskFlow', 
            email: senderEmail
          },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html
        },
        {
          headers: {
            'api-key': apiKey,
            'accept': 'application/json',
            'content-type': 'application/json'
          }
        }
      )

      console.log('Email sent via Brevo:', response.data)
      return response.data
    } catch (error) {
      console.error('Failed to send email with Brevo:', error.response?.data || error.message)
      throw error
    }
  }
}

// Export a singleton instance
export const mailService = new MailService()
