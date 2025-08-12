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
      .where(eq(applications.userId, userId))
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
      .set({ ...applicationData, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return application;
  }
}

// Create and export storage instance
export const minimalStorage = new MinimalDatabaseStorage();