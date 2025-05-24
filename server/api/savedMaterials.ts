import express from 'express';
import { db } from '../db';
import { savedMaterials, type InsertSavedMaterial } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { requireAuth } from '../auth/authMiddleware';

const router = express.Router();

// Get user's saved materials
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const materials = await db
      .select()
      .from(savedMaterials)
      .where(eq(savedMaterials.userId, userId))
      .orderBy(desc(savedMaterials.createdAt));

    res.json(materials);
  } catch (error) {
    console.error('Error fetching saved materials:', error);
    res.status(500).json({ message: 'Failed to fetch saved materials' });
  }
});

// Save a new material
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const materialSchema = z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      fileType: z.string().min(1),
      fileUrl: z.string().optional(),
      fileSize: z.number().optional(),
      category: z.string().optional(),
      examType: z.string().optional(),
      subject: z.string().optional(),
    });

    const validatedData = materialSchema.parse(req.body);

    const [material] = await db
      .insert(savedMaterials)
      .values({
        ...validatedData,
        userId,
      })
      .returning();

    res.status(201).json(material);
  } catch (error) {
    console.error('Error saving material:', error);
    res.status(500).json({ message: 'Failed to save material' });
  }
});

// Toggle like status
router.patch('/:id/like', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const materialId = parseInt(req.params.id);
    if (isNaN(materialId)) {
      return res.status(400).json({ message: 'Invalid material ID' });
    }

    // Get current material
    const [material] = await db
      .select()
      .from(savedMaterials)
      .where(and(
        eq(savedMaterials.id, materialId),
        eq(savedMaterials.userId, userId)
      ));

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Toggle like status
    const [updatedMaterial] = await db
      .update(savedMaterials)
      .set({ isLiked: !material.isLiked })
      .where(eq(savedMaterials.id, materialId))
      .returning();

    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to update material' });
  }
});

// Toggle bookmark status
router.patch('/:id/bookmark', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const materialId = parseInt(req.params.id);
    if (isNaN(materialId)) {
      return res.status(400).json({ message: 'Invalid material ID' });
    }

    // Get current material
    const [material] = await db
      .select()
      .from(savedMaterials)
      .where(and(
        eq(savedMaterials.id, materialId),
        eq(savedMaterials.userId, userId)
      ));

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Toggle bookmark status
    const [updatedMaterial] = await db
      .update(savedMaterials)
      .set({ isBookmarked: !material.isBookmarked })
      .where(eq(savedMaterials.id, materialId))
      .returning();

    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ message: 'Failed to update material' });
  }
});

// Delete a saved material
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const materialId = parseInt(req.params.id);
    if (isNaN(materialId)) {
      return res.status(400).json({ message: 'Invalid material ID' });
    }

    const result = await db
      .delete(savedMaterials)
      .where(and(
        eq(savedMaterials.id, materialId),
        eq(savedMaterials.userId, userId)
      ))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ message: 'Failed to delete material' });
  }
});

export default router;