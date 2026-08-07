import dotenv from 'dotenv'

dotenv.config()

export const mailConfig = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE !== 'false', // Default true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  from: process.env.FROM_EMAIL || '"TaskFlow" <noreply@taskflow.com>'
}
