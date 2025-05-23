import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { requireAuth } from '../auth/authMiddleware';
import { insertNotificationSchema } from '@shared/schema';

const router = express.Router();

// Get notifications for authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 20;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const notifications = await storage.getNotificationsByUser(userId, limit);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread notification count
router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const notifications = await storage.getNotificationsByUser(userId, 100);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    res.json({ count: unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    
    if (isNaN(notificationId)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }
    
    await storage.markNotificationRead(notificationId);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    await storage.markAllNotificationsRead(userId);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (system use)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validationResult = insertNotificationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const notification = await storage.createNotification(validationResult.data);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;