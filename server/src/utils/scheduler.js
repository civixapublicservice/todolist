import cron from 'node-cron'
import { prisma } from '../config/db.js'
import { mailService } from '../services/mail.service.js'
import { getReminderEmailTemplate } from './getReminderEmailTemplate.js'
import { formatInTimeZone } from 'date-fns-tz'

// Parse reminder time (e.g., '15m' -> 15 * 60 * 1000)
const parseReminderTime = (timeStr) => {
  if (!timeStr) return 0
  const match = timeStr.match(/^(\d+)(m|h|d)$/)
  if (!match) return 0
  
  const value = parseInt(match[1], 10)
  const unit = match[2]
  
  switch (unit) {
    case 'm': return value * 60 * 1000
    case 'h': return value * 60 * 60 * 1000
    case 'd': return value * 24 * 60 * 60 * 1000
    default: return 0
  }
}

const sendTaskReminders = async () => {
  try {
    const now = new Date()

    // 1. Fetch pending reminders. 
    // We only want incomplete tasks that have a reminder enabled, haven't been sent completely,
    // and have a due date. We also enforce a maximum of 3 retries.
    const tasks = await prisma.todo.findMany({
      where: {
        completed: false,
        reminderEnabled: true,
        reminderSent: false,
        dueDate: { not: null },
        reminderRetryCount: { lt: 3 },
        // Don't retry if we tried recently to prevent spam on error
        OR: [
          { lastReminderAttempt: null },
          { lastReminderAttempt: { lt: new Date(now.getTime() - 10 * 60 * 1000) } } // 10 minute retry backoff
        ]
      },
      include: {
        user: {
          include: { settings: true }
        }
      }
    })

    if (tasks.length === 0) return

    for (const task of tasks) {
      try {
        const reminderOffset = parseReminderTime(task.reminderTime)
        const scheduledSendTime = new Date(task.dueDate.getTime() - reminderOffset)

        if (now >= scheduledSendTime) {
          // Time to send! 
          // Atomically lock this task by updating its lastReminderAttempt
          const lock = await prisma.todo.updateMany({
            where: {
              id: task.id,
              reminderSent: false, // Ensure it wasn't sent by another instance
              OR: [
                { lastReminderAttempt: null },
                { lastReminderAttempt: task.lastReminderAttempt }
              ]
            },
            data: {
              lastReminderAttempt: now
            }
          })

          if (lock.count === 0) {
            continue // Another instance picked it up
          }

          const user = task.user
          const settings = user.settings || { timezone: 'UTC', globalEmailReminder: true, globalBrowserNotification: true }
          const timeZone = settings.timezone || 'UTC'

          // Format due date in user's timezone
          const formattedDueDate = formatInTimeZone(task.dueDate, timeZone, 'PPpp')

          let emailSuccess = task.emailReminderSent
          let browserSuccess = task.browserReminderSent
          let currentError = null

          const shouldSendEmail = !task.emailReminderSent && (task.reminderType === 'EMAIL' || task.reminderType === 'BOTH') && settings.globalEmailReminder
          const shouldSendBrowser = !task.browserReminderSent && (task.reminderType === 'BROWSER' || task.reminderType === 'BOTH') && settings.globalBrowserNotification

          // 2. Email Notification
          if (shouldSendEmail) {
            try {
              const html = getReminderEmailTemplate(
                'TaskFlow',
                user.name,
                task.title,
                task.description, // Added description param
                formattedDueDate,
                task.reminderTime,
                task.priority,
                task.id
              )

              await mailService.sendMail({
                to: user.email,
                subject: `Reminder: ${task.title} is due soon`,
                html
              })
              
              emailSuccess = true
              
              // Immediately record success for this channel
              await prisma.todo.update({
                where: { id: task.id },
                data: { emailReminderSent: true }
              })
            } catch (err) {
              console.error(`Failed to send email reminder for task ${task.id}:`, err)
              currentError = err.message || 'Email delivery failed'
            }
          } else {
            // If it doesn't need to be sent (or already sent), consider it a success for the purpose of overall status
            emailSuccess = true
          }

          // 3. Browser Notification
          if (shouldSendBrowser) {
            try {
              await prisma.notification.create({
                data: {
                  userId: user.id,
                  message: `Reminder: ${task.title} is due at ${formattedDueDate}`,
                  type: 'REMINDER',
                }
              })
              
              browserSuccess = true
              
              // Immediately record success for this channel
              await prisma.todo.update({
                where: { id: task.id },
                data: { browserReminderSent: true }
              })
            } catch (err) {
              console.error(`Failed to create browser notification for task ${task.id}:`, err)
              currentError = err.message || 'Browser notification failed'
            }
          } else {
            browserSuccess = true
          }

          // 4. Overall Status Update
          if (emailSuccess && browserSuccess) {
            // Both required channels succeeded
            await prisma.todo.update({
              where: { id: task.id },
              data: {
                reminderSent: true,
                reminderSentAt: new Date(),
                reminderError: null,
                reminderRetryCount: 0 // Reset on complete success
              }
            })

            // Log Activity
            await prisma.activity.create({
              data: {
                userId: user.id,
                action: 'REMINDER_SENT',
                details: `Sent reminder for task: "${task.title}"`
              }
            })
          } else {
            // Partial or complete failure - increment retry count
            const newRetryCount = task.reminderRetryCount + 1
            await prisma.todo.update({
              where: { id: task.id },
              data: { 
                reminderError: currentError,
                reminderRetryCount: newRetryCount,
              }
            })

            if (newRetryCount >= 3) {
              await prisma.activity.create({
                data: {
                  userId: user.id,
                  action: 'REMINDER_FAILED',
                  details: `Failed to send reminder for task: "${task.title}" after max retries.`
                }
              })
            }
          }
        }
      } catch (err) {
        console.error(`Unexpected error processing reminder for task ${task.id}:`, err)
        // Record error safely
        await prisma.todo.update({
          where: { id: task.id },
          data: { 
            reminderError: err.message || 'Unknown error',
            reminderRetryCount: { increment: 1 }
          }
        })
      }
    }
  } catch (error) {
    console.error('Scheduler Error:', error)
  }
}

// Export the init function
export const initScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', () => {
    sendTaskReminders()
  })
  
  // Also run immediately on startup to catch any missed reminders
  sendTaskReminders()
  console.log('TaskFlow Scheduler Initialized')
}

