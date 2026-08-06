import express from 'express';
import { prisma } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { updateProfile, changePassword } from '../controllers/settings.controller.js';
import { validateResetPassword } from '../middleware/validate.js'; // Can reuse this for password change if desired, but changePassword checks it internally.

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
    const { theme, emailAlerts, pushNotifications } = req.body;
    
    const settings = await prisma.settings.upsert({
      where: { userId: req.user.userId },
      update: {
        ...(theme !== undefined && { theme }),
        ...(emailAlerts !== undefined && { emailAlerts }),
        ...(pushNotifications !== undefined && { pushNotifications })
      },
      create: {
        userId: req.user.userId,
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

// Profile and Security endpoints
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);

export default router;
