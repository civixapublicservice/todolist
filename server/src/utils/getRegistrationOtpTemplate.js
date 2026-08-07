export const getRegistrationOtpTemplate = (appName, name, otp) => {
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
    <title>Verify Your Email Address - ${appName}</title>
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
        text-align: center;
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
      .otp-box {
        background-color: #f3f4f6;
        border: 2px dashed #d1d5db;
        padding: 24px;
        border-radius: 8px;
        margin: 30px auto;
        display: inline-block;
      }
      .otp-code {
        font-family: 'Courier New', Courier, monospace;
        font-size: 40px;
        font-weight: 800;
        letter-spacing: 8px;
        color: #4F46E5;
        margin: 0;
      }
      .warning-box {
        background-color: #fffbeb;
        border-left: 4px solid #f59e0b;
        padding: 16px 20px;
        border-radius: 4px;
        margin-top: 30px;
        text-align: left;
      }
      .warning-box p {
        margin: 0;
        color: #92400e;
        font-size: 14px;
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
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with us! To complete your account setup, please verify your email address.</p>
        <p>Use the verification code below. This code is valid for <strong>10 minutes</strong>.</p>
        
        <div class="otp-box">
          <p class="otp-code">${otp}</p>
        </div>

        <div class="warning-box">
          <p><strong>Security Notice:</strong> If you did not sign up for a TaskFlow account, please ignore this email. Never share this code with anyone.</p>
        </div>
      </div>
      <div class="footer">
        <p>Requested on ${currentDate}</p>
        <p>This is an automated message, please do not reply directly to this email.</p>
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `
}
