import express from 'express';
import { requireAuth } from '../auth/authMiddleware';
import { storage } from '../storage';
import { insertAgentStudentSchema, insertAgentInvitationSchema } from '@shared/schema';
import crypto from 'crypto';
import { z } from 'zod';

const router = express.Router();

// Validation schema for updating agent-student relationship
const updateAgentStudentSchema = z.object({
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
}).refine(data => data.notes !== undefined || data.status !== undefined, {
  message: 'At least one field (notes or status) must be provided',
});

// Middleware to check if user is an agent
const requireAgent = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== 'agent') {
      return res.status(403).json({ message: 'Access denied. Agent role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Error checking agent role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all students managed by the agent
router.get('/students', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const students = await storage.getAgentStudents(agentId);
    res.json(students);
  } catch (error) {
    console.error('Error fetching agent students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single student details
router.get('/students/:studentId', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    const studentId = parseInt(req.params.studentId);
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const student = await storage.getAgentStudent(agentId, studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found or not managed by you' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all invitations sent by the agent
router.get('/invitations', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const invitations = await storage.getAgentInvitations(agentId);
    res.json(invitations);
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send invitation to a student
router.post('/invitations', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const validationResult = insertAgentInvitationSchema.safeParse({
      ...req.body,
      agentId,
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    const invitation = await storage.createAgentInvitation({
      agentId,
      email: validationResult.data.email,
      firstName: validationResult.data.firstName || null,
      lastName: validationResult.data.lastName || null,
      invitationToken,
      status: 'pending',
      expiresAt,
      acceptedAt: null,
    });
    
    // TODO: Send email with invitation link
    // const invitationLink = `${process.env.APP_URL}/accept-invitation/${invitationToken}`;
    
    res.status(201).json({ 
      message: 'Invitation sent successfully', 
      invitation 
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign existing student to agent
router.post('/students', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const validationResult = insertAgentStudentSchema.safeParse({
      ...req.body,
      agentId,
      status: req.body.status || 'active',
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const { studentId, notes } = validationResult.data;
    
    const assignment = await storage.assignStudentToAgent(agentId, studentId, notes);
    
    res.status(201).json({ 
      message: 'Student assigned successfully', 
      assignment 
    });
  } catch (error) {
    console.error('Error assigning student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update agent-student relationship notes
router.patch('/students/:studentId', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    const studentId = parseInt(req.params.studentId);
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (isNaN(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
    
    const validationResult = updateAgentStudentSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const updated = await storage.updateAgentStudent(agentId, studentId, validationResult.data);
    
    if (!updated) {
      return res.status(404).json({ message: 'Student assignment not found' });
    }
    
    res.json({ message: 'Updated successfully', assignment: updated });
  } catch (error) {
    console.error('Error updating student assignment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove student from agent
router.delete('/students/:studentId', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    const studentId = parseInt(req.params.studentId);
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    await storage.removeStudentFromAgent(agentId, studentId);
    
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for agent's students
router.get('/applications', requireAuth, requireAgent, async (req, res) => {
  try {
    const agentId = req.user?.id;
    
    if (!agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const applications = await storage.getAgentStudentApplications(agentId);
    res.json(applications);
  } catch (error) {
    console.error('Error fetching agent applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
