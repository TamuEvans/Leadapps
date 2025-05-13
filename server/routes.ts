import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertStudentProfileSchema, insertSchoolSchema, insertTestSchema, insertWorkExperienceSchema } from "@shared/schema";
import { z } from "zod";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { configurePassport } from './auth/passportConfig';
import { authMiddleware, requireAuth } from './auth/authMiddleware';
import authRoutes from './auth/authRoutes';

export async function registerRoutes(app: Express): Promise<Server> {
  // Add middleware
  app.use(cookieParser());
  
  // Configure and initialize passport
  configurePassport();
  app.use(passport.initialize());
  
  // Add auth middleware to all routes
  app.use(authMiddleware);
  
  // Register authentication routes
  app.use('/api/auth', authRoutes);
  
  // API routes prefix
  const apiPrefix = "/api";

  // User registration
  app.post(`${apiPrefix}/register`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  // Login route (mock for demo purposes)
  app.post(`${apiPrefix}/login`, async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd use a proper auth system with tokens
      // Using a basic approach for demo
      res.status(200).json({ 
        id: user.id, 
        username: user.username, 
        email: user.email 
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Login failed" });
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
      await storage.updateCompletionPercentage(profile.id, completionPercentage);
      
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
      await storage.updateCompletionPercentage(profile.id, completionPercentage);
      
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
      const total = await storage.getUniversityCount(filters);
      
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
      
      const programs = await storage.getProgramsByUniversity(universityId, limitNum, offset, filters);
      const total = await storage.getProgramCount(universityId, filters);
      
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

  // Get applications for a student
  app.get(`${apiPrefix}/applications`, requireAuth, async (req, res) => {
    try {
      // In a real app with auth, you'd get the student ID from the authenticated user
      const studentId = 1; // Default for demo
      
      const applications = await storage.getApplicationsByStudent(studentId);
      res.status(200).json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  
  // Create application
  app.post(`${apiPrefix}/applications`, requireAuth, async (req, res) => {
    try {
      // In a real app with auth, you'd get the student ID from the authenticated user
      const studentId = 1; // Default for demo
      
      const applicationData = {
        studentId,
        ...req.body,
        status: "Draft", // Default status for new applications
        createdAt: new Date(),
        lastUpdated: new Date()
      };
      
      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });
  
  // Update application
  app.patch(`${apiPrefix}/applications/:id`, requireAuth, async (req, res) => {
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
      
      const updatedApplication = await storage.updateApplication(id, {
        ...req.body,
        lastUpdated: new Date()
      });
      
      res.status(200).json(updatedApplication);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });
  
  // Delete application
  app.delete(`${apiPrefix}/applications/:id`, requireAuth, async (req, res) => {
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
  app.get(`${apiPrefix}/applications/:id/documents`, requireAuth, async (req, res) => {
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
  app.post(`${apiPrefix}/applications/:id/documents`, requireAuth, async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
