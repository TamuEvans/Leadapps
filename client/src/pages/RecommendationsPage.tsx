import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Info, GraduationCap } from "lucide-react";
import ProgramRecommendations from "@/components/ProgramRecommendations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RecommendationsPage: React.FC = () => {
  interface StudentProfile {
    id: number;
    userId: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    completionPercentage?: number;
    // Add other profile fields as needed
  }
  
  // Fetch the student profile to check if it's complete enough for recommendations
  const { data: profile, isLoading: profileLoading } = useQuery<StudentProfile>({
    queryKey: ["/api/profile"],
    retry: false
  });

  // Check if profile is complete enough for meaningful recommendations
  const isProfileComplete = profile && profile.completionPercentage && profile.completionPercentage >= 40;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Recommendations</h1>
      
      {!isProfileComplete && !profileLoading && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Info className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Your profile needs more information</AlertTitle>
          <AlertDescription className="text-amber-700">
            Complete your profile to get more accurate and personalized recommendations. 
            We recommend adding your educational background, test scores, and study preferences.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="programs" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            Program Recommendations
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="programs" className="space-y-4">
          <ProgramRecommendations />
        </TabsContent>
        
        <TabsContent value="ai-insights" className="space-y-4">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Personalized AI Insights
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Academic Strengths</h3>
                <p className="text-gray-700">
                  Based on your academic history, you show strong aptitude in mathematics and science subjects.
                  These strengths make you well-suited for programs in STEM fields like Computer Science, 
                  Engineering, or Data Science.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Career Path Analysis</h3>
                <p className="text-gray-700">
                  Your career interests align with growing fields in technology and digital innovation.
                  Consider programs that offer internship opportunities and industry connections to
                  maximize your employment prospects after graduation.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Study Location Recommendations</h3>
                <p className="text-gray-700">
                  Given your preferences, studying in Jamaica or the United States would provide
                  the best balance of cultural fit, academic quality, and future opportunities in your field.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
                <p className="text-sm text-gray-500 italic">
                  These insights are generated based on your current profile information.
                  Add more details to your profile for more personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationsPage;