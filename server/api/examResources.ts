import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { requireAuth } from '../auth/authMiddleware';
import { insertExamResourceSchema, insertUserProgressSchema } from '@shared/schema';

const router = express.Router();

// Get all exam resources with optional filtering
router.get('/', async (req, res) => {
  try {
    const { examType, subject, resourceType, difficulty } = req.query;
    
    const filters: any = {};
    if (examType) filters.examType = examType as string;
    if (subject) filters.subject = subject as string;
    if (resourceType) filters.resourceType = resourceType as string;
    if (difficulty) filters.difficulty = difficulty as string;
    
    const resources = await storage.getExamResources(filters);
    res.json(resources);
  } catch (error) {
    console.error('Error fetching exam resources:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exam resource by ID
router.get('/:id', async (req, res) => {
  try {
    const resourceId = parseInt(req.params.id);
    
    if (isNaN(resourceId)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }
    
    const resource = await storage.getExamResource(resourceId);
    
    if (!resource) {
      return res.status(404).json({ message: 'Exam resource not found' });
    }
    
    res.json(resource);
  } catch (error) {
    console.error('Error fetching exam resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new exam resource (admin/educator only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validationResult = insertExamResourceSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const resource = await storage.createExamResource(validationResult.data);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating exam resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update exam resource
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const resourceId = parseInt(req.params.id);
    
    if (isNaN(resourceId)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }
    
    const validationResult = insertExamResourceSchema.partial().safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const resource = await storage.updateExamResource(resourceId, validationResult.data);
    res.json(resource);
  } catch (error) {
    console.error('Error updating exam resource:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's progress on resources
router.get('/progress/my-progress', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const progress = await storage.getUserProgressByUser(userId);
    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific progress for a resource
router.get('/:resourceId/progress', requireAuth, async (req, res) => {
  try {
    const resourceId = parseInt(req.params.resourceId);
    const userId = req.user?.id;
    
    if (isNaN(resourceId)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const progress = await storage.getUserProgress(userId, resourceId);
    res.json(progress || { completionPercentage: 0, status: 'not_started' });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user progress on a resource
router.post('/:resourceId/progress', requireAuth, async (req, res) => {
  try {
    const resourceId = parseInt(req.params.resourceId);
    const userId = req.user?.id;
    
    if (isNaN(resourceId)) {
      return res.status(400).json({ message: 'Invalid resource ID' });
    }
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { completionPercentage, status, timeSpent, score } = req.body;
    
    // Check if progress already exists
    const existingProgress = await storage.getUserProgress(userId, resourceId);
    
    if (existingProgress) {
      // Update existing progress
      const updatedProgress = await storage.updateUserProgress(existingProgress.id, {
        completionPercentage,
        status,
        timeSpent,
        score
      });
      res.json(updatedProgress);
    } else {
      // Create new progress record
      const progressData = {
        userId,
        resourceId,
        completionPercentage,
        status,
        timeSpent,
        score
      };
      
      const validationResult = insertUserProgressSchema.safeParse(progressData);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: validationResult.error.format() 
        });
      }
      
      const progress = await storage.createUserProgress(validationResult.data);
      res.status(201).json(progress);
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get resources by exam type with popular ones first
router.get('/exam-type/:examType', async (req, res) => {
  try {
    const { examType } = req.params;
    const { subject, difficulty } = req.query;
    
    const filters: any = { examType };
    if (subject) filters.subject = subject as string;
    if (difficulty) filters.difficulty = difficulty as string;
    
    const resources = await storage.getExamResources(filters);
    
    // Sort by download count or popularity if available
    const sortedResources = resources.sort((a, b) => {
      return (b.downloadCount || 0) - (a.downloadCount || 0);
    });
    
    res.json(sortedResources);
  } catch (error) {
    console.error('Error fetching resources by exam type:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended resources based on user's study profile
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get user's progress to understand their preferences
    const userProgress = await storage.getUserProgressByUser(userId);
    
    // Get all resources and filter based on user's activity
    const allResources = await storage.getExamResources();
    
    // Simple recommendation logic - can be enhanced with ML
    const recommendations = allResources.filter(resource => {
      // Recommend resources in subjects where user has made progress
      const hasProgressInSubject = userProgress.some(progress => {
        // This would need to be enhanced with proper subject matching
        return resource.subject.toLowerCase().includes(resource.subject.toLowerCase());
      });
      
      return hasProgressInSubject || resource.difficulty === 'beginner';
    }).slice(0, 10); // Limit to 10 recommendations
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;