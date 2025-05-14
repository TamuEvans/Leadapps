import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ProfileData {
  // Profile ID and metadata
  id?: number;
  userId?: number;
  completionPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
  
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
  const { data: profile, isLoading, error } = useQuery<ProfileData>({
    queryKey: ["/api/profile"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<ProfileData>) => {
      const response = await apiRequest("POST", "/api/profile", updatedProfile);
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Immediately update the completion percentage if it's in the response
      if (data && data.completionPercentage !== undefined) {
        setProfileCompletionPercentage(data.completionPercentage);
      }
      
      // Invalidate the profile query to refresh the data
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
  
  // Get profile completion percentage from profile data
  useEffect(() => {
    if (profile && typeof profile === 'object' && 'completionPercentage' in profile) {
      setProfileCompletionPercentage(profile.completionPercentage || 0);
    }
  }, [profile]);
  
  // Update profile function
  const updateProfile = (updatedProfile: Partial<ProfileData>) => {
    // Trigger the mutation to update the profile
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
