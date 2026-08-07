export const getWelcomeEmailTemplate = (appName, name) => {
  const currentDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${appName}</title>
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
      .btn {
        display: inline-block;
        background-color: #4F46E5;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 16px;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${appName}</h1>
      </div>
      <div class="content">
        <h2>Welcome to TaskFlow, ${name}! 🎉</h2>
        <p>Your email has been successfully verified and your account is now ready.</p>
        <p>You can now log in to manage your tasks, collaborate with your team, and stay organized.</p>
        
        <a href="http://localhost:5173/login" class="btn" style="color: #ffffff;">Go to Login</a>
      </div>
      <div class="footer">
        <p>Joined on ${currentDate}</p>
        <p>This is an automated message, please do not reply directly to this email.</p>
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `
}
