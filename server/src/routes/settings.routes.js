import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authenticateToken);


// Get settings for the authenticated user
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId: req.user.id }
    });

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.settings.create({
        data: { userId: req.user.id }
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
    const { theme, emailAlerts, pushNotifications } = req.body;
    
    const settings = await prisma.settings.upsert({
      where: { userId: req.user.id },
      update: {
        ...(theme !== undefined && { theme }),
        ...(emailAlerts !== undefined && { emailAlerts }),
        ...(pushNotifications !== undefined && { pushNotifications })
      },
      create: {
        userId: req.user.id,
        theme: theme || 'system',
        emailAlerts: emailAlerts !== undefined ? emailAlerts : true,
        pushNotifications: pushNotifications !== undefined ? pushNotifications : true
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
