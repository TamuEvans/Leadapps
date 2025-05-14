import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StarIcon, Sparkles, GraduationCap, BookOpen, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "wouter";

// Interface for program recommendation
interface ProgramRecommendation {
  id: number;
  programName: string;
  universityName: string;
  universityLogo?: string;
  universityLocation: string;
  matchScore: number;
  matchReasons: string[];
  level: string;
  discipline: string;
  degree?: string;
}

// Program match component showing match score with appropriate color
const MatchScore: React.FC<{ score: number }> = ({ score }) => {
  // Determine color based on match score
  const getColorClass = () => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-gray-600";
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`text-xl font-bold ${getColorClass()}`}>
        {score}%
      </div>
      <div className="text-xs text-gray-500">Match</div>
      <Progress 
        value={score} 
        max={100}
        className="h-1.5 w-full mt-1"
      />
    </div>
  );
};

// Component to display program recommendations
const ProgramRecommendations: React.FC = () => {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Record<number, 'liked' | 'disliked' | null>>({});

  // Fetch program recommendations
  const { data: recommendations, isLoading, error, refetch } = useQuery<ProgramRecommendation[]>({
    queryKey: ["/api/program-recommendations"],
    retry: false,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching recommendations",
        description: "Unable to load program recommendations. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Toggle expanded view for a recommendation
  const toggleExpanded = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  // Submit feedback on a recommendation
  const submitFeedback = (id: number, type: 'liked' | 'disliked') => {
    // Update local state first for immediate feedback
    setFeedbackSubmitted(prev => ({
      ...prev,
      [id]: type
    }));

    // API call to submit feedback
    // In a real implementation, this would send the feedback to the server
    toast({
      title: type === 'liked' ? "Recommendation liked" : "Recommendation disliked",
      description: "Thank you for your feedback! We'll use it to improve future recommendations.",
    });
  };

  // Generate placeholder recommendations for the loading state
  const placeholders = Array(3).fill(null).map((_, i) => (
    <Card key={`placeholder-${i}`} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  ));

  // If loading, show placeholder cards
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          AI-Powered Program Recommendations
        </h2>
        <div className="space-y-4">
          {placeholders}
        </div>
      </div>
    );
  }

  // Mock recommendations data (will be replaced with actual API data)
  const mockRecommendations: ProgramRecommendation[] = [
    {
      id: 1,
      programName: "Computer Science",
      universityName: "University of the West Indies",
      universityLogo: "/assets/uwi-logo.png",
      universityLocation: "Jamaica",
      matchScore: 92,
      matchReasons: [
        "Matches your interest in software development",
        "Aligned with your previous academic performance in mathematics",
        "The university offers strong scholarship opportunities for local students",
        "Campus culture aligns with your extracurricular interests"
      ],
      level: "Undergraduate",
      discipline: "Computer Science",
      degree: "Bachelor of Science"
    },
    {
      id: 2,
      programName: "Data Science and Analytics",
      universityName: "University of Technology",
      universityLogo: "/assets/utech-logo.png",
      universityLocation: "Jamaica",
      matchScore: 87,
      matchReasons: [
        "Matches your interest in data analysis",
        "The program curriculum includes the programming languages you're familiar with",
        "Good employment prospects in your preferred location",
        "Program offers internship opportunities"
      ],
      level: "Undergraduate",
      discipline: "Data Science",
      degree: "Bachelor of Science"
    },
    {
      id: 3,
      programName: "Software Engineering",
      universityName: "St. George's University",
      universityLogo: "/assets/sgu-logo.png",
      universityLocation: "Grenada",
      matchScore: 81,
      matchReasons: [
        "Strong emphasis on practical software development skills",
        "Program includes certifications valued by employers",
        "University has strong industry connections",
        "Campus facilities align with your preferences"
      ],
      level: "Undergraduate",
      discipline: "Software Engineering",
      degree: "Bachelor of Science"
    },
    {
      id: 4,
      programName: "Digital Media Design",
      universityName: "University of the Commonwealth Caribbean",
      universityLogo: "/assets/ucc-logo.png",
      universityLocation: "Jamaica",
      matchScore: 75,
      matchReasons: [
        "Aligns with your interest in creative technology",
        "Program offers flexibility in specialization",
        "Campus is located in an area you indicated preference for",
        "Small class sizes match your learning style preference"
      ],
      level: "Undergraduate",
      discipline: "Digital Media",
      degree: "Bachelor of Arts"
    },
    {
      id: 5,
      programName: "Information Technology",
      universityName: "Caribbean Maritime University",
      universityLogo: "/assets/cmu-logo.png",
      universityLocation: "Jamaica",
      matchScore: 68,
      matchReasons: [
        "Curriculum includes cybersecurity components you expressed interest in",
        "Program offers good value for tuition cost",
        "University has good graduate employment rates",
        "Campus has recently upgraded technology facilities"
      ],
      level: "Undergraduate",
      discipline: "Information Technology",
      degree: "Bachelor of Science"
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        AI-Powered Program Recommendations
      </h2>
      
      <p className="text-gray-600 mb-6">
        Based on your profile, academic history, and preferences, our AI has found these programs that might be a great fit for you.
      </p>
      
      {/* Display recommendations */}
      <div className="space-y-4">
        {(recommendations?.length ? recommendations : mockRecommendations).map((recommendation: ProgramRecommendation) => (
          <Card key={recommendation.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{recommendation.programName}</CardTitle>
                  <CardDescription className="flex items-center">
                    <span>{recommendation.universityName}</span>
                    <span className="mx-1">•</span>
                    <span>{recommendation.universityLocation}</span>
                  </CardDescription>
                </div>
                <div className="flex-shrink-0">
                  <MatchScore score={recommendation.matchScore} />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  {recommendation.level}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {recommendation.discipline}
                </Badge>
                {recommendation.degree && (
                  <Badge variant="outline">
                    {recommendation.degree}
                  </Badge>
                )}
              </div>
              
              {expanded === recommendation.id && (
                <div className="mt-3 mb-2">
                  <h4 className="text-sm font-medium mb-2">Why we recommend this program:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-1">
                    {recommendation.matchReasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-1.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleExpanded(recommendation.id)}
                >
                  {expanded === recommendation.id ? "Show less" : "Why this match?"}
                </Button>
                
                <div className="flex gap-2">
                  {feedbackSubmitted[recommendation.id] ? (
                    <span className="text-sm text-gray-500 italic">Feedback submitted</span>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-green-600"
                        onClick={() => submitFeedback(recommendation.id, 'liked')}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => submitFeedback(recommendation.id, 'disliked')}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not for me
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 pt-3 pb-3">
              <div className="w-full flex justify-between items-center">
                <Link 
                  to={`/app/university-profile/${recommendation.universityName.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-primary hover:underline flex items-center"
                >
                  View University
                </Link>
                
                <Link 
                  to={`/app/program-profile/${recommendation.id}`}
                  className="flex items-center"
                >
                  <Button size="sm">
                    Explore Program <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => refetch()}
          className="flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4" />
          Refresh Recommendations
        </Button>
      </div>
    </div>
  );
};

export default ProgramRecommendations;