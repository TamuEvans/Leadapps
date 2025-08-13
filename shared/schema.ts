import { pgTable, text, serial, integer, boolean, jsonb, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User account table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  password: text("password"),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  googleId: text("google_id").unique(),
  facebookId: text("facebook_id").unique(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Session storage for authentication
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Student profile table
export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  
  // Personal Information
  firstName: text("first_name"),
  middleName: text("middle_name"),
  lastName: text("last_name"),
  preferredName: text("preferred_name"),
  dateOfBirth: text("date_of_birth"),
  primaryLanguage: text("primary_language"),
  countryOfCitizenship: text("country_of_citizenship"),
  countryOfBirth: text("country_of_birth"),
  passportNumber: text("passport_number"),
  passportExpiryDate: text("passport_expiry_date"),
  passportIssuingCountry: text("passport_issuing_country"),
  maritalStatus: text("marital_status"),
  gender: text("gender"),
  profilePicture: text("profile_picture"),
  
  // Address Details
  address1: text("address1"),
  address2: text("address2"),
  city: text("city"),
  province: text("province"),
  country: text("country"),
  postalCode: text("postal_code"),
  permanentAddressDifferent: boolean("permanent_address_different").default(false),
  permanentAddress1: text("permanent_address1"),
  permanentAddress2: text("permanent_address2"),
  permanentCity: text("permanent_city"),
  permanentProvince: text("permanent_province"),
  permanentCountry: text("permanent_country"),
  permanentPostalCode: text("permanent_postal_code"),
  alternativeEmail: text("alternative_email"),
  phoneCountryCode: text("phone_country_code"),
  phoneNumber: text("phone_number"),
  alternativePhoneCountryCode: text("alternative_phone_country_code"),
  alternativePhoneNumber: text("alternative_phone_number"),
  
  // Academic Goals & Preferences
  intendedFieldsOfStudy: text("intended_fields_of_study"),
  preferredStudyLevel: text("preferred_study_level"),
  expectedStartTerm: text("expected_start_term"),
  expectedStartYear: text("expected_start_year"),
  preferredStudyDestinations: text("preferred_study_destinations"),
  onlineLearningInterest: text("online_learning_interest"),
  fundingSources: jsonb("funding_sources").array(),
  scholarshipInterest: text("scholarship_interest"),
  
  // Education Background
  educationCountry: text("education_country"),
  highestEducationLevel: text("highest_education_level"),
  gradingScheme: text("grading_scheme"),
  overallGrade: text("overall_grade"),
  
  // English Proficiency
  isEnglishFirstLanguage: text("is_english_first_language"),
  hasEnglishProficiencyTest: text("has_english_proficiency_test"),
  
  // Progress tracking
  completionPercentage: integer("completion_percentage").default(0),
  
  // Timestamps
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schools attended table
export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => studentProfiles.id).notNull(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  level: text("level").notNull(),
  degree: text("degree").notNull(),
  major: text("major"),
  fromDate: text("from_date").notNull(),
  toDate: text("to_date"),
  currentlyAttending: boolean("currently_attending").default(false),
  graduationDate: text("graduation_date").notNull(),
  transcriptUrl: text("transcript_url"),
});

// Test scores table
export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => studentProfiles.id).notNull(),
  testName: text("test_name").notNull(),
  score: text("score").notNull(),
  dateTaken: text("date_taken").notNull(),
  scoreReportUrl: text("score_report_url"),
});

// Work experience table
export const workExperiences = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => studentProfiles.id).notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  current: boolean("current").default(false),
  description: text("description"),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertStudentProfileSchema = createInsertSchema(studentProfiles).omit({ id: true, updatedAt: true });
export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true });
export const insertTestSchema = createInsertSchema(tests).omit({ id: true });
export const insertWorkExperienceSchema = createInsertSchema(workExperiences).omit({ id: true });

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertTest = z.infer<typeof insertTestSchema>;
export type InsertWorkExperience = z.infer<typeof insertWorkExperienceSchema>;

export type User = typeof users.$inferSelect;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type School = typeof schools.$inferSelect;
export type Test = typeof tests.$inferSelect;
export type WorkExperience = typeof workExperiences.$inferSelect;
export type Session = typeof sessions.$inferSelect;

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// University API Integration

// Application statuses as a constant
export const APPLICATION_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PENDING_REVIEW: 'pending_review',
  UNDER_REVIEW: 'under_review',
  ADDITIONAL_DOCUMENTS_REQUIRED: 'additional_documents_required',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
  DEFERRED: 'deferred',
  WITHDRAWN: 'withdrawn'
} as const;

