import express from 'express';
import { storage } from '../storage';
import { requireAdmin } from '../auth/adminMiddleware';

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

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

router.post('/articles', async (req, res) => {
  try {
    const article = await storage.createArticle(req.body);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Failed to create article' });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const article = await storage.updateArticle(parseInt(req.params.id), req.body);
    res.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
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

export default router;
