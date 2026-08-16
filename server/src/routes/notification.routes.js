import express from 'express';
import { prisma } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);


// Get all notifications for the authenticated user
router.get('/', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to latest 20
    });
    res.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read for the user
router.patch('/read-all', async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({
  where: {
    userId: req.user.userId,
    isRead: false
  },
  data: {
    isRead: true
  }
});
    res.json({ message: 'All notifications marked as read', count: result.count });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark a notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { message, type } = req.body;
    const notification = await prisma.notification.create({
      data: {
        message,
        type: type || 'INFO',
        userId: req.user.userId
      }
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete all notifications for the user
router.delete('/', async (req, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user.userId }
    });
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
