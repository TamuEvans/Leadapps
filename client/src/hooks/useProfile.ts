import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProfileData {
  // Personal Information
  firstName?: string;
  middleName?: string;
  lastName?: string;
  preferredName?: string;
  dateOfBirth?: string;
  primaryLanguage?: string;
  countryOfCitizenship?: string;
  countryOfBirth?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  passportIssuingCountry?: string;
  maritalStatus?: "single" | "married" | "other";
  gender?: "male" | "female" | "prefer_not_to_say" | "other";
  profilePicture?: string;
  
  // Address Details
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  permanentAddressDifferent?: boolean;
  permanentAddress1?: string;
  permanentAddress2?: string;
  permanentCity?: string;
  permanentProvince?: string;
  permanentCountry?: string;
  permanentPostalCode?: string;
  email?: string;
  alternativeEmail?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  alternativePhoneCountryCode?: string;
  alternativePhoneNumber?: string;
  
  // Academic Goals & Preferences
  intendedFieldsOfStudy?: string;
  preferredStudyLevel?: string;
  expectedStartTerm?: string;
  expectedStartYear?: string;
  preferredStudyDestinations?: string;
  onlineLearningInterest?: "yes" | "no" | "undecided";
  fundingSources?: string[];
  scholarshipInterest?: "yes" | "no";
  
  // Education Background
  educationCountry?: string;
  highestEducationLevel?: string;
  gradingScheme?: string;
  overallGrade?: string;
  
  // Schools, Tests, Work Experience
  schools?: any[];
  tests?: any[];
  workExperiences?: any[];
  
  // English Proficiency
  isEnglishFirstLanguage?: "yes" | "no";
  hasEnglishProficiencyTest?: "yes" | "no";
}

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profileCompletionPercentage, setProfileCompletionPercentage] = useState<number>(0);
  
  // Get profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["/api/profile"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    onError: () => {
      // For demo purposes, we'll just return an empty object on error
      // and not show an error toast since we don't have a backend yet
      return {};
    }
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedProfile: Partial<ProfileData>) => {
      return apiRequest("PATCH", "/api/profile", updatedProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Calculate profile completion percentage
  useEffect(() => {
    if (profile) {
      // This is a simplified way to calculate completion
      // In a real app, you'd want to weigh different fields differently
      const requiredFields = [
        "firstName", "lastName", "dateOfBirth", "primaryLanguage", 
        "countryOfCitizenship", "maritalStatus", "gender",
        "address1", "city", "province", "country", "postalCode", "email", "phoneNumber",
        "intendedFieldsOfStudy", "preferredStudyLevel", "expectedStartTerm", 
        "expectedStartYear", "preferredStudyDestinations", "onlineLearningInterest",
        "fundingSources", "scholarshipInterest",
        "educationCountry", "highestEducationLevel", "gradingScheme", "overallGrade",
        "isEnglishFirstLanguage"
      ];
      
      // Count how many required fields are filled
      const filledFields = requiredFields.filter(field => {
        // @ts-ignore - Dynamic access
        const value = profile[field];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== undefined && value !== null && value !== "";
      });
      
      // Calculate percentage
      const percentage = Math.round((filledFields.length / requiredFields.length) * 100);
      setProfileCompletionPercentage(percentage);
    }
  }, [profile]);
  
  // For demo purposes, if there's no backend yet
  const updateProfile = (updatedProfile: Partial<ProfileData>) => {
    // Calculate updated completion percentage
    const newProfile = { ...profile, ...updatedProfile };
    queryClient.setQueryData(["/api/profile"], newProfile);
    
    // Also trigger the mutation in case there's a backend
    updateProfileMutation.mutate(updatedProfile);
  };
  
  return {
    profile,
    isLoading,
    error,
    updateProfile,
    profileCompletionPercentage,
  };
};
