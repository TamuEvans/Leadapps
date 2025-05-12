import { 
  users, 
  studentProfiles, 
  schools, 
  tests, 
  workExperiences,
  type User, 
  type StudentProfile, 
  type School, 
  type Test, 
  type WorkExperience,
  type InsertUser, 
  type InsertStudentProfile, 
  type InsertSchool, 
  type InsertTest, 
  type InsertWorkExperience 
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Student profile operations
  getStudentProfile(id: number): Promise<StudentProfile | undefined>;
  getStudentProfileByUserId(userId: number): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: Partial<InsertStudentProfile>): Promise<StudentProfile>;
  updateStudentProfile(id: number, profile: Partial<InsertStudentProfile>): Promise<StudentProfile>;
  updateCompletionPercentage(id: number, percentage: number): Promise<void>;
  
  // School operations
  getSchool(id: number): Promise<School | undefined>;
  getSchoolsByProfileId(profileId: number): Promise<School[]>;
  createSchool(school: Partial<InsertSchool>): Promise<School>;
  updateSchool(id: number, school: Partial<InsertSchool>): Promise<School>;
  deleteSchool(id: number): Promise<void>;
  clearSchoolsByProfileId(profileId: number): Promise<void>;
  
  // Test operations
  getTest(id: number): Promise<Test | undefined>;
  getTestsByProfileId(profileId: number): Promise<Test[]>;
  createTest(test: Partial<InsertTest>): Promise<Test>;
  updateTest(id: number, test: Partial<InsertTest>): Promise<Test>;
  deleteTest(id: number): Promise<void>;
  clearTestsByProfileId(profileId: number): Promise<void>;
  
  // Work experience operations
  getWorkExperience(id: number): Promise<WorkExperience | undefined>;
  getWorkExperiencesByProfileId(profileId: number): Promise<WorkExperience[]>;
  createWorkExperience(workExperience: Partial<InsertWorkExperience>): Promise<WorkExperience>;
  updateWorkExperience(id: number, workExperience: Partial<InsertWorkExperience>): Promise<WorkExperience>;
  deleteWorkExperience(id: number): Promise<void>;
  clearWorkExperiencesByProfileId(profileId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private studentProfilesMap: Map<number, StudentProfile>;
  private schoolsMap: Map<number, School>;
  private testsMap: Map<number, Test>;
  private workExperiencesMap: Map<number, WorkExperience>;
  
  // ID counters for each entity
  private userIdCounter: number;
  private profileIdCounter: number;
  private schoolIdCounter: number;
  private testIdCounter: number;
  private workExperienceIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.studentProfilesMap = new Map();
    this.schoolsMap = new Map();
    this.testsMap = new Map();
    this.workExperiencesMap = new Map();
    
    this.userIdCounter = 1;
    this.profileIdCounter = 1;
    this.schoolIdCounter = 1;
    this.testIdCounter = 1;
    this.workExperienceIdCounter = 1;
    
    // Add a default user for testing
    this.createUser({
      username: "student",
      password: "password",
      email: "student@example.com"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.usersMap.set(id, user);
    return user;
  }

  // Student profile operations
  async getStudentProfile(id: number): Promise<StudentProfile | undefined> {
    return this.studentProfilesMap.get(id);
  }

  async getStudentProfileByUserId(userId: number): Promise<StudentProfile | undefined> {
    return Array.from(this.studentProfilesMap.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createStudentProfile(profile: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const id = this.profileIdCounter++;
    const updatedAt = new Date();
    const completionPercentage = profile.completionPercentage || 0;
    
    // Create the profile with default values for fundingSources if not provided
    const newProfile: StudentProfile = {
      ...profile,
      id,
      userId: profile.userId || 1, // Default to user 1 if not specified
      fundingSources: profile.fundingSources || [],
      completionPercentage,
      updatedAt
    } as StudentProfile;
    
    this.studentProfilesMap.set(id, newProfile);
    return newProfile;
  }

  async updateStudentProfile(id: number, profile: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const existingProfile = await this.getStudentProfile(id);
    
    if (!existingProfile) {
      throw new Error(`Profile with id ${id} not found`);
    }
    
    const updatedAt = new Date();
    const updatedProfile: StudentProfile = {
      ...existingProfile,
      ...profile,
      updatedAt
    };
    
    this.studentProfilesMap.set(id, updatedProfile);
    return updatedProfile;
  }

  async updateCompletionPercentage(id: number, percentage: number): Promise<void> {
    const profile = await this.getStudentProfile(id);
    
    if (!profile) {
      throw new Error(`Profile with id ${id} not found`);
    }
    
    profile.completionPercentage = percentage;
    this.studentProfilesMap.set(id, profile);
  }

  // School operations
  async getSchool(id: number): Promise<School | undefined> {
    return this.schoolsMap.get(id);
  }

  async getSchoolsByProfileId(profileId: number): Promise<School[]> {
    return Array.from(this.schoolsMap.values()).filter(
      (school) => school.profileId === profileId
    );
  }

  async createSchool(school: Partial<InsertSchool>): Promise<School> {
    const id = this.schoolIdCounter++;
    
    const newSchool: School = {
      ...school,
      id,
      profileId: school.profileId || 1, // Default to profile 1 if not specified
      currentlyAttending: school.currentlyAttending || false
    } as School;
    
    this.schoolsMap.set(id, newSchool);
    return newSchool;
  }

  async updateSchool(id: number, school: Partial<InsertSchool>): Promise<School> {
    const existingSchool = await this.getSchool(id);
    
    if (!existingSchool) {
      throw new Error(`School with id ${id} not found`);
    }
    
    const updatedSchool: School = {
      ...existingSchool,
      ...school
    };
    
    this.schoolsMap.set(id, updatedSchool);
    return updatedSchool;
  }

  async deleteSchool(id: number): Promise<void> {
    this.schoolsMap.delete(id);
  }

  async clearSchoolsByProfileId(profileId: number): Promise<void> {
    const schoolsToDelete = await this.getSchoolsByProfileId(profileId);
    
    for (const school of schoolsToDelete) {
      await this.deleteSchool(school.id);
    }
  }

  // Test operations
  async getTest(id: number): Promise<Test | undefined> {
    return this.testsMap.get(id);
  }

  async getTestsByProfileId(profileId: number): Promise<Test[]> {
    return Array.from(this.testsMap.values()).filter(
      (test) => test.profileId === profileId
    );
  }

  async createTest(test: Partial<InsertTest>): Promise<Test> {
    const id = this.testIdCounter++;
    
    const newTest: Test = {
      ...test,
      id,
      profileId: test.profileId || 1 // Default to profile 1 if not specified
    } as Test;
    
    this.testsMap.set(id, newTest);
    return newTest;
  }

  async updateTest(id: number, test: Partial<InsertTest>): Promise<Test> {
    const existingTest = await this.getTest(id);
    
    if (!existingTest) {
      throw new Error(`Test with id ${id} not found`);
    }
    
    const updatedTest: Test = {
      ...existingTest,
      ...test
    };
    
    this.testsMap.set(id, updatedTest);
    return updatedTest;
  }

  async deleteTest(id: number): Promise<void> {
    this.testsMap.delete(id);
  }

  async clearTestsByProfileId(profileId: number): Promise<void> {
    const testsToDelete = await this.getTestsByProfileId(profileId);
    
    for (const test of testsToDelete) {
      await this.deleteTest(test.id);
    }
  }

  // Work experience operations
  async getWorkExperience(id: number): Promise<WorkExperience | undefined> {
    return this.workExperiencesMap.get(id);
  }

  async getWorkExperiencesByProfileId(profileId: number): Promise<WorkExperience[]> {
    return Array.from(this.workExperiencesMap.values()).filter(
      (workExperience) => workExperience.profileId === profileId
    );
  }

  async createWorkExperience(workExperience: Partial<InsertWorkExperience>): Promise<WorkExperience> {
    const id = this.workExperienceIdCounter++;
    
    const newWorkExperience: WorkExperience = {
      ...workExperience,
      id,
      profileId: workExperience.profileId || 1, // Default to profile 1 if not specified
      current: workExperience.current || false
    } as WorkExperience;
    
    this.workExperiencesMap.set(id, newWorkExperience);
    return newWorkExperience;
  }

  async updateWorkExperience(id: number, workExperience: Partial<InsertWorkExperience>): Promise<WorkExperience> {
    const existingWorkExperience = await this.getWorkExperience(id);
    
    if (!existingWorkExperience) {
      throw new Error(`Work experience with id ${id} not found`);
    }
    
    const updatedWorkExperience: WorkExperience = {
      ...existingWorkExperience,
      ...workExperience
    };
    
    this.workExperiencesMap.set(id, updatedWorkExperience);
    return updatedWorkExperience;
  }

  async deleteWorkExperience(id: number): Promise<void> {
    this.workExperiencesMap.delete(id);
  }

  async clearWorkExperiencesByProfileId(profileId: number): Promise<void> {
    const workExperiencesToDelete = await this.getWorkExperiencesByProfileId(profileId);
    
    for (const workExperience of workExperiencesToDelete) {
      await this.deleteWorkExperience(workExperience.id);
    }
  }
}

export const storage = new MemStorage();
