import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, ChevronLeft, ChevronRight, Plus, Upload, FileText, FileArchive, FileCheck, File, X } from "lucide-react";
import FormSection from "@/components/FormSection";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import ProfilePicture from "@/components/ProfilePicture";
import ProfileProgress from "@/components/ProfileProgress";
import AddressForm from "@/components/AddressForm";
import SchoolEntry from "@/components/SchoolEntry";
import TestEntry from "@/components/TestEntry";
import WorkEntry from "@/components/WorkEntry";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  COUNTRIES, 
  LANGUAGES, 
  EDUCATION_LEVELS, 
  GRADING_SCHEMES, 
  GRADES,
  STUDY_LEVELS,
  STUDY_TERMS
} from "@/lib/utils";

// Define the form schema
const profileSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  primaryLanguage: z.string().min(1, "Primary language is required"),
  countryOfCitizenship: z.string().min(1, "Country of citizenship is required"),
  countryOfBirth: z.string().optional(),
  passportNumber: z.string().optional(),
  passportExpiryDate: z.string().optional(),
  passportIssuingCountry: z.string().optional(),
  maritalStatus: z.enum(["single", "married", "other"]),
  gender: z.enum(["male", "female", "prefer_not_to_say", "other"]),
  
  // Address Details
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province/State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  permanentAddressDifferent: z.boolean().default(false),
  permanentAddress1: z.string().optional(),
  permanentAddress2: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentProvince: z.string().optional(),
  permanentCountry: z.string().optional(),
  permanentPostalCode: z.string().optional(),
  email: z.string().email("Invalid email address"),
  alternativeEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneCountryCode: z.string(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  alternativePhoneCountryCode: z.string().optional(),
  alternativePhoneNumber: z.string().optional(),

  // Academic Goals & Preferences
  intendedFieldsOfStudy: z.string().min(1, "Please enter at least one field of study"),
  preferredStudyLevel: z.string().min(1, "Preferred study level is required"),
  expectedStartTerm: z.string().min(1, "Expected start term is required"),
  expectedStartYear: z.string().min(1, "Expected start year is required"),
  preferredStudyDestinations: z.string().min(1, "Please select at least one destination"),
  onlineLearningInterest: z.enum(["yes", "no", "undecided"]),
  fundingSources: z.array(z.string()).min(1, "Select at least one funding source"),
  scholarshipInterest: z.enum(["yes", "no"]),

  // Education Background
  educationCountry: z.string().min(1, "Country of education is required"),
  highestEducationLevel: z.string().min(1, "Highest education level is required"),
  gradingScheme: z.string().min(1, "Grading scheme is required"),
  overallGrade: z.string().min(1, "Overall grade is required"),
  
  // Schools (will be handled separately)
  
  // Standardized Tests & Qualifications
  isEnglishFirstLanguage: z.enum(["yes", "no"]),
  hasEnglishProficiencyTest: z.enum(["yes", "no"]).optional(),
  
  // Work Experience (will be handled separately)
});

// Type for the form values
type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileDocument {
  id: number;
  profileId: number;
  documentType: string;
  documentUrl: string;
  fileName: string;
  uploadedAt: string;
}

