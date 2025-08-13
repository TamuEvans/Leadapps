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
  sessions,
  passwordResets,
  emailVerifications,
  type User, 
  type StudentProfile, 
  type School, 
  type Test, 
  type WorkExperience,
  type University,
  type Program,
  type Application,
  type ApplicationDocument,
  type Session,
  type PasswordReset,
  type EmailVerification,
  type InsertUser, 
  type InsertStudentProfile, 
  type InsertSchool, 
  type InsertTest, 
  type InsertWorkExperience,
  type InsertUniversity,
  type InsertProgram,
  type InsertApplication,
  type InsertApplicationDocument
} from "../shared/schema";
import { db } from './db';
import { eq, and, desc, isNotNull, sql, like, ilike, lt } from 'drizzle-orm';

// Simplified interface for core functionality
export interface IMinimalStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  // Session operations
  createSession(userId: number, token: string, expiresAt: Date): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | null>;
  deleteSession(token: string): Promise<void>;
  
  // Password reset operations
  createPasswordReset(email: string, token: string, expiresAt: Date): Promise<void>;
  getPasswordReset(token: string): Promise<PasswordReset | undefined>;
  markPasswordResetUsed(token: string): Promise<void>;
  
  // Email verification operations
  createEmailVerification(userId: number, token: string, expiresAt: Date): Promise<void>;
  getEmailVerification(token: string): Promise<EmailVerification | undefined>;
  markEmailVerified(token: string): Promise<void>;
  
  // Profile-related operations
  getSchoolsByProfileId(profileId: number): Promise<School[]>;
  getTestsByProfileId(profileId: number): Promise<Test[]>;
  getWorkExperiencesByProfileId(profileId: number): Promise<WorkExperience[]>;
  clearSchoolsByProfileId(profileId: number): Promise<void>;
  clearTestsByProfileId(profileId: number): Promise<void>;
  clearWorkExperiencesByProfileId(profileId: number): Promise<void>;
  createSchool(school: InsertSchool): Promise<School>;
  createTest(test: InsertTest): Promise<Test>;
  createWorkExperience(workExperience: InsertWorkExperience): Promise<WorkExperience>;
  updateCompletionPercentage(profileId: number): Promise<void>;
  
  // Admin/Stats operations
  getApplicationsCount(): Promise<number>;
  getPendingApplicationsCount(): Promise<number>;
  getUsersCount(): Promise<number>;
  getRecentApplications(limit?: number): Promise<Application[]>;
  
  // Bulk operations
  bulkCreateUniversities(universities: any[]): Promise<void>;
  bulkCreatePrograms(programs: any[]): Promise<void>;
  bulkCreateApplications(applications: any[]): Promise<void>;
  
  // Extended operations
  getUniversities(page: number, limit: number, filters?: any): Promise<{ universities: University[], total: number }>;
  getUniversityCount(): Promise<number>;
  getProgramCount(): Promise<number>;
  getApplicationsByStudent(studentId: number): Promise<Application[]>;
  deleteApplication(id: number): Promise<void>;
  getApplicationDocumentsByApplication(applicationId: number): Promise<ApplicationDocument[]>;
  createApplicationDocument(document: InsertApplicationDocument): Promise<ApplicationDocument>;
  getProfileDocuments(profileId: number): Promise<any[]>;
  createProfileDocument(document: any): Promise<any>;
  
  // Student profile operations
  getStudentProfile(id: number): Promise<StudentProfile | undefined>;
  getStudentProfileByUserId(userId: number): Promise<StudentProfile | undefined>;
  createStudentProfile(profileData: Partial<InsertStudentProfile>): Promise<StudentProfile>;
  updateStudentProfile(id: number, profileData: Partial<InsertStudentProfile>): Promise<StudentProfile>;

  // University and program operations
  getAllUniversities(): Promise<University[]>;
  getUniversity(id: number): Promise<University | undefined>;
  searchUniversities(searchTerm: string): Promise<University[]>;
  
  getAllPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  getProgramsByUniversity(universityId: number): Promise<Program[]>;
  searchPrograms(searchTerm: string): Promise<Program[]>;

  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByUser(userId: number): Promise<Application[]>;
  createApplication(applicationData: InsertApplication): Promise<Application>;
  updateApplication(id: number, applicationData: Partial<InsertApplication>): Promise<Application>;
}

