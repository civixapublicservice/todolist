import { prisma } from '../config/db.js'

export const logActivity = async (userId, action, details) => {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action,
        details,
      },
    })
  } catch (error) {
    console.error('LogActivity Error:', error)
  }
}
