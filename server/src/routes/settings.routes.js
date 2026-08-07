import express from 'express';
import { prisma } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { updateProfile, changePassword } from '../controllers/settings.controller.js';

const router = express.Router();

router.use(authenticateToken);

// Get settings for the authenticated user
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId: req.user.userId }
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId: req.user.userId }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Fetch settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const { 
      theme, 
      emailAlerts, 
      pushNotifications,
      timezone,
      globalEmailReminder,
      globalBrowserNotification,
      defaultReminderTime,
      reminderSound,
      desktopNotification
    } = req.body;
    
    const settings = await prisma.settings.upsert({
      where: { userId: req.user.userId },
      update: {
        ...(theme !== undefined && { theme }),
        ...(emailAlerts !== undefined && { emailAlerts }),
        ...(pushNotifications !== undefined && { pushNotifications }),
        ...(timezone !== undefined && { timezone }),
        ...(globalEmailReminder !== undefined && { globalEmailReminder }),
        ...(globalBrowserNotification !== undefined && { globalBrowserNotification }),
        ...(defaultReminderTime !== undefined && { defaultReminderTime }),
        ...(reminderSound !== undefined && { reminderSound }),
        ...(desktopNotification !== undefined && { desktopNotification }),
      },
      create: {
        userId: req.user.userId,
        theme: theme || 'system',
        timezone: timezone || 'UTC',
        emailAlerts: emailAlerts !== undefined ? emailAlerts : true,
        pushNotifications: pushNotifications !== undefined ? pushNotifications : true,
        globalEmailReminder: globalEmailReminder !== undefined ? globalEmailReminder : true,
        globalBrowserNotification: globalBrowserNotification !== undefined ? globalBrowserNotification : true,
        defaultReminderTime: defaultReminderTime || '15m',
        reminderSound: reminderSound !== undefined ? reminderSound : true,
        desktopNotification: desktopNotification !== undefined ? desktopNotification : true,
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile and Security endpoints
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);

export default router;