const StudentProfile = () => {
  const { toast } = useToast();
  const { profile, updateProfile, profileCompletionPercentage } = useProfile();
  const [, navigate] = useLocation();
  const [documents, setDocuments] = useState<ProfileDocument[]>([]);
  
  // Fetch profile documents
  useEffect(() => {
    if (profile?.id) {
      apiRequest("GET", `/api/profile/${profile.id}/documents`)
        .then(response => response.json())
        .then(data => {
          setDocuments(data);
        })
        .catch(error => {
          console.error("Error fetching profile documents:", error);
        });
    }
  }, [profile?.id]);
  
  // State for dynamic arrays
  const [schools, setSchools] = useState<number[]>([0]);
  const [tests, setTests] = useState<number[]>([]);
  const [workExperiences, setWorkExperiences] = useState<number[]>([]);
  
  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      // Load existing profile data or set defaults
      firstName: profile?.firstName || "",
      middleName: profile?.middleName || "",
      lastName: profile?.lastName || "",
      preferredName: profile?.preferredName || "",
      dateOfBirth: profile?.dateOfBirth || "",
      primaryLanguage: profile?.primaryLanguage || "",
      countryOfCitizenship: profile?.countryOfCitizenship || "",
      countryOfBirth: profile?.countryOfBirth || "",
      passportNumber: profile?.passportNumber || "",
      passportExpiryDate: profile?.passportExpiryDate || "",
      passportIssuingCountry: profile?.passportIssuingCountry || "",
      maritalStatus: profile?.maritalStatus || "single",
      gender: profile?.gender || "prefer_not_to_say",
      
      address1: profile?.address1 || "",
      address2: profile?.address2 || "",
      city: profile?.city || "",
      province: profile?.province || "",
      country: profile?.country || "",
      postalCode: profile?.postalCode || "",
      permanentAddressDifferent: profile?.permanentAddressDifferent || false,
      permanentAddress1: profile?.permanentAddress1 || "",
      permanentAddress2: profile?.permanentAddress2 || "",
      permanentCity: profile?.permanentCity || "",
      permanentProvince: profile?.permanentProvince || "",
      permanentCountry: profile?.permanentCountry || "",
      permanentPostalCode: profile?.permanentPostalCode || "",
      email: profile?.email || "",
      alternativeEmail: profile?.alternativeEmail || "",
      phoneCountryCode: profile?.phoneCountryCode || "+1",
      phoneNumber: profile?.phoneNumber || "",
      alternativePhoneCountryCode: profile?.alternativePhoneCountryCode || "+1",
      alternativePhoneNumber: profile?.alternativePhoneNumber || "",
      
      intendedFieldsOfStudy: profile?.intendedFieldsOfStudy || "",
      preferredStudyLevel: profile?.preferredStudyLevel || "",
      expectedStartTerm: profile?.expectedStartTerm || "",
      expectedStartYear: profile?.expectedStartYear || "",
      preferredStudyDestinations: profile?.preferredStudyDestinations || "",
      onlineLearningInterest: profile?.onlineLearningInterest || "undecided",
      fundingSources: profile?.fundingSources || [],
      scholarshipInterest: profile?.scholarshipInterest || "yes",
      
      educationCountry: profile?.educationCountry || "",
      highestEducationLevel: profile?.highestEducationLevel || "",
      gradingScheme: profile?.gradingScheme || "",
      overallGrade: profile?.overallGrade || "",
      
      isEnglishFirstLanguage: profile?.isEnglishFirstLanguage || "yes",
      hasEnglishProficiencyTest: profile?.hasEnglishProficiencyTest || "no",
    },
  });
  
  // Setup data loading if needed
  React.useEffect(() => {
    if (profile?.schools?.length) {
      setSchools(Array.from({ length: profile.schools.length }, (_, i) => i));
    }
    if (profile?.tests?.length) {
      setTests(Array.from({ length: profile.tests.length }, (_, i) => i));
    }
    if (profile?.workExperiences?.length) {
      setWorkExperiences(Array.from({ length: profile.workExperiences.length }, (_, i) => i));
    }
  }, [profile]);
  
  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // This would collect data from school, test and work experience fields too
      const formData = new FormData();
      
      // Append form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(`${key}[]`, item);
            });
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Make API request
      await apiRequest("POST", "/api/profile", data);
      
      // Update profile in state
      updateProfile(data);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "There was an error saving your profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Helper functions for dynamic arrays
  const addSchool = () => {
    setSchools([...schools, schools.length > 0 ? Math.max(...schools) + 1 : 0]);
  };
  
  const removeSchool = (index: number) => {
    setSchools(schools.filter((i) => i !== index));
  };
  
  const addTest = () => {
    setTests([...tests, tests.length > 0 ? Math.max(...tests) + 1 : 0]);
  };
  
  const removeTest = (index: number) => {
    setTests(tests.filter((i) => i !== index));
  };
  
  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, workExperiences.length > 0 ? Math.max(...workExperiences) + 1 : 0]);
  };
  
  const removeWorkExperience = (index: number) => {
    setWorkExperiences(workExperiences.filter((i) => i !== index));
  };
  
  // Save profile handler
  const saveProfile = () => {
    const currentValues = form.getValues();
    updateProfile(currentValues);
    toast({
      title: "Profile Saved",
      description: "Your profile has been successfully saved.",
    });
  };
  
  // Get current values for conditional rendering
  const permanentAddressDifferent = form.watch("permanentAddressDifferent");
  const isEnglishFirstLanguage = form.watch("isEnglishFirstLanguage");
  
  return (
    <div>
      {/* Profile Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
              <ProfilePicture 
                initialImage={profile?.profilePicture}
                onImageChange={(file) => {
                  // Handle profile picture upload
                  console.log("Profile picture changed:", file);
                }}
              />
              <div>
                <div className="text-sm text-gray-600">
                  Student ID: <span className="text-gray-900">STU12345</span>
                </div>
                <div className="text-sm text-gray-600">
                  Email: <span className="text-gray-900">{profile?.email || "student@example.com"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <ProfileProgress completionPercentage={profileCompletionPercentage} />
          </div>
        </div>
      </div>
      
      {/* Profile Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Personal Information Section */}
          <FormSection title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferredName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="primaryLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Language<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map(language => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="countryOfCitizenship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Citizenship<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="countryOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Birth</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="passportNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="passportExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Expiry Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="passportIssuingCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Issuing Country</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Marital Status<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="marital-single" />
                          <FormLabel htmlFor="marital-single" className="text-sm font-normal cursor-pointer">
                            Single
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="married" id="marital-married" />
                          <FormLabel htmlFor="marital-married" className="text-sm font-normal cursor-pointer">
                            Married
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="marital-other" />
                          <FormLabel htmlFor="marital-other" className="text-sm font-normal cursor-pointer">
                            Other
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Gender<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="gender-male" />
                          <FormLabel htmlFor="gender-male" className="text-sm font-normal cursor-pointer">
                            Male
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="gender-female" />
                          <FormLabel htmlFor="gender-female" className="text-sm font-normal cursor-pointer">
                            Female
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="prefer_not_to_say" id="gender-prefer-not-to-say" />
                          <FormLabel htmlFor="gender-prefer-not-to-say" className="text-sm font-normal cursor-pointer">
                            Prefer not to say
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="gender-other" />
                          <FormLabel htmlFor="gender-other" className="text-sm font-normal cursor-pointer">
                            Other
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          {/* Address Details Section */}
          <FormSection title="Address Details">
            <AddressForm 
              type="current" 
              formPrefix=""
              showPermanentAddressToggle={true}
              isPermanentAddressDifferent={permanentAddressDifferent}
              onPermanentAddressToggle={(checked) => {
                form.setValue("permanentAddressDifferent", checked);
              }}
            />
            
            {permanentAddressDifferent && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-700 mb-4">Permanent Address</h3>
                <AddressForm 
                  type="permanent" 
                  formPrefix="permanent"
                />
              </div>
            )}
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="alternativeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Phone Number<span className="text-red-500">*</span></FormLabel>
                <div className="flex">
                  <div className="w-24">
                    <FormField
                      control={form.control}
                      name="phoneCountryCode"
                      render={({ field }) => (
                        <FormItem>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-r-none">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="+1">+1</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                              <SelectItem value="+61">+61</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder="(XXX) XXX-XXXX" 
                            className="rounded-l-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <FormLabel>Alternative Phone Number</FormLabel>
                <div className="flex">
                  <div className="w-24">
                    <FormField
                      control={form.control}
                      name="alternativePhoneCountryCode"
                      render={({ field }) => (
                        <FormItem>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-r-none">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="+1">+1</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                              <SelectItem value="+61">+61</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="alternativePhoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            placeholder="Type here..." 
                            className="rounded-l-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </FormSection>
          
          {/* Academic Goals & Preferences */}
          <FormSection title="Academic Goals & Preferences">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name="intendedFieldsOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Intended Field(s) of Study<span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-1">(e.g., Computer Science, Marine Biology)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter fields of study separated by commas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="preferredStudyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Level of Study<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STUDY_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expectedStartTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Start Term<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STUDY_TERMS.map(term => (
                          <SelectItem key={term.value} value={term.value}>
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expectedStartYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Start Year<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 6 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name="preferredStudyDestinations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Preferred Study Destination(s) (Country)<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter countries separated by commas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="onlineLearningInterest"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Interested in Online/Distance Learning?<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="online-yes" />
                          <FormLabel htmlFor="online-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="online-no" />
                          <FormLabel htmlFor="online-no" className="text-sm font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="undecided" id="online-undecided" />
                          <FormLabel htmlFor="online-undecided" className="text-sm font-normal cursor-pointer">
                            Undecided
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="fundingSources"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Primary Funding Source(s)<span className="text-red-500">*</span></FormLabel>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {["self-funded", "family", "scholarship", "loan", "other"].map((option) => (
                        <FormField
                          key={option}
                          control={form.control}
                          name="fundingSources"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                      const updatedValue = checked
                                        ? [...(field.value || []), option]
                                        : field.value?.filter((value) => value !== option) || [];
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {option
                                    .split("-")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="scholarshipInterest"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Interested in Scholarships?<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="scholarship-yes" />
                          <FormLabel htmlFor="scholarship-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="scholarship-no" />
                          <FormLabel htmlFor="scholarship-no" className="text-sm font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          {/* Education Background */}
          <FormSection title="Education Background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <FormField
                control={form.control}
                name="educationCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Education<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="highestEducationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Level of Education<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EDUCATION_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gradingScheme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grading Scheme Used<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GRADING_SCHEMES.map(scheme => (
                          <SelectItem key={scheme.value} value={scheme.value}>
                            {scheme.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="overallGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Average<span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an option..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GRADES.map(grade => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          {/* Schools Attended */}
          <FormSection 
            title="Schools Attended" 
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={addSchool}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add School
              </Button>
            }
          >
            {schools.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No schools added. Click "Add School" to begin.
              </div>
            ) : (
              <>
                {schools.map((index) => (
                  <SchoolEntry 
                    key={index} 
                    index={index} 
                    onRemove={removeSchool}
                  />
                ))}
              </>
            )}
          </FormSection>
          
          {/* Standardized Tests & Qualifications */}
          <FormSection 
            title="Standardized Tests & Qualifications" 
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={addTest}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add Test/Qualification
              </Button>
            }
          >
            <div className="mb-6">
              <FormField
                control={form.control}
                name="isEnglishFirstLanguage"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Is English your first language?<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="english-first-yes" />
                          <FormLabel htmlFor="english-first-yes" className="text-sm font-normal cursor-pointer">
                            Yes
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="english-first-no" />
                          <FormLabel htmlFor="english-first-no" className="text-sm font-normal cursor-pointer">
                            No
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {isEnglishFirstLanguage === "no" && (
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="hasEnglishProficiencyTest"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Have you taken an English proficiency test?<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="english-test-yes" />
                            <FormLabel htmlFor="english-test-yes" className="text-sm font-normal cursor-pointer">
                              Yes
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="english-test-no" />
                            <FormLabel htmlFor="english-test-no" className="text-sm font-normal cursor-pointer">
                              No
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {tests.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No tests added. Click "Add Test/Qualification" to begin.
              </div>
            ) : (
              <>
                {tests.map((index) => (
                  <TestEntry 
                    key={index} 
                    index={index} 
                    onRemove={removeTest}
                  />
                ))}
              </>
            )}
          </FormSection>
          
          {/* Work Experience (Optional) */}
          <FormSection 
            title="Work Experience (Optional)" 
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={addWorkExperience}
              >
                <Plus className="h-4 w-4 mr-1.5" /> Add Experience
              </Button>
            }
          >
            {workExperiences.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No work experiences added. Click "Add Experience" to begin.
              </div>
            ) : (
              <>
                {workExperiences.map((index) => (
                  <WorkEntry 
                    key={index} 
                    index={index} 
                    onRemove={removeWorkExperience}
                  />
                ))}
              </>
            )}
          </FormSection>

          {/* Documents Upload Section */}
          <FormSection title="Important Documents" description="Upload important documents for your applications. Documents can be uploaded at a later date if not currently available.">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Passport Document */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium">Passport</h4>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Upload a clear scan of your passport identification page</p>
                  
                  {/* Display existing passport documents */}
                  {documents.filter(doc => doc.documentType === 'Passport').map((doc) => (
                    <div key={doc.id} className="bg-white p-2 rounded border mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <File className="h-3 w-3 text-blue-600 mr-1" />
                          <span className="text-xs text-gray-600">{doc.fileName}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(doc.documentUrl, '_blank')}
                          >
                            <FileText className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              apiRequest("DELETE", `/api/profile/documents/${doc.id}`)
                                .then(() => {
                                  setDocuments(documents.filter(d => d.id !== doc.id));
                                  toast({
                                    title: "Document Deleted",
                                    description: "The document has been deleted successfully.",
                                  });
                                })
                                .catch(error => {
                                  toast({
                                    title: "Delete Error",
                                    description: "There was an error deleting the document. Please try again.",
                                    variant: "destructive",
                                  });
                                });
                            }}
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Upload new passport */}
                  <div className="flex items-center justify-between">
                    <Input
                      id="passport-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const formData = new FormData();
                          formData.append('document', e.target.files[0]);
                          formData.append('documentType', 'Passport');
                          formData.append('fileName', e.target.files[0].name);
                          
                          // Upload the document
                          apiRequest("POST", "/api/profile/documents", formData)
                            .then(response => response.json())
                            .then(data => {
                              setDocuments([...documents, data]);
                              toast({
                                title: "Document Uploaded",
                                description: "Your passport has been uploaded successfully.",
                              });
                            })
                            .catch(error => {
                              toast({
                                title: "Upload Error",
                                description: "There was an error uploading your document. Please try again.",
                                variant: "destructive",
                              });
                            });
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center"
                      onClick={() => document.getElementById('passport-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </Button>
                    <span className="text-xs text-gray-500">
                      {documents.filter(doc => doc.documentType === 'Passport').length > 0 
                        ? `${documents.filter(doc => doc.documentType === 'Passport').length} file(s) uploaded` 
                        : 'No file selected'}
                    </span>
                  </div>
                </div>
                
                {/* Academic Transcripts */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FileArchive className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium">Academic Transcripts</h4>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Upload academic transcripts from all institutions attended</p>
                  <div className="space-y-2">
                    {/* Display existing transcript documents */}
                    {documents.filter(doc => doc.documentType === 'Academic Transcript').map((doc) => (
                      <div key={doc.id} className="bg-white p-2 rounded border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <File className="h-3 w-3 text-blue-600 mr-1" />
                            <span className="text-xs text-gray-600">{doc.fileName}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => window.open(doc.documentUrl, '_blank')}
                            >
                              <FileText className="h-3 w-3 text-blue-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                apiRequest("DELETE", `/api/profile/documents/${doc.id}`)
                                  .then(() => {
                                    setDocuments(documents.filter(d => d.id !== doc.id));
                                    toast({
                                      title: "Document Deleted",
                                      description: "The transcript has been deleted successfully.",
                                    });
                                  })
                                  .catch(error => {
                                    toast({
                                      title: "Delete Error",
                                      description: "There was an error deleting the document. Please try again.",
                                      variant: "destructive",
                                    });
                                  });
                              }}
                            >
                              <X className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Upload transcripts */}
                    <Input
                      id="transcript-upload-multiple"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const uploadPromises = Array.from(e.target.files).map(file => {
                            const formData = new FormData();
                            formData.append('document', file);
                            formData.append('documentType', 'Academic Transcript');
                            formData.append('fileName', file.name);
                            
                            return apiRequest("POST", "/api/profile/documents", formData)
                              .then(response => response.json())
                              .then(data => {
                                return data;
                              });
                          });
                          
                          Promise.all(uploadPromises)
                            .then(results => {
                              setDocuments([...documents, ...results]);
                              toast({
                                title: "Documents Uploaded",
                                description: `${results.length} transcript(s) have been uploaded successfully.`,
                              });
                            })
                            .catch(error => {
                              toast({
                                title: "Upload Error",
                                description: "There was an error uploading one or more documents. Please try again.",
                                variant: "destructive",
                              });
                            });
                        }
                      }}
                    />
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-xs text-gray-600">
                        {documents.filter(doc => doc.documentType === 'Academic Transcript').length > 0 
                          ? `${documents.filter(doc => doc.documentType === 'Academic Transcript').length} transcript(s) uploaded` 
                          : 'No transcripts uploaded yet'}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center h-7 px-2"
                        onClick={() => document.getElementById('transcript-upload-multiple')?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1" /> Upload
                      </Button>
                    </div>
                    
                    {/* Note about multiple files */}
                    <div className="text-center">
                      <span className="text-xs text-gray-500 italic">
                        Tip: You can select multiple files at once
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Certificates/Diplomas */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FileCheck className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium">Certificates/Diplomas</h4>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Optional</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">Upload all relevant educational certificates and diplomas</p>
                  <div className="space-y-2">
                    {/* Display existing certificate documents */}
                    {documents.filter(doc => doc.documentType === 'Certificate/Diploma').map((doc) => (
                      <div key={doc.id} className="bg-white p-2 rounded border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <File className="h-3 w-3 text-blue-600 mr-1" />
                            <span className="text-xs text-gray-600">{doc.fileName}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => window.open(doc.documentUrl, '_blank')}
                            >
                              <FileText className="h-3 w-3 text-blue-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                apiRequest("DELETE", `/api/profile/documents/${doc.id}`)
                                  .then(() => {
                                    setDocuments(documents.filter(d => d.id !== doc.id));
                                    toast({
                                      title: "Document Deleted",
                                      description: "The certificate has been deleted successfully.",
                                    });
                                  })
                                  .catch(error => {
                                    toast({
                                      title: "Delete Error",
                                      description: "There was an error deleting the document. Please try again.",
                                      variant: "destructive",
                                    });
                                  });
                              }}
                            >
                              <X className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Upload certificates */}
                    <Input
                      id="certificate-upload-multiple"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const uploadPromises = Array.from(e.target.files).map(file => {
                            const formData = new FormData();
                            formData.append('document', file);
                            formData.append('documentType', 'Certificate/Diploma');
                            formData.append('fileName', file.name);
                            
                            return apiRequest("POST", "/api/profile/documents", formData)
                              .then(response => response.json())
                              .then(data => {
                                return data;
                              });
                          });
                          
                          Promise.all(uploadPromises)
                            .then(results => {
                              setDocuments([...documents, ...results]);
                              toast({
                                title: "Documents Uploaded",
                                description: `${results.length} certificate(s) have been uploaded successfully.`,
                              });
                            })
                            .catch(error => {
                              toast({
                                title: "Upload Error",
                                description: "There was an error uploading one or more documents. Please try again.",
                                variant: "destructive",
                              });
                            });
                        }
                      }}
                    />
                    <div className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-xs text-gray-600">
                        {documents.filter(doc => doc.documentType === 'Certificate/Diploma').length > 0 
                          ? `${documents.filter(doc => doc.documentType === 'Certificate/Diploma').length} certificate(s) uploaded` 
                          : 'No certificates uploaded yet'}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center h-7 px-2"
                        onClick={() => document.getElementById('certificate-upload-multiple')?.click()}
                      >
                        <Upload className="h-3 w-3 mr-1" /> Upload
                      </Button>
                    </div>
                    
                    {/* Note about multiple files */}
                    <div className="text-center">
                      <span className="text-xs text-gray-500 italic">
                        Tip: You can select multiple files at once
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded border border-blue-100">
                <p className="font-medium text-blue-700 mb-1">Note:</p>
                <p>These documents are not required now, but will be needed when you apply to programmes. You can return to this page and upload them at any time.</p>
              </div>
            </div>
          </FormSection>
          
          {/* Sticky Footer with Form Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-10 flex justify-between">
            <Button
              type="button"
              onClick={() => navigate("/app")}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={saveProfile}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" /> Save Profile
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/app/search")}
                variant="outline"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Search for Programmes <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Extra space at the bottom for sticky footer */}
          <div className="h-20"></div>
        </form>
      </Form>
    </div>
  );
};

export default StudentProfile;
