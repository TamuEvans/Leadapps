import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { requireAuth } from '../auth/authMiddleware';
import { insertCounselorSchema, insertCounselingSessionSchema } from '@shared/schema';

const router = express.Router();

// Get all counselors with optional filtering
router.get('/', async (req, res) => {
  try {
    const { gender, destinationMarkets, specialties, location } = req.query;
    
    const filters: any = {};
    if (gender) filters.gender = gender as string;
    if (location) filters.location = location as string;
    if (destinationMarkets) {
      filters.destinationMarkets = (destinationMarkets as string).split(',');
    }
    if (specialties) {
      filters.specialties = (specialties as string).split(',');
    }
    
    const counselors = await storage.getCounselors(filters);
    res.json(counselors);
  } catch (error) {
    console.error('Error fetching counselors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get counselor by ID
router.get('/:id', async (req, res) => {
  try {
    const counselorId = parseInt(req.params.id);
    
    if (isNaN(counselorId)) {
      return res.status(400).json({ message: 'Invalid counselor ID' });
    }
    
    const counselor = await storage.getCounselor(counselorId);
    
    if (!counselor) {
      return res.status(404).json({ message: 'Counselor not found' });
    }
    
    res.json(counselor);
  } catch (error) {
    console.error('Error fetching counselor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new counselor (admin only for now)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validationResult = insertCounselorSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const counselor = await storage.createCounselor(validationResult.data);
    res.status(201).json(counselor);
  } catch (error) {
    console.error('Error creating counselor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update counselor
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const counselorId = parseInt(req.params.id);
    
    if (isNaN(counselorId)) {
      return res.status(400).json({ message: 'Invalid counselor ID' });
    }
    
    const validationResult = insertCounselorSchema.partial().safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const counselor = await storage.updateCounselor(counselorId, validationResult.data);
    res.json(counselor);
  } catch (error) {
    console.error('Error updating counselor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get counseling sessions for a student
router.get('/sessions/student', requireAuth, async (req, res) => {
  try {
    const studentId = req.user?.id;
    
    if (!studentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const sessions = await storage.getCounselingSessionsByStudent(studentId);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching student sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get counseling sessions for a counselor
router.get('/sessions/counselor/:counselorId', requireAuth, async (req, res) => {
  try {
    const counselorId = parseInt(req.params.counselorId);
    
    if (isNaN(counselorId)) {
      return res.status(400).json({ message: 'Invalid counselor ID' });
    }
    
    const sessions = await storage.getCounselingSessionsByCounselor(counselorId);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching counselor sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book a counseling session
router.post('/sessions', requireAuth, async (req, res) => {
  try {
    const studentId = req.user?.id;
    
    if (!studentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const sessionData = {
      ...req.body,
      studentId,
      status: 'scheduled'
    };
    
    const validationResult = insertCounselingSessionSchema.safeParse(sessionData);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const session = await storage.createCounselingSession(validationResult.data);
    
    // Create notification for counselor
    await storage.createNotification({
      userId: session.counselorId,
      title: 'New Counseling Session Booked',
      message: `A new counseling session has been scheduled for ${session.scheduledAt}`,
      type: 'session_booked',
      relatedId: session.id
    });
    
    res.status(201).json(session);
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update counseling session status
router.put('/sessions/:id', requireAuth, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    
    if (isNaN(sessionId)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }
    
    const { status, notes } = req.body;
    
    const session = await storage.updateCounselingSession(sessionId, {
      status,
      notes
    });
    
    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;