// Minimal database storage implementation
export class MinimalDatabaseStorage implements IMinimalStorage {
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
  async createSession(userId: number, token: string, expiresAt: Date): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values({ userId, token, expiresAt })
      .returning();
    return session;
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token));
    return session || null;
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
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
      .values({ ...profileData, userId: profileData.userId! })
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

  // University operations
  async getAllUniversities(): Promise<University[]> {
    return await db.select().from(universities).orderBy(universities.name);
  }

  async getUniversity(id: number): Promise<University | undefined> {
    const [university] = await db.select().from(universities).where(eq(universities.id, id));
    return university;
  }

  async searchUniversities(searchTerm: string): Promise<University[]> {
    return await db
      .select()
      .from(universities)
      .where(ilike(universities.name, `%${searchTerm}%`))
      .orderBy(universities.name);
  }

  // Program operations  
  async getAllPrograms(): Promise<Program[]> {
    return await db.select().from(programs).orderBy(programs.name);
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async getProgramsByUniversity(universityId: number): Promise<Program[]> {
    return await db
      .select()
      .from(programs)
      .where(eq(programs.universityId, universityId))
      .orderBy(programs.name);
  }

  async searchPrograms(searchTerm: string): Promise<Program[]> {
    return await db
      .select()
      .from(programs)
      .where(ilike(programs.name, `%${searchTerm}%`))
      .orderBy(programs.name);
  }

  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByUser(userId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.studentId, userId))
      .orderBy(desc(applications.createdAt));
  }

  async createApplication(applicationData: InsertApplication): Promise<Application> {
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

  // Password reset operations
  async createPasswordReset(email: string, token: string, expiresAt: Date): Promise<void> {
    await db.insert(passwordResets).values({ email, token, expiresAt });
  }

  async getPasswordReset(token: string): Promise<PasswordReset | undefined> {
    const [reset] = await db
      .select()
      .from(passwordResets)
      .where(and(eq(passwordResets.token, token), eq(passwordResets.used, false)));
    return reset;
  }

  async markPasswordResetUsed(token: string): Promise<void> {
    await db
      .update(passwordResets)
      .set({ used: true })
      .where(eq(passwordResets.token, token));
  }

  // Email verification operations
  async createEmailVerification(userId: number, token: string, expiresAt: Date): Promise<void> {
    await db.insert(emailVerifications).values({ userId, token, expiresAt });
  }

  async getEmailVerification(token: string): Promise<EmailVerification | undefined> {
    const [verification] = await db
      .select()
      .from(emailVerifications)
      .where(and(eq(emailVerifications.token, token), eq(emailVerifications.verified, false)));
    return verification;
  }

  async markEmailVerified(token: string): Promise<void> {
    await db
      .update(emailVerifications)
      .set({ verified: true })
      .where(eq(emailVerifications.token, token));
  }

  // Profile-related operations
  async getSchoolsByProfileId(profileId: number): Promise<School[]> {
    return await db
      .select()
      .from(schools)
      .where(eq(schools.profileId, profileId));
  }

  async getTestsByProfileId(profileId: number): Promise<Test[]> {
    return await db
      .select()
      .from(tests)
      .where(eq(tests.profileId, profileId));
  }

  async getWorkExperiencesByProfileId(profileId: number): Promise<WorkExperience[]> {
    return await db
      .select()
      .from(workExperiences)
      .where(eq(workExperiences.profileId, profileId));
  }

  async clearSchoolsByProfileId(profileId: number): Promise<void> {
    await db
      .delete(schools)
      .where(eq(schools.profileId, profileId));
  }

  async clearTestsByProfileId(profileId: number): Promise<void> {
    await db
      .delete(tests)
      .where(eq(tests.profileId, profileId));
  }

  async clearWorkExperiencesByProfileId(profileId: number): Promise<void> {
    await db
      .delete(workExperiences)
      .where(eq(workExperiences.profileId, profileId));
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const [created] = await db
      .insert(schools)
      .values(school)
      .returning();
    return created;
  }

  async createTest(test: InsertTest): Promise<Test> {
    const [created] = await db
      .insert(tests)
      .values(test)
      .returning();
    return created;
  }

  async createWorkExperience(workExperience: InsertWorkExperience): Promise<WorkExperience> {
    const [created] = await db
      .insert(workExperiences)
      .values(workExperience)
      .returning();
    return created;
  }

  async updateCompletionPercentage(profileId: number): Promise<void> {
    // Simple completion calculation based on required fields
    const profile = await this.getStudentProfile(profileId);
    if (!profile) return;
    
    let completed = 0;
    let total = 5; // Basic fields count
    
    if (profile.firstName) completed++;
    if (profile.lastName) completed++;
    if (profile.dateOfBirth) completed++;
    if (profile.countryOfCitizenship) completed++;
    if (profile.primaryLanguage) completed++;
    
    const percentage = Math.round((completed / total) * 100);
    await this.updateStudentProfile(profileId, { completionPercentage: percentage });
  }

  // Admin/Stats operations
  async getApplicationsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications);
    return result[0]?.count || 0;
  }

  async getPendingApplicationsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(eq(applications.status, 'pending_review'));
    return result[0]?.count || 0;
  }

  async getUsersCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    return result[0]?.count || 0;
  }

  async getRecentApplications(limit: number = 10): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt))
      .limit(limit);
  }

  // Bulk operations (simplified implementations)
  async bulkCreateUniversities(universitiesData: any[]): Promise<void> {
    if (universitiesData.length === 0) return;
    await db.insert(universities).values(universitiesData);
  }

  async bulkCreatePrograms(programsData: any[]): Promise<void> {
    if (programsData.length === 0) return;
    await db.insert(programs).values(programsData);
  }

  async bulkCreateApplications(applicationsData: any[]): Promise<void> {
    if (applicationsData.length === 0) return;
    await db.insert(applications).values(applicationsData);
  }

  // Extended operations
  async getUniversities(page: number, limit: number, filters?: any): Promise<{ universities: University[], total: number }> {
    const offset = (page - 1) * limit;
    const universitiesResult = await db
      .select()
      .from(universities)
      .limit(limit)
      .offset(offset);
    
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(universities);
    
    return {
      universities: universitiesResult,
      total: totalResult[0]?.count || 0
    };
  }

  async getUniversityCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(universities);
    return result[0]?.count || 0;
  }

  async getProgramCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(programs);
    return result[0]?.count || 0;
  }

  async getApplicationsByStudent(studentId: number): Promise<Application[]> {
    return this.getApplicationsByUser(studentId);
  }

  async deleteApplication(id: number): Promise<void> {
    await db
      .delete(applications)
      .where(eq(applications.id, id));
  }

  async getApplicationDocumentsByApplication(applicationId: number): Promise<ApplicationDocument[]> {
    return await db
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, applicationId));
  }

  async createApplicationDocument(document: InsertApplicationDocument): Promise<ApplicationDocument> {
    const [created] = await db
      .insert(applicationDocuments)
      .values(document)
      .returning();
    return created;
  }

  async getProfileDocuments(profileId: number): Promise<any[]> {
    // Return empty array for now as profile documents might be in a separate table
    return [];
  }

  async createProfileDocument(document: any): Promise<any> {
    // Simplified implementation - would need profile documents table
    return document;
  }
}

// Create and export storage instance
export const minimalStorage = new MinimalDatabaseStorage();