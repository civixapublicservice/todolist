import { prisma } from '../config/db.js'
import { sendError } from '../utils/errors.js'

export const getActivities = async (req, res) => {
  try {
    const userId = req.user.userId

    const activities = await prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return res.json({ activities })
  } catch (error) {
    console.error('GetActivities Error:', error)
    return sendError(res, 500, 'Failed to fetch activity logs')
  }
}
