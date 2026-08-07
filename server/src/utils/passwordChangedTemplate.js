export const getPasswordChangedTemplate = (appName) => {
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
    <title>Password Changed - ${appName}</title>
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
        background-color: #10B981; /* Emerald green for success */
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
        <h2>Password Successfully Changed</h2>
        <p>Hello,</p>
        <p>This is a confirmation that the password for your ${appName} account was just changed.</p>
        
        <div class="warning-box">
          <p><strong>Security Notice:</strong> If you did not make this change, please contact support immediately to secure your account.</p>
        </div>
      </div>
      <div class="footer">
        <p>Changed on ${currentDate}</p>
        <p>This is an automated message, please do not reply directly to this email.</p>
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `
}
