import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import { minimalStorage as storage } from "./storage-minimal";
import { insertUserSchema, insertStudentProfileSchema, insertSchoolSchema, insertTestSchema, insertWorkExperienceSchema, Application } from "../shared/schema";
import { z } from "zod";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { configurePassport } from './auth/passportConfig';
import { authMiddleware, requireAuth } from './auth/authMiddleware';
import authRoutes from './auth/authRoutes';
import personalityAssessmentRouter from './api/personalityAssessment';
import programRecommendationsRouter from './api/programRecommendations';
import multer from "multer";
import * as ExcelJS from "exceljs";
import csv from "csv-parser";
import fs from "fs";

// Extended Application type with additional fields from related tables
interface ExtendedApplication extends Application {
  programName?: string;
  universityName?: string;
  universityLocation?: string;
  universityLogo?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Import security modules
  const { monitoring, healthCheckHandler } = await import("./monitoring");
  const { getClientIpAddress, getUserAgent } = await import("./security");
  const { logAuditEvent, AuditActions } = await import("./auditLog");
  const { authService } = await import("./auth");

  // Add monitoring middleware
  app.use(monitoring.performanceMiddleware());
  app.use(monitoring.securityMiddleware());

  // Health check endpoint
  app.get('/api/health', healthCheckHandler);

  // Serve static files from the public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Add middleware
  app.use(cookieParser());

  // Configure and initialize passport
  configurePassport();
  app.use(passport.initialize());

  // Add auth middleware to all routes
  app.use(authMiddleware);

  // API routes prefix
  const apiPrefix = "/api";
  
