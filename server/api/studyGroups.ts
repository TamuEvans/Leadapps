import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { requireAuth } from '../auth/authMiddleware';
import { insertStudyGroupSchema, insertStudyGroupMemberSchema } from '@shared/schema';
import { nanoid } from 'nanoid';

const router = express.Router();

// Get all study groups with optional filtering
router.get('/', async (req, res) => {
  try {
    const { examType, subject } = req.query;
    
    const filters: any = {};
    if (examType) filters.examType = examType as string;
    if (subject) filters.subject = subject as string;
    
    const studyGroups = await storage.getStudyGroups(filters);
    res.json(studyGroups);
  } catch (error) {
    console.error('Error fetching study groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get study groups for authenticated user
router.get('/my-groups', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const studyGroups = await storage.getStudyGroupsByUser(userId);
    res.json(studyGroups);
  } catch (error) {
    console.error('Error fetching user study groups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get study group by ID
router.get('/:id', async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    
    if (isNaN(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }
    
    const studyGroup = await storage.getStudyGroup(groupId);
    
    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    
    // Get members if user is authenticated
    const members = await storage.getStudyGroupMembers(groupId);
    
    res.json({
      ...studyGroup,
      members
    });
  } catch (error) {
    console.error('Error fetching study group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new study group
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const groupData = {
      ...req.body,
      creatorId: userId,
      inviteCode: nanoid(8) // Generate unique invite code
    };
    
    const validationResult = insertStudyGroupSchema.safeParse(groupData);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const studyGroup = await storage.createStudyGroup(validationResult.data);
    
    res.status(201).json(studyGroup);
  } catch (error) {
    console.error('Error creating study group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update study group
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Check if user is the creator or has permission to edit
    const studyGroup = await storage.getStudyGroup(groupId);
    if (!studyGroup || studyGroup.creatorId !== userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    const validationResult = insertStudyGroupSchema.partial().safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const updatedGroup = await storage.updateStudyGroup(groupId, validationResult.data);
    res.json(updatedGroup);
  } catch (error) {
    console.error('Error updating study group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join study group
router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Check if study group exists and has space
    const studyGroup = await storage.getStudyGroup(groupId);
    if (!studyGroup) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    
    // Check if group is full
    const members = await storage.getStudyGroupMembers(groupId);
    if (members.length >= studyGroup.maxMembers) {
      return res.status(400).json({ message: 'Study group is full' });
    }
    
    // Check if user is already a member
    const existingMember = members.find(member => member.userId === userId);
    if (existingMember) {
      return res.status(400).json({ message: 'Already a member of this study group' });
    }
    
    await storage.joinStudyGroup(groupId, userId);
    
    // Create notification for group creator
    await storage.createNotification({
      userId: studyGroup.creatorId,
      title: 'New Member Joined Study Group',
      message: `A new member has joined your study group "${studyGroup.name}"`,
      type: 'group_member_joined',
      relatedId: groupId
    });
    
    res.json({ message: 'Successfully joined study group' });
  } catch (error) {
    console.error('Error joining study group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave study group
router.post('/:id/leave', requireAuth, async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    await storage.leaveStudyGroup(groupId, userId);
    
    res.json({ message: 'Successfully left study group' });
  } catch (error) {
    console.error('Error leaving study group:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join study group by invite code
router.post('/join-by-code', requireAuth, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user?.id;
    
    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Find study group by invite code
    const studyGroups = await storage.getStudyGroups();
    const studyGroup = studyGroups.find(group => group.inviteCode === inviteCode);
    
    if (!studyGroup) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }
    
    // Check if group is full
    const members = await storage.getStudyGroupMembers(studyGroup.id);
    if (members.length >= studyGroup.maxMembers) {
      return res.status(400).json({ message: 'Study group is full' });
    }
    
    // Check if user is already a member
    const existingMember = members.find(member => member.userId === userId);
    if (existingMember) {
      return res.status(400).json({ message: 'Already a member of this study group' });
    }
    
    await storage.joinStudyGroup(studyGroup.id, userId);
    
    // Create notification for group creator
    await storage.createNotification({
      userId: studyGroup.creatorId,
      title: 'New Member Joined Study Group',
      message: `A new member has joined your study group "${studyGroup.name}" using the invite code`,
      type: 'group_member_joined',
      relatedId: studyGroup.id
    });
    
    res.json({ 
      message: 'Successfully joined study group',
      studyGroup 
    });
  } catch (error) {
    console.error('Error joining study group by code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get study group members
router.get('/:id/members', async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);
    
    if (isNaN(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID' });
    }
    
    const members = await storage.getStudyGroupMembers(groupId);
    res.json(members);
  } catch (error) {
    console.error('Error fetching study group members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;