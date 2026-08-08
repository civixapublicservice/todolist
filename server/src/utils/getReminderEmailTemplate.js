export const getReminderEmailTemplate = (appName, userName, taskTitle, taskDescription, dueDateStr, reminderTimeStr, priority) => {
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
  
  const appUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173'
  const taskUrl = `${appUrl}/dashboard`

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Reminder</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background-color: #f3f4f6;
          margin: 0;
          padding: 0;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #f3f4f6;
          padding: 40px 20px;
        }
        .main-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          padding: 40px 40px;
          text-align: center;
        }
        .header-brand {
          color: #e0e7ff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .header-title {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px;
          background-color: #ffffff;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          color: #111827;
          margin-bottom: 16px;
        }
        .intro-text {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 32px;
        }
        .highlight {
          color: #4F46E5;
          font-weight: 600;
        }
        .card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .task-title {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin: 0 0 8px 0;
        }
        .task-desc {
          font-size: 15px;
          color: #64748b;
          margin: 0 0 24px 0;
        }
        .meta-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .meta-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 15px;
        }
        .meta-item:last-child {
          margin-bottom: 0;
        }
        .meta-label {
          width: 140px;
          color: #64748b;
          font-weight: 500;
        }
        .meta-value {
          color: #0f172a;
          font-weight: 600;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          background-color: ${priorityColor};
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cta-wrapper {
          text-align: center;
          margin: 40px 0 20px;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(to right, #4F46E5, #6366F1);
          color: #ffffff !important;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
        }
        .footer {
          background-color: #f8fafc;
          padding: 32px 40px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
        }
        .footer-text {
          margin: 0 0 8px;
          font-size: 14px;
          color: #64748b;
        }
        .footer-link {
          color: #4F46E5;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="main-container">
          <!-- Header -->
          <div class="header">
            <div class="header-brand">${appName}</div>
            <h1 class="header-title">Task Reminder</h1>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div class="greeting">Hi ${userName},</div>
            <p class="intro-text">
              Your task is approaching its deadline. It is due <span class="highlight">${remainingText}</span>.
            </p>
            
            <!-- Task Card -->
            <div class="card">
              <h2 class="task-title">${taskTitle}</h2>
              ${taskDescription ? \`<p class="task-desc">\${taskDescription}</p>\` : ''}
              
              <ul class="meta-list">
                <li class="meta-item">
                  <span class="meta-label">Deadline:</span>
                  <span class="meta-value">${dueDateStr}</span>
                </li>
                <li class="meta-item">
                  <span class="meta-label">Priority:</span>
                  <span class="meta-value"><span class="badge">${priority}</span></span>
                </li>
                <li class="meta-item">
                  <span class="meta-label">Reminder:</span>
                  <span class="meta-value">${reminderTimeStr} before</span>
                </li>
              </ul>
            </div>
            
            <!-- CTA -->
            <div class="cta-wrapper">
              <a href="${taskUrl}" class="btn">Open Task in ${appName}</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">This is an automated reminder from ${appName}.</p>
            <p class="footer-text">To stop receiving these emails, adjust your <a href="${taskUrl}" class="footer-link">notification settings</a>.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

