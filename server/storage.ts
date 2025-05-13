import { 
  users, 
  studentProfiles, 
  schools, 
  tests, 
  workExperiences,
  universities,
  programs,
  applications,
  applicationDocuments,
  type User, 
  type StudentProfile, 
  type School, 
  type Test, 
  type WorkExperience,
  type University,
  type Program,
  type Application,
  type ApplicationDocument,
  type InsertUser, 
  type InsertStudentProfile, 
  type InsertSchool, 
  type InsertTest, 
  type InsertWorkExperience,
  type InsertUniversity,
  type InsertProgram,
  type InsertApplication,
  type InsertApplicationDocument
} from "@shared/schema";
import { db } from './db';
import { eq, and, desc, isNotNull, sql, like, ilike } from 'drizzle-orm';

// Interface for storage methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Session operations
  createSession(userId: number, token: string, expiresAt: Date): Promise<void>;
  getSessionByToken(token: string): Promise<any | undefined>;
  deleteSession(token: string): Promise<void>;
  
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
  
  // University operations
  getUniversity(id: number): Promise<University | undefined>;
  getUniversities(
    limit?: number, 
    offset?: number, 
    filters?: { country?: string; name?: string; }
  ): Promise<University[]>;
  getUniversityCount(filters?: { country?: string; name?: string; }): Promise<number>;
  createUniversity(university: Partial<InsertUniversity>): Promise<University>;
  updateUniversity(id: number, university: Partial<InsertUniversity>): Promise<University>;
  deleteUniversity(id: number): Promise<void>;
  
  // Program operations
  getProgram(id: number): Promise<Program | undefined>;
  getProgramsByUniversity(
    universityId: number,
    limit?: number,
    offset?: number,
    filters?: { level?: string; discipline?: string; degree?: string; name?: string; }
  ): Promise<Program[]>;
  getProgramCount(
    universityId?: number,
    filters?: { level?: string; discipline?: string; degree?: string; name?: string; }
  ): Promise<number>;
  createProgram(program: Partial<InsertProgram>): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: number): Promise<void>;
  
  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByStudent(studentId: number): Promise<Application[]>;
  createApplication(application: Partial<InsertApplication>): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application>;
  deleteApplication(id: number): Promise<void>;
  
  // Application Document operations
  getApplicationDocument(id: number): Promise<ApplicationDocument | undefined>;
  getApplicationDocumentsByApplication(applicationId: number): Promise<ApplicationDocument[]>;
  createApplicationDocument(document: Partial<InsertApplicationDocument>): Promise<ApplicationDocument>;
  updateApplicationDocument(id: number, document: Partial<InsertApplicationDocument>): Promise<ApplicationDocument>;
  deleteApplicationDocument(id: number): Promise<void>;
  
  // Profile Document operations
  getProfileDocuments(profileId: number): Promise<any[]>;
  createProfileDocument(document: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private studentProfilesMap: Map<number, StudentProfile>;
  private schoolsMap: Map<number, School>;
  private testsMap: Map<number, Test>;
  private workExperiencesMap: Map<number, WorkExperience>;
  private sessionsMap: Map<string, any>; // Token -> Session
  private profileDocumentsMap: Map<number, any>; // Document ID -> Document
  
  // ID counters for each entity
  private userIdCounter: number;
  private profileIdCounter: number;
  private schoolIdCounter: number;
  private testIdCounter: number;
  private workExperienceIdCounter: number;
  private documentIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.studentProfilesMap = new Map();
    this.schoolsMap = new Map();
    this.testsMap = new Map();
    this.workExperiencesMap = new Map();
    this.sessionsMap = new Map();
    this.profileDocumentsMap = new Map();
    
    this.userIdCounter = 1;
    this.profileIdCounter = 1;
    this.schoolIdCounter = 1;
    this.testIdCounter = 1;
    this.workExperienceIdCounter = 1;
    this.documentIdCounter = 1;
    
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
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email
    );
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.googleId === googleId
    );
  }
  
  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.facebookId === facebookId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      updatedAt,
      isVerified: false, 
      googleId: null,
      facebookId: null,
      profileImageUrl: null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null
    };
    this.usersMap.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const existingUser = await this.getUser(id);
    
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = {
      ...existingUser,
      ...userData,
      updatedAt: new Date()
    };
    
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }
  
  // Session operations
  async createSession(userId: number, token: string, expiresAt: Date): Promise<void> {
    this.sessionsMap.set(token, {
      userId,
      token,
      expiresAt,
      createdAt: new Date()
    });
  }
  
  async getSessionByToken(token: string): Promise<any | undefined> {
    const session = this.sessionsMap.get(token);
    
    if (session && new Date(session.expiresAt) > new Date()) {
      return session;
    }
    
    if (session) {
      // Session expired, remove it
      await this.deleteSession(token);
    }
    
    return undefined;
  }
  
  async deleteSession(token: string): Promise<void> {
    this.sessionsMap.delete(token);
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
  
  // Profile Document operations
  async getProfileDocuments(profileId: number): Promise<any[]> {
    const documents: any[] = [];
    
    // Use Array.from to avoid MapIterator compatibility issues
    Array.from(this.profileDocumentsMap.entries()).forEach(([_, document]) => {
      if (document.profileId === profileId) {
        documents.push(document);
      }
    });
    
    return documents;
  }
  
  async createProfileDocument(document: any): Promise<any> {
    const id = this.documentIdCounter++;
    
    const newDocument = {
      id,
      profileId: document.profileId,
      type: document.type || document.documentType,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      uploadDate: new Date().toISOString(),
      createdAt: new Date()
    };
    
    this.profileDocumentsMap.set(id, newDocument);
    
    return newDocument;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.facebookId, facebookId));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...userData })
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Session operations
  async createSession(userId: number, token: string, expiresAt: Date): Promise<void> {
    // This would typically be implemented with a separate sessions table
    // For now, just log the action
    console.log(`Creating session for user ${userId} with token ${token} expiring at ${expiresAt}`);
  }

  async getSessionByToken(token: string): Promise<any | undefined> {
    // This would typically be implemented with a separate sessions table
    // For now, return undefined
    return undefined;
  }

  async deleteSession(token: string): Promise<void> {
    // This would typically be implemented with a separate sessions table
    // For now, just log the action
    console.log(`Deleting session with token ${token}`);
  }

  // Student profile operations
  async getStudentProfile(id: number): Promise<StudentProfile | undefined> {
    const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.id, id));
    return profile;
  }

  async getStudentProfileByUserId(userId: number): Promise<StudentProfile | undefined> {
    const [profile] = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
    return profile;
  }

  async createStudentProfile(profileData: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const [profile] = await db
      .insert(studentProfiles)
      .values({ ...profileData })
      .returning();
    return profile;
  }

  async updateStudentProfile(id: number, profileData: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const [profile] = await db
      .update(studentProfiles)
      .set({ ...profileData, updatedAt: new Date() })
      .where(eq(studentProfiles.id, id))
      .returning();
    return profile;
  }

  async updateCompletionPercentage(id: number, percentage: number): Promise<void> {
    await db
      .update(studentProfiles)
      .set({ completionPercentage: percentage, updatedAt: new Date() })
      .where(eq(studentProfiles.id, id));
  }

  // School operations
  async getSchool(id: number): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school;
  }

  async getSchoolsByProfileId(profileId: number): Promise<School[]> {
    return db.select().from(schools).where(eq(schools.profileId, profileId));
  }

  async createSchool(schoolData: Partial<InsertSchool>): Promise<School> {
    const [school] = await db
      .insert(schools)
      .values({ ...schoolData })
      .returning();
    return school;
  }

  async updateSchool(id: number, schoolData: Partial<InsertSchool>): Promise<School> {
    const [school] = await db
      .update(schools)
      .set(schoolData)
      .where(eq(schools.id, id))
      .returning();
    return school;
  }

  async deleteSchool(id: number): Promise<void> {
    await db.delete(schools).where(eq(schools.id, id));
  }

  async clearSchoolsByProfileId(profileId: number): Promise<void> {
    await db.delete(schools).where(eq(schools.profileId, profileId));
  }

  // Test operations
  async getTest(id: number): Promise<Test | undefined> {
    const [test] = await db.select().from(tests).where(eq(tests.id, id));
    return test;
  }

  async getTestsByProfileId(profileId: number): Promise<Test[]> {
    return db.select().from(tests).where(eq(tests.profileId, profileId));
  }

  async createTest(testData: Partial<InsertTest>): Promise<Test> {
    const [test] = await db
      .insert(tests)
      .values({ ...testData })
      .returning();
    return test;
  }

  async updateTest(id: number, testData: Partial<InsertTest>): Promise<Test> {
    const [test] = await db
      .update(tests)
      .set(testData)
      .where(eq(tests.id, id))
      .returning();
    return test;
  }

  async deleteTest(id: number): Promise<void> {
    await db.delete(tests).where(eq(tests.id, id));
  }

  async clearTestsByProfileId(profileId: number): Promise<void> {
    await db.delete(tests).where(eq(tests.profileId, profileId));
  }

  // Work experience operations
  async getWorkExperience(id: number): Promise<WorkExperience | undefined> {
    const [workExp] = await db.select().from(workExperiences).where(eq(workExperiences.id, id));
    return workExp;
  }

  async getWorkExperiencesByProfileId(profileId: number): Promise<WorkExperience[]> {
    return db.select().from(workExperiences).where(eq(workExperiences.profileId, profileId));
  }

  async createWorkExperience(workExpData: Partial<InsertWorkExperience>): Promise<WorkExperience> {
    const [workExp] = await db
      .insert(workExperiences)
      .values({ ...workExpData })
      .returning();
    return workExp;
  }

  async updateWorkExperience(id: number, workExpData: Partial<InsertWorkExperience>): Promise<WorkExperience> {
    const [workExp] = await db
      .update(workExperiences)
      .set(workExpData)
      .where(eq(workExperiences.id, id))
      .returning();
    return workExp;
  }

  async deleteWorkExperience(id: number): Promise<void> {
    await db.delete(workExperiences).where(eq(workExperiences.id, id));
  }

  async clearWorkExperiencesByProfileId(profileId: number): Promise<void> {
    await db.delete(workExperiences).where(eq(workExperiences.profileId, profileId));
  }

  // University operations
  async getUniversity(id: number): Promise<University | undefined> {
    const [university] = await db.select().from(universities).where(eq(universities.id, id));
    return university;
  }

  async getUniversities(
    limit: number = 20,
    offset: number = 0,
    filters?: { country?: string; name?: string }
  ): Promise<University[]> {
    // Start with empty conditions array
    let conditions: any[] = [];
    
    // Add filters if provided
    if (filters) {
      if (filters.country) {
        conditions.push(eq(universities.country, filters.country));
      }
      if (filters.name) {
        conditions.push(ilike(universities.name, `%${filters.name}%`));
      }
    }
    
    // Execute query with conditions if any exist
    if (conditions.length > 0) {
      return db
        .select()
        .from(universities)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(universities.name);
    } else {
      return db
        .select()
        .from(universities)
        .limit(limit)
        .offset(offset)
        .orderBy(universities.name);
    }
  }

  async getUniversityCount(filters?: { country?: string; name?: string }): Promise<number> {
    // Start with empty conditions array
    let conditions: any[] = [];
    
    // Add filters if provided
    if (filters) {
      if (filters.country) {
        conditions.push(eq(universities.country, filters.country));
      }
      if (filters.name) {
        conditions.push(ilike(universities.name, `%${filters.name}%`));
      }
    }
    
    // Execute query with conditions if any exist
    const query = db.select({ count: sql<number>`count(*)` }).from(universities);
    
    if (conditions.length > 0) {
      const [result] = await query.where(and(...conditions));
      return result?.count || 0;
    } else {
      const [result] = await query;
      return result?.count || 0;
    }
  }

  async createUniversity(universityData: Partial<InsertUniversity>): Promise<University> {
    const [university] = await db
      .insert(universities)
      .values({ ...universityData })
      .returning();
    return university;
  }

  async updateUniversity(id: number, universityData: Partial<InsertUniversity>): Promise<University> {
    const [university] = await db
      .update(universities)
      .set({ ...universityData, updatedAt: new Date() })
      .where(eq(universities.id, id))
      .returning();
    return university;
  }

  async deleteUniversity(id: number): Promise<void> {
    await db.delete(universities).where(eq(universities.id, id));
  }

  // Program operations
  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async getProgramsByUniversity(
    universityId: number,
    limit: number = 20,
    offset: number = 0,
    filters?: { level?: string; discipline?: string; degree?: string; name?: string }
  ): Promise<Program[]> {
    // Start with the base query
    let conditions = [eq(programs.universityId, universityId)];
    
    // Add filter conditions
    if (filters) {
      if (filters.level) {
        conditions.push(eq(programs.level, filters.level));
      }
      if (filters.discipline) {
        conditions.push(eq(programs.discipline, filters.discipline));
      }
      if (filters.degree) {
        conditions.push(eq(programs.degree, filters.degree));
      }
      if (filters.name) {
        conditions.push(ilike(programs.name, `%${filters.name}%`));
      }
    }
    
    // Execute the query with all conditions
    return db
      .select()
      .from(programs)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(programs.name);
  }

  async getProgramCount(
    universityId?: number,
    filters?: { level?: string; discipline?: string; degree?: string; name?: string }
  ): Promise<number> {
    // Start with empty conditions array
    let conditions: any[] = [];
    
    // Add university filter if provided
    if (universityId) {
      conditions.push(eq(programs.universityId, universityId));
    }
    
    // Add additional filters if provided
    if (filters) {
      if (filters.level) {
        conditions.push(eq(programs.level, filters.level));
      }
      if (filters.discipline) {
        conditions.push(eq(programs.discipline, filters.discipline));
      }
      if (filters.degree) {
        conditions.push(eq(programs.degree, filters.degree));
      }
      if (filters.name) {
        conditions.push(ilike(programs.name, `%${filters.name}%`));
      }
    }
    
    // Execute query with all conditions
    const query = db.select({ count: sql<number>`count(*)` }).from(programs);
    
    // Only add where clause if there are conditions
    if (conditions.length > 0) {
      const [result] = await query.where(and(...conditions));
      return result?.count || 0;
    } else {
      const [result] = await query;
      return result?.count || 0;
    }
  }

  async createProgram(programData: Partial<InsertProgram>): Promise<Program> {
    const [program] = await db
      .insert(programs)
      .values({ ...programData })
      .returning();
    return program;
  }

  async updateProgram(id: number, programData: Partial<InsertProgram>): Promise<Program> {
    const [program] = await db
      .update(programs)
      .set({ ...programData, updatedAt: new Date() })
      .where(eq(programs.id, id))
      .returning();
    return program;
  }

  async deleteProgram(id: number): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByStudent(studentId: number): Promise<Application[]> {
    return db.select().from(applications).where(eq(applications.studentId, studentId));
  }

  async createApplication(applicationData: Partial<InsertApplication>): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values({ ...applicationData })
      .returning();
    return application;
  }

  async updateApplication(id: number, applicationData: Partial<InsertApplication>): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set({ ...applicationData, lastUpdated: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }

  async deleteApplication(id: number): Promise<void> {
    await db.delete(applications).where(eq(applications.id, id));
  }

  // Application Document operations
  async getApplicationDocument(id: number): Promise<ApplicationDocument | undefined> {
    const [document] = await db.select().from(applicationDocuments).where(eq(applicationDocuments.id, id));
    return document;
  }

  async getApplicationDocumentsByApplication(applicationId: number): Promise<ApplicationDocument[]> {
    return db.select().from(applicationDocuments).where(eq(applicationDocuments.applicationId, applicationId));
  }

  async createApplicationDocument(documentData: Partial<InsertApplicationDocument>): Promise<ApplicationDocument> {
    const [document] = await db
      .insert(applicationDocuments)
      .values({ ...documentData })
      .returning();
    return document;
  }

  async updateApplicationDocument(id: number, documentData: Partial<InsertApplicationDocument>): Promise<ApplicationDocument> {
    const [document] = await db
      .update(applicationDocuments)
      .set(documentData)
      .where(eq(applicationDocuments.id, id))
      .returning();
    return document;
  }

  async deleteApplicationDocument(id: number): Promise<void> {
    await db.delete(applicationDocuments).where(eq(applicationDocuments.id, id));
  }
  
  // Profile Document operations
  async getProfileDocuments(profileId: number): Promise<any[]> {
    try {
      console.log(`Getting profile documents for profile ID: ${profileId}`);
      // In a real implementation, this would query the database
      // For demonstration, return an empty array
      return [];
    } catch (error) {
      console.error("Error in getProfileDocuments:", error);
      throw error;
    }
  }
  
  async createProfileDocument(document: any): Promise<any> {
    try {
      console.log(`Creating profile document:`, document);
      // In a real implementation, this would insert into the database
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        ...document,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error in createProfileDocument:", error);
      throw error;
    }
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();
