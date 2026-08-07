export const getReminderEmailTemplate = (appName, userName, taskTitle, dueDateStr, reminderTimeStr, priority) => {
  const priorityColors = {
    HIGH: '#EF4444',
    MEDIUM: '#F59E0B',
    LOW: '#10B981'
  }

  const priorityColor = priorityColors[priority] || priorityColors.MEDIUM
  
  // Format the reminder string to be more readable
  const formatReminderTime = (time) => {
    if (!time) return 'Soon'
    if (time === '5m') return 'in 5 minutes'
    if (time === '15m') return 'in 15 minutes'
    if (time === '30m') return 'in 30 minutes'
    if (time === '1h') return 'in 1 hour'
    if (time === '2h') return 'in 2 hours'
    if (time === '1d') return 'in 1 day'
    return time
  }

  const remainingText = formatReminderTime(reminderTimeStr)
  
  // We don't have absolute URLs passed in, assuming standard port 5173 for local, but a relative path is safer or using a generic link
  // The exact host URL could be passed from ENV, but standard localhost for dev
  const appUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  const taskUrl = `${appUrl}/dashboard`

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Reminder</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background-color: #4F46E5;
          color: #ffffff;
          padding: 32px 40px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 24px;
        }
        .message {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 32px;
        }
        .task-card {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .task-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .task-detail {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .task-detail:last-child {
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #6b7280;
          width: 120px;
          font-size: 14px;
        }
        .detail-value {
          font-weight: 500;
          color: #111827;
          font-size: 14px;
        }
        .priority-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          background-color: ${priorityColor};
        }
        .cta-container {
          text-align: center;
          margin-top: 32px;
        }
        .btn {
          display: inline-block;
          background-color: #4F46E5;
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #4338ca;
        }
        .footer {
          background-color: #f9fafb;
          padding: 24px 40px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }
        .brand {
          font-weight: 600;
          color: #4F46E5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reminder: Upcoming Task</h1>
        </div>
        <div class="content">
          <div class="greeting">Hi ${userName},</div>
          <div class="message">
            This is a friendly reminder that you have a task due <strong>${remainingText}</strong>.
          </div>
          
          <div class="task-card">
            <h2 class="task-title">${taskTitle}</h2>
            
            <div class="task-detail">
              <span class="detail-label">Due Date:</span>
              <span class="detail-value">${dueDateStr}</span>
            </div>
            
            <div class="task-detail">
              <span class="detail-label">Priority:</span>
              <span class="detail-value">
                <span class="priority-badge">${priority}</span>
              </span>
            </div>
          </div>
          
          <div class="cta-container">
            <a href="${taskUrl}" class="btn" style="color: #ffffff;">View Task in ${appName}</a>
          </div>
        </div>
        <div class="footer">
          <p>You received this email because you set a reminder in <span class="brand">${appName}</span>.</p>
          <p style="margin-top: 8px;">If you'd like to change your notification preferences, you can do so in your Settings.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
