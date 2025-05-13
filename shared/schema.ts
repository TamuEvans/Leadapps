import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar, date } from "drizzle-orm/pg-core";
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
export type InsertApplicationDocument = z.infer<typeof insertApplicationDocumentSchema>;

export type University = typeof universities.$inferSelect;
export type Program = typeof programs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type ApplicationDocument = typeof applicationDocuments.$inferSelect;
