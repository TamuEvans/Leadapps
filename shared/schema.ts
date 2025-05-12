import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User account table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
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