// Universities table
export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"),
  description: text("description"),
  acceptsDirectApplications: boolean("accepts_direct_applications").default(false),
  applicationFee: integer("application_fee"),
  applicationDeadlines: jsonb("application_deadlines"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// University Programs table 
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  universityId: integer("university_id").references(() => universities.id).notNull(),
  name: text("name").notNull(),
  degree: text("degree").notNull(),
  level: text("level").notNull(),
  discipline: text("discipline").notNull(),
  duration: text("duration"),
  tuitionFee: integer("tuition_fee"),
  currency: text("currency").default("USD"),
  applicationDeadline: date("application_deadline"),
  startDates: jsonb("start_dates").array(),
  description: text("description"),
  requirements: jsonb("requirements"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Applications table - tracks applications to universities/programs
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => studentProfiles.id).notNull(),
  programId: integer("program_id").references(() => programs.id).notNull(),
  status: text("status").default(APPLICATION_STATUSES.DRAFT).notNull(),
  submissionDate: timestamp("submission_date"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  notes: text("notes"),
  externalReferenceId: text("external_reference_id"),
  additionalDocuments: jsonb("additional_documents").array(),
  applicationData: jsonb("application_data"),
  feedback: text("feedback"),
  intakePeriod: text("intake_period"),
  intakeYear: integer("intake_year"),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Application Documents table
export const applicationDocuments = pgTable("application_documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  documentType: text("document_type").notNull(),
  documentUrl: text("document_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  status: text("status").default("pending"),
  notes: text("notes"),
});

// Create insert schemas for the new tables
export const insertUniversitySchema = createInsertSchema(universities, {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined
});

export const insertProgramSchema = createInsertSchema(programs, {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined
});

export const insertApplicationSchema = createInsertSchema(applications, {
  id: undefined,
  createdAt: undefined
});

export const insertApplicationDocumentSchema = createInsertSchema(applicationDocuments, {
  id: undefined,
  uploadedAt: undefined
});

// Define types for the new tables
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type University = typeof universities.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Application = typeof applications.$inferSelect;

// Password Reset table
export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email Verification table
export const emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Counselors table
export const counselors = pgTable("counselors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  displayName: text("display_name").notNull(),
  specialties: text("specialties").array(),
  destinationMarkets: text("destination_markets").array(),
  location: text("location"),
  gender: text("gender"),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  hourlyRate: integer("hourly_rate"),
  currency: text("currency").default("USD"),
  rating: integer("rating").default(0),
  totalReviews: integer("total_reviews").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Counseling Sessions table
export const counselingSessions = pgTable("counseling_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  counselorId: integer("counselor_id").references(() => counselors.id).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // minutes
  status: text("status").default("scheduled"), // scheduled, completed, cancelled, no_show
  sessionType: text("session_type").default("video"), // video, phone, in_person
  meetingUrl: text("meeting_url"),
  notes: text("notes"),
  studentFeedback: text("student_feedback"),
  counselorFeedback: text("counselor_feedback"),
  rating: integer("rating"),
  paymentStatus: text("payment_status").default("pending"),
  amount: integer("amount"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Study Groups table
export const studyGroups = pgTable("study_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  examType: text("exam_type"), // CSEC, CAPE, SAT, etc.
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  maxMembers: integer("max_members").default(10),
  isPrivate: boolean("is_private").default(false),
  inviteCode: text("invite_code").unique(),
  studySchedule: jsonb("study_schedule"),
  resources: jsonb("resources").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Study Group Members table
export const studyGroupMembers = pgTable("study_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => studyGroups.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // creator, moderator, member
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Exam Prep Resources table
export const examResources = pgTable("exam_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  examType: text("exam_type").notNull(),
  subject: text("subject").notNull(),
  resourceType: text("resource_type").notNull(), // video, pdf, quiz, practice_test
  resourceUrl: text("resource_url"),
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  duration: integer("duration"), // in minutes
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  resourceId: integer("resource_id").references(() => examResources.id).notNull(),
  completed: boolean("completed").default(false),
  score: integer("score"),
  timeSpent: integer("time_spent"), // in minutes
  lastAccessed: timestamp("last_accessed").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Saved Materials table for file storage
export const savedMaterials = pgTable("saved_materials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileType: text("file_type").notNull(), // pdf, docx, image, video, etc.
  fileUrl: text("file_url"),
  fileSize: integer("file_size"), // in bytes
  category: text("category"), // notes, practice_test, tutor_session, etc.
  examType: text("exam_type"),
  subject: text("subject"),
  isLiked: boolean("is_liked").default(false),
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Security Tables

// Audit log table for security monitoring
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Rate limiting tracking
export const rateLimitTracker = pgTable("rate_limit_tracker", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(), // IP or user ID
  endpoint: text("endpoint").notNull(),
  requestCount: integer("request_count").default(1),
  windowStart: timestamp("window_start").defaultNow().notNull(),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Security incidents tracking
export const securityIncidents = pgTable("security_incidents", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // failed_login, suspicious_activity, etc.
  severity: text("severity").notNull(), // low, medium, high, critical
  userId: integer("user_id").references(() => users.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  description: text("description"),
  metadata: jsonb("metadata"),
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Enhanced Application Documents table - tracks document uploads and reviews
export const enhancedApplicationDocuments = pgTable("enhanced_application_documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  type: text("type").notNull(), // passport, transcript, etc.
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  metadata: jsonb("metadata"),
});

// Admin Users table - tracks admin/staff users with roles
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // admin, reviewer, manager
  permissions: jsonb("permissions").array(),
  department: text("department"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Application Status History - tracks all status changes
export const applicationStatusHistory = pgTable("application_status_history", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: integer("changed_by").references(() => users.id).notNull(),
  notes: text("notes"),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

// School Integration table - tracks integrations with universities
export const schoolIntegrations = pgTable("school_integrations", {
  id: serial("id").primaryKey(),
  universityId: integer("university_id").references(() => universities.id).notNull(),
  integrationType: text("integration_type").notNull(), // manual, leadenroll, direct_api
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"),
  authType: text("auth_type"), // bearer, basic, oauth
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  configuration: jsonb("configuration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define insert schemas for new tables
export const insertPasswordResetSchema = createInsertSchema(passwordResets).omit({ id: true, createdAt: true });
export const insertEmailVerificationSchema = createInsertSchema(emailVerifications).omit({ id: true, createdAt: true });
export const insertCounselorSchema = createInsertSchema(counselors).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCounselingSessionSchema = createInsertSchema(counselingSessions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertStudyGroupSchema = createInsertSchema(studyGroups).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudyGroupMemberSchema = createInsertSchema(studyGroupMembers).omit({ id: true, joinedAt: true });
export const insertExamResourceSchema = createInsertSchema(examResources).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, createdAt: true });
export const insertSavedMaterialSchema = createInsertSchema(savedMaterials).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertRateLimitTrackerSchema = createInsertSchema(rateLimitTracker).omit({ id: true, createdAt: true });
export const insertSecurityIncidentSchema = createInsertSchema(securityIncidents).omit({ id: true, createdAt: true });
export const insertEnhancedApplicationDocumentSchema = createInsertSchema(enhancedApplicationDocuments).omit({ id: true, uploadedAt: true });
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertApplicationStatusHistorySchema = createInsertSchema(applicationStatusHistory).omit({ id: true, changedAt: true });
export const insertSchoolIntegrationSchema = createInsertSchema(schoolIntegrations).omit({ id: true, createdAt: true });

// Define types for new tables
export type InsertPasswordReset = z.infer<typeof insertPasswordResetSchema>;
export type InsertEmailVerification = z.infer<typeof insertEmailVerificationSchema>;
export type InsertCounselor = z.infer<typeof insertCounselorSchema>;
export type InsertCounselingSession = z.infer<typeof insertCounselingSessionSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type InsertStudyGroup = z.infer<typeof insertStudyGroupSchema>;
export type InsertStudyGroupMember = z.infer<typeof insertStudyGroupMemberSchema>;
export type InsertExamResource = z.infer<typeof insertExamResourceSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertSavedMaterial = z.infer<typeof insertSavedMaterialSchema>;

export type PasswordReset = typeof passwordResets.$inferSelect;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type Counselor = typeof counselors.$inferSelect;
export type CounselingSession = typeof counselingSessions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type StudyGroup = typeof studyGroups.$inferSelect;
export type StudyGroupMember = typeof studyGroupMembers.$inferSelect;
export type ExamResource = typeof examResources.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type SavedMaterial = typeof savedMaterials.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type RateLimitTracker = typeof rateLimitTracker.$inferSelect;
export type SecurityIncident = typeof securityIncidents.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type InsertRateLimitTracker = z.infer<typeof insertRateLimitTrackerSchema>;
export type InsertSecurityIncident = z.infer<typeof insertSecurityIncidentSchema>;
export type InsertApplicationDocument = z.infer<typeof insertApplicationDocumentSchema>;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type InsertApplicationStatusHistory = z.infer<typeof insertApplicationStatusHistorySchema>;
export type InsertSchoolIntegration = z.infer<typeof insertSchoolIntegrationSchema>;

export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type ApplicationStatusHistory = typeof applicationStatusHistory.$inferSelect;
export type SchoolIntegration = typeof schoolIntegrations.$inferSelect;
