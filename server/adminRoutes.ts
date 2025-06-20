import type { Express } from "express";
import { eq, and, desc, like, or, sql } from "drizzle-orm";
import { db } from "./db";
import { 
  applications, 
  enhancedApplicationDocuments as applicationDocuments, 
  studentProfiles, 
  programs, 
  universities, 
  users,
  applicationStatusHistory,
  schoolIntegrations
} from "@shared/schema";
import { authMiddleware, requireAuth } from './auth/authMiddleware';
import { z } from "zod";

// Admin authentication middleware
const requireAdminAuth = (req: any, res: any, next: any) => {
  // For now, any authenticated user can access admin
  // In production, check for admin role
  if (!req.user) {
    return res.status(401).json({ message: "Admin authentication required" });
  }
  next();
};

// Document review schema
const documentReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional()
});

// Application status update schema
const applicationStatusSchema = z.object({
  status: z.string(),
  notes: z.string().optional()
});

// Send to school schema
const sendToSchoolSchema = z.object({
  method: z.enum(['manual', 'leadenroll'])
});

export function registerAdminRoutes(app: Express) {
  
  // Get all applications with filtering
  app.get('/api/admin/applications', async (req, res) => {
    try {
      const { status, search } = req.query;
      
      // Mock data for demonstration since database connectivity is limited
      const mockApplications = [
        {
          id: 1,
          studentId: 1,
          programId: 1,
          universityId: 1,
          status: 'submitted',
          submittedAt: new Date('2024-01-15'),
          reviewedAt: null,
          reviewedBy: null,
          notes: null,
          student: {
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@email.com',
            phoneNumber: '+1-555-0123'
          },
          program: {
            id: 1,
            name: 'Master of Computer Science',
            level: 'Masters'
          },
          university: {
            id: 1,
            name: 'University of Toronto',
            location: 'Toronto, Canada'
          },
          documents: [
            {
              id: 1,
              applicationId: 1,
              type: 'Passport',
              fileName: 'passport_john_smith.pdf',
              fileUrl: '/documents/passport_john_smith.pdf',
              status: 'pending',
              uploadedAt: new Date('2024-01-15'),
              reviewedAt: null,
              reviewedBy: null,
              rejectionReason: null
            },
            {
              id: 2,
              applicationId: 1,
              type: 'Academic Transcript',
              fileName: 'transcript_john_smith.pdf',
              fileUrl: '/documents/transcript_john_smith.pdf',
              status: 'approved',
              uploadedAt: new Date('2024-01-15'),
              reviewedAt: new Date('2024-01-16'),
              reviewedBy: 1,
              rejectionReason: null
            }
          ]
        },
        {
          id: 2,
          studentId: 2,
          programId: 2,
          universityId: 2,
          status: 'under_review',
          submittedAt: new Date('2024-01-20'),
          reviewedAt: new Date('2024-01-22'),
          reviewedBy: 1,
          notes: 'All documents received, reviewing academic qualifications',
          student: {
            id: 2,
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            phoneNumber: '+1-555-0456'
          },
          program: {
            id: 2,
            name: 'Bachelor of Business Administration',
            level: 'Bachelors'
          },
          university: {
            id: 2,
            name: 'McGill University',
            location: 'Montreal, Canada'
          },
          documents: [
            {
              id: 3,
              applicationId: 2,
              type: 'Passport',
              fileName: 'passport_sarah_johnson.pdf',
              fileUrl: '/documents/passport_sarah_johnson.pdf',
              status: 'approved',
              uploadedAt: new Date('2024-01-20'),
              reviewedAt: new Date('2024-01-21'),
              reviewedBy: 1,
              rejectionReason: null
            },
            {
              id: 4,
              applicationId: 2,
              type: 'English Language Test',
              fileName: 'ielts_sarah_johnson.pdf',
              fileUrl: '/documents/ielts_sarah_johnson.pdf',
              status: 'rejected',
              uploadedAt: new Date('2024-01-20'),
              reviewedAt: new Date('2024-01-22'),
              reviewedBy: 1,
              rejectionReason: 'IELTS score does not meet minimum requirement of 6.5'
            }
          ]
        },
        {
          id: 3,
          studentId: 3,
          programId: 3,
          universityId: 3,
          status: 'approved',
          submittedAt: new Date('2024-01-10'),
          reviewedAt: new Date('2024-01-25'),
          reviewedBy: 1,
          notes: 'Excellent academic record, all requirements met',
          student: {
            id: 3,
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael.chen@email.com',
            phoneNumber: '+1-555-0789'
          },
          program: {
            id: 3,
            name: 'PhD in Engineering',
            level: 'Doctorate'
          },
          university: {
            id: 3,
            name: 'University of British Columbia',
            location: 'Vancouver, Canada'
          },
          documents: [
            {
              id: 5,
              applicationId: 3,
              type: 'Passport',
              fileName: 'passport_michael_chen.pdf',
              fileUrl: '/documents/passport_michael_chen.pdf',
              status: 'approved',
              uploadedAt: new Date('2024-01-10'),
              reviewedAt: new Date('2024-01-12'),
              reviewedBy: 1,
              rejectionReason: null
            },
            {
              id: 6,
              applicationId: 3,
              type: 'Academic Transcript',
              fileName: 'transcript_michael_chen.pdf',
              fileUrl: '/documents/transcript_michael_chen.pdf',
              status: 'approved',
              uploadedAt: new Date('2024-01-10'),
              reviewedAt: new Date('2024-01-12'),
              reviewedBy: 1,
              rejectionReason: null
            }
          ]
        }
      ];

      // Apply filters
      let filteredApplications = mockApplications;

      if (status && status !== 'all') {
        filteredApplications = filteredApplications.filter(app => app.status === status);
      }

      if (search) {
        const searchTerm = search.toString().toLowerCase();
        filteredApplications = filteredApplications.filter(app =>
          app.student.firstName.toLowerCase().includes(searchTerm) ||
          app.student.lastName.toLowerCase().includes(searchTerm) ||
          app.student.email.toLowerCase().includes(searchTerm) ||
          app.program.name.toLowerCase().includes(searchTerm) ||
          app.university.name.toLowerCase().includes(searchTerm)
        );
      }

      res.json(filteredApplications);

    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get single application with full details
  app.get('/api/admin/applications/:id', async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      
      // Mock single application response
      const application = {
        id: applicationId,
        studentId: 1,
        programId: 1,
        status: 'submitted',
        submittedAt: new Date('2024-01-15'),
        reviewedAt: null,
        reviewedBy: null,
        notes: null,
        student: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phoneNumber: '+1-555-0123'
        },
        program: {
          name: 'Master of Computer Science',
          level: 'Masters'
        },
        university: {
          name: 'University of Toronto',
          city: 'Toronto',
          country: 'Canada'
        },
        documents: [
          {
            id: 1,
            type: 'Passport',
            fileName: 'passport_john_smith.pdf',
            fileUrl: '/documents/passport_john_smith.pdf',
            status: 'pending',
            uploadedAt: new Date('2024-01-15')
          }
        ],
        statusHistory: [
          {
            id: 1,
            fromStatus: null,
            toStatus: 'submitted',
            notes: 'Application submitted',
            changedAt: new Date('2024-01-15'),
            changedBy: 'john.smith@email.com'
          }
        ]
      };

      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Update application status
  app.put('/api/admin/applications/:id/status', async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { status, notes } = applicationStatusSchema.parse(req.body);
      
      // Mock update response
      const updatedApp = {
        id: applicationId,
        status,
        notes,
        reviewedAt: new Date(),
        reviewedBy: 1,
        lastUpdated: new Date()
      };

      res.json(updatedApp);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Review document
  app.put('/api/admin/documents/:id/review', async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const { status, rejectionReason } = documentReviewSchema.parse(req.body);

      // Mock document update response
      const updatedDoc = {
        id: documentId,
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : null,
        reviewedAt: new Date(),
        reviewedBy: 1
      };

      res.json(updatedDoc);
    } catch (error) {
      console.error("Error reviewing document:", error);
      res.status(500).json({ message: "Failed to review document" });
    }
  });

  // Send application to school
  app.post('/api/admin/applications/:id/send-to-school', async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { method } = sendToSchoolSchema.parse(req.body);

      if (method === 'manual') {
        // Mock manual upload package
        const packageData = {
          applicationId,
          student: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@email.com'
          },
          program: {
            name: 'Master of Computer Science',
            level: 'Masters'
          },
          university: 'University of Toronto',
          documents: [
            { type: 'Passport', fileName: 'passport_john_smith.pdf' },
            { type: 'Academic Transcript', fileName: 'transcript_john_smith.pdf' }
          ],
          packagedAt: new Date(),
          method: 'manual'
        };

        res.json({
          message: "Application package prepared for manual upload",
          method: 'manual',
          packageData
        });

      } else if (method === 'leadenroll') {
        // Mock LeadEnroll submission
        const leadEnrollData = {
          applicationId,
          externalReference: `LE_${Date.now()}`,
          submittedAt: new Date()
        };

        res.json({
          message: "Application sent to LeadEnroll system",
          method: 'leadenroll',
          externalReference: `LE_${Date.now()}`,
          leadEnrollData
        });
      }

    } catch (error) {
      console.error("Error sending application to school:", error);
      res.status(500).json({ message: "Failed to send application to school" });
    }
  });

  // Get admin dashboard stats
  app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
      // Mock dashboard stats
      const stats = {
        statusCounts: [
          { status: 'submitted', count: 15 },
          { status: 'under_review', count: 8 },
          { status: 'approved', count: 25 },
          { status: 'rejected', count: 3 },
          { status: 'sent_to_school', count: 12 }
        ],
        pendingDocuments: 23,
        recentApplications: [
          {
            id: 1,
            status: 'submitted',
            submissionDate: new Date('2024-01-15'),
            studentName: 'John Smith',
            programName: 'Master of Computer Science',
            universityName: 'University of Toronto'
          },
          {
            id: 2,
            status: 'under_review',
            submissionDate: new Date('2024-01-20'),
            studentName: 'Sarah Johnson',
            programName: 'Bachelor of Business Administration',
            universityName: 'McGill University'
          }
        ]
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
}