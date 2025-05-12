import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertStudentProfileSchema, insertSchoolSchema, insertTestSchema, insertWorkExperienceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
