import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, Book, GraduationCap, Award, Badge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Types for program recommendations
interface ProgramRecommendation {
  programId: number;
  universityName: string;
  programName: string;
  matchScore: number;
  matchReason: string;
  prerequisites: string;
  scholarshipOpportunities: string;
}

interface ProgramRecommendationsResponse {
  recommendations: ProgramRecommendation[];
  alternativePathways: string;
}

export default function ProgramRecommendations() {
  const { profile } = useProfile();
  const { toast } = useToast();

  // Fetch recommendations if profile exists
  const { data, isLoading, isError, error, refetch } = useQuery<ProgramRecommendationsResponse>({
    queryKey: [`/api/program-recommendations/${profile?.id}`],
    enabled: !!profile?.id, // Only run query if profile exists
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Handle the case where the profile is still loading
  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Program Recommendations</CardTitle>
          <CardDescription>
            Complete your profile to get personalized program recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <GraduationCap className="h-4 w-4" />
            <AlertTitle>Profile Required</AlertTitle>
            <AlertDescription>
              We need more information about your academic background, interests, and goals to provide personalized program recommendations.
            </AlertDescription>
          </Alert>
          <Link href="/app/profile">
            <Button className="w-full">Complete Your Profile</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Program Recommendations</CardTitle>
          <CardDescription>Analyzing your profile to find the perfect academic match...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (isError || !data || data.recommendations.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Program Recommendations</CardTitle>
          <CardDescription>We couldn't generate recommendations at this time</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {isError 
                ? `Unable to generate recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`
                : "No recommendations could be generated. Try updating your profile with more information."}
            </AlertDescription>
          </Alert>
          <div className="flex justify-between mt-4">
            <Link href="/app/profile">
              <Button variant="outline">Update Profile</Button>
            </Link>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render recommendations
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Program Recommendations</CardTitle>
        <CardDescription>
          Personalized program suggestions based on your profile and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.recommendations.map((recommendation) => (
            <Card key={recommendation.programId} className="mb-4 overflow-hidden">
              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-100 to-blue-50">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-700" />
                  <span className="font-semibold text-blue-900">{recommendation.matchScore}% Match</span>
                </div>
                <UIBadge variant="outline" className="bg-white">
                  {recommendation.matchScore >= 90 ? 'Excellent' : 
                   recommendation.matchScore >= 80 ? 'Great' : 
                   recommendation.matchScore >= 70 ? 'Good' : 'Possible'} Match
                </UIBadge>
              </div>
              
              <CardContent className="pt-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{recommendation.programName}</h3>
                    <p className="text-muted-foreground text-sm">{recommendation.universityName}</p>
                    
                    <Progress 
                      value={recommendation.matchScore} 
                      className="h-2 mt-2" 
                      indicatorColor={
                        recommendation.matchScore >= 90 ? 'bg-green-600' : 
                        recommendation.matchScore >= 75 ? 'bg-blue-600' : 
                        recommendation.matchScore >= 60 ? 'bg-amber-500' : 'bg-slate-400'
                      }
                    />
                    
                    <div className="mt-4">
                      <p className="text-sm mt-2">{recommendation.matchReason}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start space-x-2">
                          <Book className="h-4 w-4 mt-1 flex-shrink-0 text-blue-600" />
                          <p className="text-sm"><span className="font-medium">Prerequisites:</span> {recommendation.prerequisites}</p>
                        </div>
                        
                        {recommendation.scholarshipOpportunities && (
                          <div className="flex items-start space-x-2">
                            <Award className="h-4 w-4 mt-1 flex-shrink-0 text-amber-600" />
                            <p className="text-sm"><span className="font-medium">Scholarship Opportunities:</span> {recommendation.scholarshipOpportunities}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between bg-slate-50 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Added to saved programs",
                      description: `${recommendation.programName} has been saved to your list.`
                    });
                  }}
                >
                  Save Program
                </Button>
                <Link href={`/app/programs/${recommendation.programId}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {data.alternativePathways && (
          <Alert className="mt-6">
            <Badge className="h-4 w-4" />
            <AlertTitle>Alternative Pathways</AlertTitle>
            <AlertDescription>
              {data.alternativePathways}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => refetch()}>Refresh Recommendations</Button>
        <Link href="/app/programs">
          <Button variant="default">Browse All Programs</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}