import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define common constants used in forms

// Countries
export const COUNTRIES = [
  { code: "jm", name: "Jamaica" },
  { code: "bb", name: "Barbados" },
  { code: "tt", name: "Trinidad and Tobago" },
  { code: "us", name: "United States" },
  { code: "ca", name: "Canada" },
  { code: "uk", name: "United Kingdom" },
  { code: "au", name: "Australia" },
  { code: "bs", name: "Bahamas" },
  { code: "gd", name: "Grenada" },
  { code: "lc", name: "Saint Lucia" },
  { code: "vc", name: "Saint Vincent and the Grenadines" },
  { code: "dm", name: "Dominica" },
  { code: "ag", name: "Antigua and Barbuda" },
  { code: "kn", name: "Saint Kitts and Nevis" },
  { code: "do", name: "Dominican Republic" },
  { code: "ht", name: "Haiti" },
  { code: "cu", name: "Cuba" },
  { code: "pr", name: "Puerto Rico" },
];

// Languages
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "pt", name: "Portuguese" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
  { code: "it", name: "Italian" },
  { code: "nl", name: "Dutch" },
  { code: "other", name: "Other" },
];

// Education Levels
export const EDUCATION_LEVELS = [
  { value: "highschool", label: "High School" },
  { value: "associates", label: "Associate's Degree" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate" },
  { value: "professional", label: "Professional Degree" },
  { value: "certificate", label: "Certificate Program" },
  { value: "other", label: "Other" },
];

// Study Levels
export const STUDY_LEVELS = [
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma" },
  { value: "associates", label: "Associate's Degree" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "postgraduate", label: "Postgraduate Diploma" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate" },
  { value: "professional", label: "Professional Degree" },
];

// Study Terms
export const STUDY_TERMS = [
  { value: "fall", label: "Fall (September)" },
  { value: "winter", label: "Winter (January)" },
  { value: "spring", label: "Spring (May)" },
  { value: "summer", label: "Summer (July)" },
];

// Grading Schemes
export const GRADING_SCHEMES = [
  { value: "gpa4", label: "GPA (4.0 scale)" },
  { value: "percentage", label: "Percentage" },
  { value: "letter", label: "Letter Grade (A-F)" },
  { value: "cxc", label: "CXC Grades" },
  { value: "cape", label: "CAPE Grades" },
  { value: "other", label: "Other" },
];

// Grades
export const GRADES = [
  { value: "A", label: "A (90-100%)" },
  { value: "B", label: "B (80-89%)" },
  { value: "C", label: "C (70-79%)" },
  { value: "D", label: "D (60-69%)" },
  { value: "F", label: "F (Below 60%)" },
  { value: "Pass", label: "Pass" },
  { value: "Merit", label: "Merit" },
  { value: "Distinction", label: "Distinction" },
  { value: "other", label: "Other" },
];

// Standardized Tests
export const STANDARDIZED_TESTS = [
  { value: "sat", label: "SAT" },
  { value: "act", label: "ACT" },
  { value: "gre", label: "GRE" },
  { value: "gmat", label: "GMAT" },
  { value: "toefl", label: "TOEFL" },
  { value: "ielts", label: "IELTS" },
  { value: "csec", label: "CSEC (CXC)" },
  { value: "cape", label: "CAPE" },
  { value: "a_levels", label: "A-Levels" },
  { value: "o_levels", label: "O-Levels" },
  { value: "lsat", label: "LSAT" },
  { value: "mcat", label: "MCAT" },
  { value: "other", label: "Other" },
];

// Format a date string (YYYY-MM-DD) to a more readable format
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
}

// Calculate age from date of birth
export function calculateAge(dateOfBirthString: string | undefined): number | null {
  if (!dateOfBirthString) return null;
  
  try {
    const dob = new Date(dateOfBirthString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    return null;
  }
}

// Format phone number to standard format: (XXX) XXX-XXXX
export function formatPhoneNumber(phoneNumber: string | undefined): string {
  if (!phoneNumber) return "";
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Check if the number has the right length for formatting
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  // Return original if unable to format
  return phoneNumber;
}

// Get name of country by code
export function getCountryName(countryCode: string | undefined): string {
  if (!countryCode) return "";
  
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country ? country.name : countryCode;
}

// Get name of language by code
export function getLanguageName(languageCode: string | undefined): string {
  if (!languageCode) return "";
  
  const language = LANGUAGES.find(l => l.code === languageCode);
  return language ? language.name : languageCode;
}
