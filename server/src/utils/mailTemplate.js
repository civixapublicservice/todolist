export const getTestEmailTemplate = (appName) => {
  const currentDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Email - ${appName}</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f6f6f5;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      .header {
        background-color: #4F46E5;
        padding: 30px 40px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      .content {
        padding: 40px;
        color: #333333;
      }
      .content h2 {
        font-size: 20px;
        font-weight: 600;
        margin-top: 0;
        color: #111111;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
        color: #4b5563;
        margin-bottom: 24px;
      }
      .success-box {
        background-color: #f0fdf4;
        border-left: 4px solid #10b981;
        padding: 20px;
        border-radius: 4px;
        margin-bottom: 30px;
      }
      .success-box p {
        margin: 0;
        color: #065f46;
        font-weight: 500;
      }
      .footer {
        background-color: #f9fafb;
        padding: 24px 40px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }
      .footer p {
        font-size: 13px;
        color: #6b7280;
        margin: 4px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${appName}</h1>
      </div>
      <div class="content">
        <h2>Hello,</h2>
        <p>This is a test email sent to verify that the SMTP configuration for ${appName} is working correctly.</p>
        
        <div class="success-box">
          <p>SMTP Connection: Successful</p>
          <p>Provider: Hostinger Professional Email</p>
        </div>

        <p>If you are reading this, it means the mail service is ready to handle production workloads like password resets and user verification.</p>
        
        <p>Best regards,<br>The ${appName} Team</p>
      </div>
      <div class="footer">
        <p>Sent on ${currentDate}</p>
        <p>This is an automated message, please do not reply directly to this email.</p>
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `
}
