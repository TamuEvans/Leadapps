import express from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { requireAdmin } from '../auth/adminMiddleware';
import { insertUniversitySchema, insertProgramSchema, insertArticleSchema, insertExamResourceSchema } from '@shared/schema';

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// Dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const userCount = await storage.getUserCount();
    const universityCount = await storage.getUniversityCount();
    const programCount = await storage.getProgramCount();
    const applicationCount = await storage.getApplicationCount();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsersData = await storage.getRecentUsers(thirtyDaysAgo);

    const applicationStats = await storage.getApplicationStats();

    res.json({
      userCount,
      universityCount,
      programCount,
      applicationCount,
      recentUsers: recentUsersData.slice(0, 5).map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
      applicationStats,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await storage.getUserCount();
    const totalUniversities = await storage.getUniversityCount();
    const totalPrograms = await storage.getProgramCount();
    const totalApplications = await storage.getApplicationCount();

    // Get users by role
    const students = await storage.getUsersByRole('student');
    const agents = await storage.getUsersByRole('agent');
    const admins = await storage.getUsersByRole('admin');

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await storage.getRecentUsers(thirtyDaysAgo);

    // Get application stats
    const applicationStats = await storage.getApplicationStats();

    res.json({
      totalUsers,
      totalUniversities,
      totalPrograms,
      totalApplications,
      usersByRole: {
        students: students.length,
        agents: agents.length,
        admins: admins.length,
      },
      recentUsers: recentUsers.length,
      applicationStats,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { role, search, limit = 50, offset = 0 } = req.query;
    
    let users;
    if (role) {
      users = await storage.getUsersByRole(role as string);
    } else if (search) {
      users = await storage.searchUsers(search as string);
    } else {
      users = await storage.getUsers(Number(limit), Number(offset));
    }

    const totalCount = await storage.getUserCount();

    res.json({
      users,
      total: totalCount,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get additional details based on role
    let additionalData = {};
    
    if (user.role === 'student') {
      const profile = await storage.getProfileByUserId(userId);
      const applications = await storage.getApplicationsByStudent(userId);
      additionalData = { profile, applications };
    } else if (user.role === 'agent') {
      const students = await storage.getAgentStudents(userId);
      additionalData = { students };
    }

    res.json({
      ...user,
      ...additionalData,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;

    const updatedUser = await storage.updateUser(userId, updates);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Prevent self-deletion
    if ((req.user as any)?.id === userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await storage.deleteUser(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// University management
router.get('/universities', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const universities = await storage.getUniversities(Number(limit), Number(offset));
    const total = await storage.getUniversityCount();
    
    res.json({
      universities,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ message: 'Failed to fetch universities' });
  }
});

router.get('/universities/:id', async (req, res) => {
  try {
    const universityId = parseInt(req.params.id);
    const university = await storage.getUniversityById(universityId);
    
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    
    res.json(university);
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({ message: 'Failed to fetch university' });
  }
});

router.post('/universities', async (req, res) => {
  try {
    const validatedData = insertUniversitySchema.parse(req.body);
    const newUniversity = await storage.createUniversity(validatedData);
    res.status(201).json(newUniversity);
  } catch (error) {
    console.error('Error creating university:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid university data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create university' });
  }
});

router.put('/universities/:id', async (req, res) => {
  try {
    const universityId = parseInt(req.params.id);
    const validatedData = insertUniversitySchema.partial().parse(req.body);
    const updatedUniversity = await storage.updateUniversity(universityId, validatedData);
    
    if (!updatedUniversity) {
      return res.status(404).json({ message: 'University not found' });
    }
    
    res.json(updatedUniversity);
  } catch (error) {
    console.error('Error updating university:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid university data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update university' });
  }
});

router.delete('/universities/:id', async (req, res) => {
  try {
    const universityId = parseInt(req.params.id);
    await storage.deleteUniversity(universityId);
    res.json({ message: 'University deleted successfully' });
  } catch (error) {
    console.error('Error deleting university:', error);
    res.status(500).json({ message: 'Failed to delete university' });
  }
});

// Program management
router.get('/programs', async (req, res) => {
  try {
    const { universityId, limit = 100, offset = 0 } = req.query;
    
    let programs;
    if (universityId) {
      programs = await storage.getProgramsByUniversity(
        Number(universityId),
        Number(limit),
        Number(offset)
      );
    } else {
      programs = await storage.getAllPrograms(Number(limit), Number(offset));
    }
    
    const total = await storage.getProgramCount();
    
    res.json({
      programs,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Failed to fetch programs' });
  }
});

router.get('/programs/:id', async (req, res) => {
  try {
    const programId = parseInt(req.params.id);
    const program = await storage.getProgramById(programId);
    
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ message: 'Failed to fetch program' });
  }
});

router.post('/programs', async (req, res) => {
  try {
    const validatedData = insertProgramSchema.parse(req.body);
    const newProgram = await storage.createProgram(validatedData);
    res.status(201).json(newProgram);
  } catch (error) {
    console.error('Error creating program:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid program data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create program' });
  }
});

router.put('/programs/:id', async (req, res) => {
  try {
    const programId = parseInt(req.params.id);
    const validatedData = insertProgramSchema.partial().parse(req.body);
    const updatedProgram = await storage.updateProgram(programId, validatedData);
    
    if (!updatedProgram) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    res.json(updatedProgram);
  } catch (error) {
    console.error('Error updating program:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid program data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update program' });
  }
});

router.delete('/programs/:id', async (req, res) => {
  try {
    const programId = parseInt(req.params.id);
    await storage.deleteProgram(programId);
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Failed to delete program' });
  }
});

// Content management - Articles
router.get('/articles', async (req, res) => {
  try {
    const articles = await storage.getArticles();
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
});

router.get('/articles/:id', async (req, res) => {
  try {
    const articles = await storage.getArticles();
    const article = articles.find(a => a.id === parseInt(req.params.id));
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
});

router.post('/articles', async (req, res) => {
  try {
    const validatedData = insertArticleSchema.parse(req.body);
    const article = await storage.createArticle(validatedData);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid article data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create article' });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const validatedData = insertArticleSchema.partial().parse(req.body);
    const article = await storage.updateArticle(parseInt(req.params.id), validatedData);
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid article data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update article' });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    await storage.deleteArticle(parseInt(req.params.id));
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Failed to delete article' });
  }
});

// Exam Resources management
router.get('/exam-resources', async (req, res) => {
  try {
    const { examType, subject, resourceType, difficulty } = req.query;
    const resources = await storage.getExamResources({
      examType: examType as string,
      subject: subject as string,
      resourceType: resourceType as string,
      difficulty: difficulty as string,
    });
    res.json(resources);
  } catch (error) {
    console.error('Error fetching exam resources:', error);
    res.status(500).json({ message: 'Failed to fetch exam resources' });
  }
});

router.post('/exam-resources', async (req, res) => {
  try {
    const validatedData = insertExamResourceSchema.parse(req.body);
    const resource = await storage.createExamResource(validatedData);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating exam resource:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid exam resource data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create exam resource' });
  }
});

router.put('/exam-resources/:id', async (req, res) => {
  try {
    const validatedData = insertExamResourceSchema.partial().parse(req.body);
    const resource = await storage.updateExamResource(parseInt(req.params.id), validatedData);
    res.json(resource);
  } catch (error) {
    console.error('Error updating exam resource:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid exam resource data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update exam resource' });
  }
});

router.delete('/exam-resources/:id', async (req, res) => {
  try {
    await storage.deleteExamResource(parseInt(req.params.id));
    res.json({ message: 'Exam resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam resource:', error);
    res.status(500).json({ message: 'Failed to delete exam resource' });
  }
});

export default router;
