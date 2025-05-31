import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define common constants used in forms

// Countries
export const COUNTRIES = [
  { code: "af", name: "Afghanistan" },
  { code: "al", name: "Albania" },
  { code: "dz", name: "Algeria" },
  { code: "ad", name: "Andorra" },
  { code: "ao", name: "Angola" },
  { code: "ag", name: "Antigua and Barbuda" },
  { code: "ar", name: "Argentina" },
  { code: "am", name: "Armenia" },
  { code: "au", name: "Australia" },
  { code: "at", name: "Austria" },
  { code: "az", name: "Azerbaijan" },
  { code: "bs", name: "Bahamas" },
  { code: "bh", name: "Bahrain" },
  { code: "bd", name: "Bangladesh" },
  { code: "bb", name: "Barbados" },
  { code: "by", name: "Belarus" },
  { code: "be", name: "Belgium" },
  { code: "bz", name: "Belize" },
  { code: "bj", name: "Benin" },
  { code: "bt", name: "Bhutan" },
  { code: "bo", name: "Bolivia" },
  { code: "ba", name: "Bosnia and Herzegovina" },
  { code: "bw", name: "Botswana" },
  { code: "br", name: "Brazil" },
  { code: "bn", name: "Brunei" },
  { code: "bg", name: "Bulgaria" },
  { code: "bf", name: "Burkina Faso" },
  { code: "bi", name: "Burundi" },
  { code: "cv", name: "Cabo Verde" },
  { code: "kh", name: "Cambodia" },
  { code: "cm", name: "Cameroon" },
  { code: "ca", name: "Canada" },
  { code: "cf", name: "Central African Republic" },
  { code: "td", name: "Chad" },
  { code: "cl", name: "Chile" },
  { code: "cn", name: "China" },
  { code: "co", name: "Colombia" },
  { code: "km", name: "Comoros" },
  { code: "cg", name: "Congo" },
  { code: "cd", name: "Democratic Republic of the Congo" },
  { code: "cr", name: "Costa Rica" },
  { code: "ci", name: "Côte d'Ivoire" },
  { code: "hr", name: "Croatia" },
  { code: "cu", name: "Cuba" },
  { code: "cy", name: "Cyprus" },
  { code: "cz", name: "Czech Republic" },
  { code: "dk", name: "Denmark" },
  { code: "dj", name: "Djibouti" },
  { code: "dm", name: "Dominica" },
  { code: "do", name: "Dominican Republic" },
  { code: "ec", name: "Ecuador" },
  { code: "eg", name: "Egypt" },
  { code: "sv", name: "El Salvador" },
  { code: "gq", name: "Equatorial Guinea" },
  { code: "er", name: "Eritrea" },
  { code: "ee", name: "Estonia" },
  { code: "sz", name: "Eswatini" },
  { code: "et", name: "Ethiopia" },
  { code: "fj", name: "Fiji" },
  { code: "fi", name: "Finland" },
  { code: "fr", name: "France" },
  { code: "ga", name: "Gabon" },
  { code: "gm", name: "Gambia" },
  { code: "ge", name: "Georgia" },
  { code: "de", name: "Germany" },
  { code: "gh", name: "Ghana" },
  { code: "gr", name: "Greece" },
  { code: "gd", name: "Grenada" },
  { code: "gt", name: "Guatemala" },
  { code: "gn", name: "Guinea" },
  { code: "gw", name: "Guinea-Bissau" },
  { code: "gy", name: "Guyana" },
  { code: "ht", name: "Haiti" },
  { code: "hn", name: "Honduras" },
  { code: "hu", name: "Hungary" },
  { code: "is", name: "Iceland" },
  { code: "in", name: "India" },
  { code: "id", name: "Indonesia" },
  { code: "ir", name: "Iran" },
  { code: "iq", name: "Iraq" },
  { code: "ie", name: "Ireland" },
  { code: "il", name: "Israel" },
  { code: "it", name: "Italy" },
  { code: "jm", name: "Jamaica" },
  { code: "jp", name: "Japan" },
  { code: "jo", name: "Jordan" },
  { code: "kz", name: "Kazakhstan" },
  { code: "ke", name: "Kenya" },
  { code: "ki", name: "Kiribati" },
  { code: "kp", name: "North Korea" },
  { code: "kr", name: "South Korea" },
  { code: "kw", name: "Kuwait" },
  { code: "kg", name: "Kyrgyzstan" },
  { code: "la", name: "Laos" },
  { code: "lv", name: "Latvia" },
  { code: "lb", name: "Lebanon" },
  { code: "ls", name: "Lesotho" },
  { code: "lr", name: "Liberia" },
  { code: "ly", name: "Libya" },
  { code: "li", name: "Liechtenstein" },
  { code: "lt", name: "Lithuania" },
  { code: "lu", name: "Luxembourg" },
  { code: "mg", name: "Madagascar" },
  { code: "mw", name: "Malawi" },
  { code: "my", name: "Malaysia" },
  { code: "mv", name: "Maldives" },
  { code: "ml", name: "Mali" },
  { code: "mt", name: "Malta" },
  { code: "mh", name: "Marshall Islands" },
  { code: "mr", name: "Mauritania" },
  { code: "mu", name: "Mauritius" },
  { code: "mx", name: "Mexico" },
  { code: "fm", name: "Micronesia" },
  { code: "md", name: "Moldova" },
  { code: "mc", name: "Monaco" },
  { code: "mn", name: "Mongolia" },
  { code: "me", name: "Montenegro" },
  { code: "ma", name: "Morocco" },
  { code: "mz", name: "Mozambique" },
  { code: "mm", name: "Myanmar" },
  { code: "na", name: "Namibia" },
  { code: "nr", name: "Nauru" },
  { code: "np", name: "Nepal" },
  { code: "nl", name: "Netherlands" },
  { code: "nz", name: "New Zealand" },
  { code: "ni", name: "Nicaragua" },
  { code: "ne", name: "Niger" },
  { code: "ng", name: "Nigeria" },
  { code: "mk", name: "North Macedonia" },
  { code: "no", name: "Norway" },
  { code: "om", name: "Oman" },
  { code: "pk", name: "Pakistan" },
  { code: "pw", name: "Palau" },
  { code: "ps", name: "Palestine" },
  { code: "pa", name: "Panama" },
  { code: "pg", name: "Papua New Guinea" },
  { code: "py", name: "Paraguay" },
  { code: "pe", name: "Peru" },
  { code: "ph", name: "Philippines" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "pr", name: "Puerto Rico" },
  { code: "qa", name: "Qatar" },
  { code: "ro", name: "Romania" },
  { code: "ru", name: "Russia" },
  { code: "rw", name: "Rwanda" },
  { code: "kn", name: "Saint Kitts and Nevis" },
  { code: "lc", name: "Saint Lucia" },
  { code: "vc", name: "Saint Vincent and the Grenadines" },
  { code: "ws", name: "Samoa" },
  { code: "sm", name: "San Marino" },
  { code: "st", name: "Sao Tome and Principe" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "sn", name: "Senegal" },
  { code: "rs", name: "Serbia" },
  { code: "sc", name: "Seychelles" },
  { code: "sl", name: "Sierra Leone" },
  { code: "sg", name: "Singapore" },
  { code: "sk", name: "Slovakia" },
  { code: "si", name: "Slovenia" },
  { code: "sb", name: "Solomon Islands" },
  { code: "so", name: "Somalia" },
  { code: "za", name: "South Africa" },
  { code: "ss", name: "South Sudan" },
  { code: "es", name: "Spain" },
  { code: "lk", name: "Sri Lanka" },
  { code: "sd", name: "Sudan" },
  { code: "sr", name: "Suriname" },
  { code: "se", name: "Sweden" },
  { code: "ch", name: "Switzerland" },
  { code: "sy", name: "Syria" },
  { code: "tj", name: "Tajikistan" },
  { code: "tz", name: "Tanzania" },
  { code: "th", name: "Thailand" },
  { code: "tl", name: "Timor-Leste" },
  { code: "tg", name: "Togo" },
  { code: "to", name: "Tonga" },
  { code: "tt", name: "Trinidad and Tobago" },
  { code: "tn", name: "Tunisia" },
  { code: "tr", name: "Turkey" },
  { code: "tm", name: "Turkmenistan" },
  { code: "tv", name: "Tuvalu" },
  { code: "ug", name: "Uganda" },
  { code: "ua", name: "Ukraine" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "gb", name: "United Kingdom" },
  { code: "us", name: "United States" },
  { code: "uy", name: "Uruguay" },
  { code: "uz", name: "Uzbekistan" },
  { code: "vu", name: "Vanuatu" },
  { code: "va", name: "Vatican City" },
  { code: "ve", name: "Venezuela" },
  { code: "vn", name: "Vietnam" },
  { code: "ye", name: "Yemen" },
  { code: "zm", name: "Zambia" },
  { code: "zw", name: "Zimbabwe" },
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
  { value: "csec", label: "CSEC" },
  { value: "cape", label: "CAPE" },
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