  // Authentication endpoints
  app.post('/api/logout', async (req, res) => {
    try {
      const token = req.cookies?.auth_token;
      
      if (token) {
        await authService.logout(token);
        res.clearCookie('auth_token');
      }
      
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  });
  
  app.get('/api/auth/me', async (req, res) => {
    try {
      const token = req.cookies?.auth_token;
      
      if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await authService.verifyToken(token);
      
      if (!user) {
        res.clearCookie('auth_token');
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      res.json({ user });
    } catch (error) {
      console.error('Auth verification error:', error);
      res.clearCookie('auth_token');
      res.status(401).json({ message: 'Authentication failed' });
    }
  });

  // Register authentication routes
  app.use('/api/auth', authRoutes);
  
  // Password reset routes
  const { requestPasswordReset, resetPassword, verifyEmail } = await import('./auth/passwordReset');
  app.post('/api/auth/forgot-password', requestPasswordReset);
  app.post('/api/auth/reset-password', resetPassword);
  app.post('/api/auth/verify-email', verifyEmail);

  // Admin authentication routes
  const { adminLogin, adminLogout, requireAdmin } = await import('./auth/adminAuth');
  app.post('/api/admin/login', adminLogin);
  app.post('/api/admin/logout', requireAdmin, adminLogout);
  
  // Admin dashboard API routes
  app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
      // Get basic statistics
      const stats = {
        totalApplications: await storage.getApplicationsCount(),
        pendingApplications: await storage.getPendingApplicationsCount(),
        totalUsers: await storage.getUsersCount(),
        recentApplications: await storage.getRecentApplications(5)
      };
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Register personality assessment routes
  app.use('/api/personality-assessment', personalityAssessmentRouter);

  // Register program recommendations routes
  app.use('/api/program-recommendations', programRecommendationsRouter);

  // Register counselor routes
  app.use('/api/counselors', (await import('./api/counselors')).default);

  // Register study groups routes
  app.use('/api/study-groups', (await import('./api/studyGroups')).default);

  // Register exam resources routes
  app.use('/api/exam-resources', (await import('./api/examResources')).default);

  // Register notifications routes
  app.use('/api/notifications', (await import('./api/notifications')).default);

  // Register saved materials routes
  app.use('/api/saved-materials', (await import('./api/savedMaterials')).default);

  // Configure multer for file uploads
  const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Only CSV and Excel files are allowed'));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });

  // Helper function to parse spreadsheet data
  const parseSpreadsheet = async (filePath: string, fileType: string): Promise<any[]> => {
    if (fileType === 'csv') {
      const results: any[] = [];
      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            fs.unlinkSync(filePath); // Clean up temp file
            resolve(results);
          })
          .on('error', reject);
      });
    } else {
      // Excel file
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1); // Get first worksheet
      const data: any[] = [];
      
      if (worksheet) {
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          const rowData: any = {};
          row.eachCell((cell, colNumber) => {
            const header = worksheet.getCell(1, colNumber).value;
            rowData[header as string] = cell.value;
          });
          data.push(rowData);
        });
      }
      
      fs.unlinkSync(filePath); // Clean up temp file
      return data;
    }
  };

  // Upload Universities spreadsheet
  app.post('/api/upload/universities', requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileType = req.file.mimetype.includes('csv') ? 'csv' : 'excel';
      const data = await parseSpreadsheet(req.file.path, fileType);

      // Validate and process university data
      const processedData: any[] = [];
      const errors: string[] = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const university = {
            name: row.name || row.Name,
            country: row.country || row.Country,
            city: row.city || row.City,
            logoUrl: row.logo_url || row.LogoUrl || row['Logo URL'],
            websiteUrl: row.website_url || row.WebsiteUrl || row['Website URL'],
            description: row.description || row.Description,
            acceptsDirectApplications: row.accepts_direct_applications === 'TRUE' || row.accepts_direct_applications === true,
            applicationFee: row.application_fee ? parseInt(row.application_fee) : null,
            apiEndpoint: row.api_endpoint || row.ApiEndpoint || row['API Endpoint'],
            apiKey: row.api_key || row.ApiKey || row['API Key']
          };

          if (!university.name || !university.country || !university.city) {
            errors.push(`Row ${i + 1}: Missing required fields (name, country, city)`);
            continue;
          }

          processedData.push(university);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors, processedCount: processedData.length });
      }

      // Insert universities into database
      const insertedUniversities = await storage.bulkCreateUniversities(processedData);

      res.json({
        message: `Successfully imported ${insertedUniversities.length} universities`,
        imported: insertedUniversities.length,
        total: data.length
      });
    } catch (error) {
      console.error('University upload error:', error);
      res.status(500).json({ error: 'Failed to process university data' });
    }
  });

  // Upload Programs spreadsheet
  app.post('/api/upload/programs', requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileType = req.file.mimetype.includes('csv') ? 'csv' : 'excel';
      const data = await parseSpreadsheet(req.file.path, fileType);

      const processedData: any[] = [];
      const errors: string[] = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const program = {
            universityName: row.university_name || row.UniversityName || row['University Name'],
            name: row.name || row.Name || row.program_name || row.ProgramName || row['Program Name'],
            degree: row.degree || row.Degree,
            level: row.level || row.Level,
            discipline: row.discipline || row.Discipline,
            duration: row.duration || row.Duration,
            tuitionFee: row.tuition_fee ? parseInt(row.tuition_fee) : null,
            currency: row.currency || row.Currency || 'USD',
            applicationDeadline: row.application_deadline || row.ApplicationDeadline || row['Application Deadline'],
            description: row.description || row.Description,
            requirements: row.requirements || row.Requirements
          };

          if (!program.universityName || !program.name || !program.degree || !program.level || !program.discipline) {
            errors.push(`Row ${i + 1}: Missing required fields (university_name, name, degree, level, discipline)`);
            continue;
          }

          processedData.push(program);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors, processedCount: processedData.length });
      }

      const insertedPrograms = await storage.bulkCreatePrograms(processedData);

      res.json({
        message: `Successfully imported ${insertedPrograms.length} programs`,
        imported: insertedPrograms.length,
        total: data.length
      });
    } catch (error) {
      console.error('Program upload error:', error);
      res.status(500).json({ error: 'Failed to process program data' });
    }
  });

  // Upload Applications spreadsheet
  app.post('/api/upload/applications', requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileType = req.file.mimetype.includes('csv') ? 'csv' : 'excel';
      const data = await parseSpreadsheet(req.file.path, fileType);

      const processedData: any[] = [];
      const errors: string[] = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          const application = {
            studentEmail: row.student_email || row.StudentEmail || row['Student Email'],
            universityName: row.university_name || row.UniversityName || row['University Name'],
            programName: row.program_name || row.ProgramName || row['Program Name'],
            status: row.status || row.Status || 'draft',
            submissionDate: row.submission_date || row.SubmissionDate || row['Submission Date'],
            intakePeriod: row.intake_period || row.IntakePeriod || row['Intake Period'],
            intakeYear: row.intake_year ? parseInt(row.intake_year) : null,
            externalReferenceId: row.external_reference_id || row.ExternalReferenceId || row['External Reference ID'],
            feedback: row.feedback || row.Feedback,
            internalNotes: row.internal_notes || row.InternalNotes || row['Internal Notes']
          };

          if (!application.studentEmail || !application.universityName || !application.programName) {
            errors.push(`Row ${i + 1}: Missing required fields (student_email, university_name, program_name)`);
            continue;
          }

          const validStatuses = ['draft', 'submitted', 'pending_review', 'under_review', 'additional_documents_required', 'accepted', 'rejected', 'waitlisted', 'deferred', 'withdrawn'];
          if (!validStatuses.includes(application.status)) {
            errors.push(`Row ${i + 1}: Invalid status '${application.status}'. Must be one of: ${validStatuses.join(', ')}`);
            continue;
          }

          processedData.push(application);
        } catch (error) {
          errors.push(`Row ${i + 1}: ${error.message}`);
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors, processedCount: processedData.length });
      }

      const insertedApplications = await storage.bulkCreateApplications(processedData);

      res.json({
        message: `Successfully imported ${insertedApplications.length} applications`,
        imported: insertedApplications.length,
        total: data.length
      });
    } catch (error) {
      console.error('Application upload error:', error);
      res.status(500).json({ error: 'Failed to process application data' });
    }
  });

  // Production user registration with proper validation
  app.post(`${apiPrefix}/register`, async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Use AuthService for secure registration
      const { user, needsVerification } = await authService.register(email, password, firstName, lastName);
      
      res.status(201).json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        },
        needsVerification,
        message: needsVerification ? 'Registration successful. Please check your email to verify your account.' : 'Registration successful.'
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  // Production login route with JWT authentication
  app.post(`${apiPrefix}/login`, async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
      
      // Use the AuthService for secure login
      const { user, token } = await authService.login(email, password, rememberMe);
      
      // Set secure HTTP-only cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 1 day
      };
      
      res.cookie('auth_token', token, cookieOptions);
      
      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(401).json({ message: error.message || "Invalid credentials" });
    }
  });

  // Get user profile
  app.get(`${apiPrefix}/profile`, async (req, res) => {
    try {
      // In a real app, you'd get userId from session or token
      // For now, we'll always default to user 1 for demo purposes
      const userId = 1;

      const profile = await storage.getStudentProfileByUserId(userId);
      if (!profile) {
        // If profile doesn't exist, create a default one
        const newProfile = await storage.createStudentProfile({ userId });
        const schools: any[] = [];
        const tests: any[] = [];
        const workExperiences: any[] = [];

        return res.status(200).json({
          ...newProfile,
          schools,
          tests,
          workExperiences
        });
      }

      // Get related data
      const schools = await storage.getSchoolsByProfileId(profile.id);
      const tests = await storage.getTestsByProfileId(profile.id);
      const workExperiences = await storage.getWorkExperiencesByProfileId(profile.id);

      res.status(200).json({
        ...profile,
        schools,
        tests,
        workExperiences
      });
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ message: "Failed to retrieve profile" });
    }
  });

  // Create or update profile
  app.post(`${apiPrefix}/profile`, async (req, res) => {
    try {
      // In a real app, you'd get userId from session or token
      const userId = 1; // Default to 1 for demo

      // Process the main profile data
      const profileData = {
        userId,
        ...req.body
      };

      // Extract arrays from the request body
      const { schools, tests, workExperiences, ...profileFields } = req.body;

      // Create or update the profile
      let profile = await storage.getStudentProfileByUserId(userId);

      if (profile) {
        profile = await storage.updateStudentProfile(profile.id, profileFields);
      } else {
        profile = await storage.createStudentProfile(profileFields);
      }

      // Process schools if provided
      if (schools && Array.isArray(schools)) {
        // Clear existing schools and add new ones
        await storage.clearSchoolsByProfileId(profile.id);

        for (const school of schools) {
          await storage.createSchool({
            profileId: profile.id,
            ...school
          });
        }
      }

      // Process tests if provided
      if (tests && Array.isArray(tests)) {
        // Clear existing tests and add new ones
        await storage.clearTestsByProfileId(profile.id);

        for (const test of tests) {
          await storage.createTest({
            profileId: profile.id,
            ...test
          });
        }
      }

      // Process work experiences if provided
      if (workExperiences && Array.isArray(workExperiences)) {
        // Clear existing work experiences and add new ones
        await storage.clearWorkExperiencesByProfileId(profile.id);

        for (const workExp of workExperiences) {
          await storage.createWorkExperience({
            profileId: profile.id,
            ...workExp
          });
        }
      }

      // Calculate profile completion percentage
      const completionPercentage = await calculateProfileCompletion(profile, schools, tests);
      await storage.updateCompletionPercentage(profile.id);

      res.status(200).json({ 
        message: "Profile successfully updated",
        completionPercentage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
      }
    }
  });

  // Update profile (patch)
  app.patch(`${apiPrefix}/profile`, async (req, res) => {
    try {
      // In a real app, you'd get userId from session or token
      const userId = 1; // Default to 1 for demo

      // Get existing profile
      const profile = await storage.getStudentProfileByUserId(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Update profile with provided fields
      const updatedProfile = await storage.updateStudentProfile(profile.id, req.body);

      // Recalculate completion percentage
      const schools = await storage.getSchoolsByProfileId(profile.id);
      const tests = await storage.getTestsByProfileId(profile.id);
      const completionPercentage = await calculateProfileCompletion(updatedProfile, schools, tests);
      await storage.updateCompletionPercentage(profile.id);

      res.status(200).json({ 
        message: "Profile successfully updated",
        completionPercentage
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Upload profile picture (endpoint for future implementation)
  app.post(`${apiPrefix}/profile/picture`, (req, res) => {
    // In a real app, you'd process the file upload here
    // For now, just return a success response
    res.status(200).json({ 
      message: "Profile picture upload endpoint (not yet implemented)",
      pictureUrl: null
    });
  });

  // Get universities with filtering and pagination
  app.get(`${apiPrefix}/universities`, async (req, res) => {
    try {
      const { country, name, page, limit } = req.query;
      const pageNum = page ? parseInt(page as string) : 1;
      const limitNum = limit ? parseInt(limit as string) : 20;
      const offset = (pageNum - 1) * limitNum;

      const filters: { country?: string; name?: string } = {};
      if (country && country !== 'all') filters.country = country as string;
      if (name) filters.name = name as string;

      const universities = await storage.getUniversities(limitNum, offset, filters);
      const total = await storage.getUniversityCount();

      res.status(200).json({
        data: universities,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  // Get single university by ID
  app.get(`${apiPrefix}/universities/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid university ID" });
      }

      const university = await storage.getUniversity(id);
      if (!university) {
        return res.status(404).json({ message: "University not found" });
      }

      res.status(200).json(university);
    } catch (error) {
      console.error("Error fetching university:", error);
      res.status(500).json({ message: "Failed to fetch university" });
    }
  });

  // Get programs for a university with filtering and pagination
  app.get(`${apiPrefix}/universities/:id/programs`, async (req, res) => {
    try {
      const universityId = parseInt(req.params.id);
      if (isNaN(universityId)) {
        return res.status(400).json({ message: "Invalid university ID" });
      }

      const { level, discipline, degree, name, page, limit } = req.query;
      const pageNum = page ? parseInt(page as string) : 1;
      const limitNum = limit ? parseInt(limit as string) : 20;
      const offset = (pageNum - 1) * limitNum;

      const filters: { level?: string; discipline?: string; degree?: string; name?: string } = {};
      if (level && level !== 'all') filters.level = level as string;
      if (discipline && discipline !== 'all') filters.discipline = discipline as string;
      if (degree && degree !== 'all') filters.degree = degree as string;
      if (name) filters.name = name as string;

      const programs = await storage.getProgramsByUniversity(universityId);
      const total = await storage.getProgramCount();

      res.status(200).json({
        data: programs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  // Get single program by ID
  app.get(`${apiPrefix}/programs/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid program ID" });
      }

      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }

      res.status(200).json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  // Get a single application by ID
  app.get(`${apiPrefix}/applications/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const applicationData = await storage.getApplication(id);

      if (!applicationData) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Cast to extended application type
      const application = applicationData as unknown as ExtendedApplication;

      // If the application has a programId, get the program details
      if (application.programId) {
        const program = await storage.getProgram(application.programId);
        if (program) {
          application.programName = program.name;

          // Get university details for the program
          const university = await storage.getUniversity(program.universityId);
          if (university) {
            application.universityName = university.name;
            application.universityLocation = university.country;
            application.universityLogo = university.logoUrl || undefined;
          }
        }
      }

      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Get applications for a student
  app.get(`${apiPrefix}/applications`, async (req, res) => {
    try {
      // First, check if our demo user exists - we'll reuse the same demo user
      let user = await storage.getUserByEmail("demo@example.com");

      // If no demo user, return empty applications
      if (!user) {
        return res.status(200).json([]);
      }

      // Check for a student profile for this user
      let profile = await storage.getStudentProfileByUserId(user.id);
      if (!profile) {
        return res.status(200).json([]);
      }

      // Get applications for this user's profile
      const applications = await storage.getApplicationsByStudent(profile.id);

      // Enhance applications with program and university data
      const enhancedApplications = await Promise.all(applications.map(async (app) => {
        try {
          // Cast to extended application type
          const enhancedApp = app as unknown as ExtendedApplication;

          // Get program details
          const program = await storage.getProgram(app.programId);

          if (program) {
            // Get university details
            const university = await storage.getUniversity(program.universityId);

            enhancedApp.programName = program.name;
            enhancedApp.universityName = university?.name || "Unknown University";
            enhancedApp.universityLocation = university ? `${university.city}, ${university.country}` : "Unknown";
            enhancedApp.universityLogo = university?.logoUrl || undefined;

            return enhancedApp;
          }

          enhancedApp.programName = "Unknown Program";
          enhancedApp.universityName = "Unknown University";
          enhancedApp.universityLocation = "Unknown";

          return enhancedApp;
        } catch (err) {
          console.error("Error enhancing application:", err);
          return app;
        }
      }));

      res.status(200).json(enhancedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Create application
  app.post(`${apiPrefix}/applications`, async (req, res) => {
    try {
      // In a demo without auth, we'll create a demo user if needed

      // First, check if our demo user exists
      let user = await storage.getUserByEmail("demo@example.com");

      // If not, create the demo user
      if (!user) {
        user = await storage.createUser({
          email: "demo@example.com", 
          username: "demouser",
          password: "password123",
          firstName: "Demo",
          lastName: "User",
          isVerified: true,
          profileImageUrl: null,
          googleId: null,
          facebookId: null,
          updatedAt: null
        });
      }

      // Now check for a student profile for this user
      let profile = await storage.getStudentProfileByUserId(user.id);
      if (!profile) {
        profile = await storage.createStudentProfile({ userId: user.id });
      }

      const applicationData = {
        studentId: profile.id, // Use the student profile ID
        ...req.body,
        status: "draft" // Default status for new applications with lowercase status
      };

      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  // Update application
  app.patch(`${apiPrefix}/applications/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      // In a real app, you'd check if the application belongs to the authenticated user

      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const applicationData = { ...req.body };

      // Ensure dates are properly formatted
      if (applicationData.submissionDate && typeof applicationData.submissionDate === 'string') {
        applicationData.submissionDate = new Date(applicationData.submissionDate);
      }

      if (applicationData.lastUpdated && typeof applicationData.lastUpdated === 'string') {
        applicationData.lastUpdated = new Date(applicationData.lastUpdated);
      } else {
        // Always update the lastUpdated field
        applicationData.lastUpdated = new Date();
      }

      const updatedApplication = await storage.updateApplication(id, applicationData);

      res.status(200).json(updatedApplication);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Delete application
  app.delete(`${apiPrefix}/applications/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      // In a real app, you'd check if the application belongs to the authenticated user

      const application = await storage.getApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      await storage.deleteApplication(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // Application document routes
  // Get documents for an application
  app.get(`${apiPrefix}/applications/:id/documents`, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      // In a real app, you'd check if the application belongs to the authenticated user

      const documents = await storage.getApplicationDocumentsByApplication(applicationId);
      res.status(200).json(documents);
    } catch (error) {
      console.error("Error fetching application documents:", error);
      res.status(500).json({ message: "Failed to fetch application documents" });
    }
  });

  // Upload document for an application
  app.post(`${apiPrefix}/applications/:id/documents`, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      // In a real app, you'd check if the application belongs to the authenticated user

      // In a real app, you'd handle file uploads here
      // For now, we'll just create a document record with the provided data

      const documentData = {
        applicationId,
        ...req.body,
        uploadedAt: new Date()
      };

      const document = await storage.createApplicationDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating application document:", error);
      res.status(500).json({ message: "Failed to create application document" });
    }
  });

  // Get profile documents
  app.get(`${apiPrefix}/profile/documents`, async (req, res) => {
    try {
      // In a real app, you'd get the profile ID from authenticated user
      // For demo, we'll use the demo profile
      const profile = await storage.getStudentProfileByUserId(1);

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const documents = await storage.getProfileDocuments(profile.id);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching profile documents:", error);
      res.status(500).json({ message: "Failed to fetch profile documents" });
    }
  });

  // Upload document for a profile
  app.post(`${apiPrefix}/profile/documents`, async (req, res) => {
    try {
      // In a real app, you'd get the profile ID from authenticated user
      // For demo, we'll use the demo profile
      const profile = await storage.getStudentProfileByUserId(1);

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Handle file upload here
      // For now, we'll create a document record with mock data
      const documentData = {
        profileId: profile.id,
        type: req.body.documentType,
        fileName: req.body.fileName || `${req.body.documentType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        fileUrl: `/documents/${req.body.documentType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        uploadDate: new Date().toISOString()
      };

      const document = await storage.createProfileDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error uploading profile document:", error);
      res.status(500).json({ message: "Failed to upload profile document" });
    }
  });

  // Get student profile documents for an application
  app.get(`${apiPrefix}/applications/:id/profile-documents`, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const application = await storage.getApplication(applicationId);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Get student profile to access their documents
      const studentProfile = await storage.getStudentProfile(application.studentId);

      if (!studentProfile) {
        return res.json([]);
      }

      // Get actual profile documents
      const profileDocuments = await storage.getProfileDocuments(studentProfile.id);

      // If no documents exist yet, return some sample data for demo purposes
      if (profileDocuments.length === 0) {
        return res.json([
          {
            id: 1,
            profileId: studentProfile.id,
            type: "Passport",
            fileUrl: "/documents/passport.pdf",
            fileName: "passport.pdf",
            uploadDate: new Date().toISOString()
          },
          {
            id: 2,
            profileId: studentProfile.id,
            type: "Academic Transcript",
            fileUrl: "/documents/transcript.pdf",
            fileName: "transcript.pdf",
            uploadDate: new Date().toISOString()
          }
        ]);
      }

      res.json(profileDocuments);
    } catch (error) {
      console.error("Error fetching profile documents:", error);
      res.status(500).json({ message: "Failed to fetch profile documents" });
    }
  });

  // Get application notes
  app.get(`${apiPrefix}/applications/:id/notes`, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      // For now, returning sample data since we haven't implemented notes yet
      const notes = [
        {
          id: 1,
          applicationId,
          text: "Please upload your passport as soon as possible to proceed with your application.",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          isStaff: true
        },
        {
          id: 2,
          applicationId,
          text: "I've uploaded my passport. Please let me know if there's anything else needed.",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          isStaff: false
        }
      ];

      res.json(notes);
    } catch (error) {
      console.error("Error fetching application notes:", error);
      res.status(500).json({ message: "Failed to fetch application notes" });
    }
  });

  // Add application note
  app.post(`${apiPrefix}/applications/:id/notes`, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const { text, createdAt } = req.body;

      // For now, just return success response since we haven't implemented notes storage
      res.status(201).json({
        id: Date.now(),
        applicationId,
        text,
        createdAt,
        isStaff: false
      });
    } catch (error) {
      console.error("Error adding note:", error);
      res.status(500).json({ message: "Failed to add note" });
    }
  });

  // Calculate profile completion percentage
  async function calculateProfileCompletion(profile: any, schools: any[] = [], tests: any[] = []) {
    const requiredFields = [
      "firstName", "lastName", "dateOfBirth", "primaryLanguage", 
      "countryOfCitizenship", "maritalStatus", "gender",
      "address1", "city", "province", "country", "postalCode", "email", "phoneNumber",
      "intendedFieldsOfStudy", "preferredStudyLevel", "expectedStartTerm", 
      "expectedStartYear", "preferredStudyDestinations", "onlineLearningInterest",
      "educationCountry", "highestEducationLevel", "gradingScheme", "overallGrade",
      "isEnglishFirstLanguage"
    ];

    // Count filled required fields
    const filledFields = requiredFields.filter(field => {
      const value = profile[field];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== "";
    });

    // Add bonus for schools and tests
    let bonus = 0;
    if (schools.length > 0) bonus += 10;
    if (tests.length > 0) bonus += 5;

    // Calculate percentage (base on required fields + bonus)
    let percentage = Math.round((filledFields.length / requiredFields.length) * 100);

    // Cap at 100%
    percentage = Math.min(percentage + bonus, 100);

    return percentage;
  }

  // Import and register admin routes
  try {
    const { registerAdminRoutes } = await import("./adminRoutes");
    registerAdminRoutes(app);
  } catch (error) {
    console.log("Admin routes not available - continuing without admin functionality");
  }

  const httpServer = createServer(app);
  return httpServer;
}