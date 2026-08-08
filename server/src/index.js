import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import todoRoutes from './routes/todo.routes.js'
import activityRoutes from './routes/activity.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import notificationRoutes from './routes/notification.routes.js'
import mailRoutes from './routes/mail.routes.js'
import { initScheduler } from './utils/scheduler.js'
import { prisma } from './config/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend service operational' })
})

app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/mail', mailRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Initialize background scheduler
initScheduler()

async function runProductionDiagnostic() {
  try {
    const userCount = await prisma.user.count()
    const todoCount = await prisma.todo.count()
    const pendingRegistrationCount = await prisma.pendingRegistration.count()

    console.log('Production DB diagnostic:')
    console.log(`Users: ${userCount}`)
    console.log(`Todos: ${todoCount}`)
    console.log(`Pending registrations: ${pendingRegistrationCount}`)
  } catch (error) {
    console.log(`Production DB diagnostic failed: ${error.message || 'Unknown error'}`)
  }
}

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`)
  await runProductionDiagnostic()
})
