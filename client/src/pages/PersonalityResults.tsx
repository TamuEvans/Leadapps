import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardDescription, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Brain, 
  Briefcase, 
  GraduationCap, 
  BookOpen, 
  Target, 
  ThumbsUp,
  Users,
  Puzzle,
  Lightbulb,
  Download,
  ChevronLeft,
  Loader2,
  Check
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type ResultProps = {
  id: string;
  assessmentDate: string;
  personalitySummary: string;
  learningStyle: {
    title: string;
    description: string;
    characteristics: string[];
  };
  strengths: string[];
  interestAreas: {
    name: string;
    score: number;
    description: string;
  }[];
  idealEnvironment: {
    description: string;
    characteristics: string[];
  };
  careerSuggestions: {
    name: string;
    description: string;
    matchScore: number;
  }[];
  educationSuggestions: {
    field: string;
    description: string;
    matchScore: number;
  }[];
};

const PersonalityResults = () => {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch assessment results
  const { data: results, isLoading, error } = useQuery<ResultProps>({
    queryKey: [`/api/personality-assessment/${params.id}`],
    retry: false,
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium">Loading your personality profile...</h3>
        </div>
      </div>
    );
  }
  
  if (error || !results) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <h2 className="text-xl font-bold mb-4">
                We couldn't load your personality profile
              </h2>
              <p className="text-gray-600 mb-6">
                There was an error retrieving your assessment results. Please try again.
              </p>
              <Button onClick={() => navigate("/app/personality-hub")}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Personality Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Format the assessment date
  const formattedDate = new Date(results.assessmentDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Download results as PDF
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your personality profile is being downloaded as a PDF.",
    });
    
    // In a real app, you would trigger a PDF download here
  };
  
  const colorPalette = [
    "#4338ca", // Indigo
    "#3b82f6", // Blue
    "#0ea5e9", // Sky
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
    "#10b981", // Emerald
  ];
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Your Personality Profile</h1>
          <p className="text-gray-500">Assessment completed on {formattedDate}</p>
        </div>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Personality Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-line">
            {results.personalitySummary}
          </p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="learning-style" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="learning-style">Learning Style</TabsTrigger>
          <TabsTrigger value="strengths">Key Strengths</TabsTrigger>
          <TabsTrigger value="interests">Interest Areas</TabsTrigger>
          <TabsTrigger value="environment">Ideal Environment</TabsTrigger>
        </TabsList>
        
        {/* Learning Style Tab */}
        <TabsContent value="learning-style">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                {results.learningStyle.title}
              </CardTitle>
              <CardDescription>
                How you best absorb and process information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                {results.learningStyle.description}
              </p>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Key Characteristics:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc list-inside">
                  {results.learningStyle.characteristics.map((trait, index) => (
                    <li key={index} className="text-gray-700">{trait}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Strengths Tab */}
        <TabsContent value="strengths">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ThumbsUp className="mr-2 h-5 w-5 text-green-600" />
                Your Key Strengths
              </CardTitle>
              <CardDescription>
                Areas where you naturally excel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.strengths.map((strength, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-4 rounded-md border border-gray-100 flex items-start"
                  >
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-gray-700">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interest Areas Tab */}
        <TabsContent value="interests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-600" />
                Your Top Interest Areas
              </CardTitle>
              <CardDescription>
                Activities and domains you find most engaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results.interestAreas}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {results.interestAreas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <Separator />
              
              <div className="space-y-4 mt-4">
                {results.interestAreas.slice(0, 3).map((area, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="font-medium flex items-center">
                      <div 
                        className="h-3 w-3 mr-2 rounded-sm" 
                        style={{ backgroundColor: colorPalette[index % colorPalette.length] }} 
                      />
                      {area.name}
                    </h4>
                    <p className="text-gray-700 text-sm pl-5">{area.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Ideal Environment Tab */}
        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Puzzle className="mr-2 h-5 w-5 text-amber-600" />
                Your Ideal Environment
              </CardTitle>
              <CardDescription>
                Settings where you'll thrive personally and professionally
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                {results.idealEnvironment.description}
              </p>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Best Environment Factors:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.idealEnvironment.characteristics.map((factor, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="h-5 w-5 text-amber-600 mt-0.5">
                        <Check />
                      </div>
                      <p className="text-gray-700">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Career Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
              Career Path Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.careerSuggestions.map((career, index) => (
              <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">{career.name}</h4>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {career.matchScore}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-600">{career.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Education Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <GraduationCap className="mr-2 h-5 w-5 text-green-600" />
              Education Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.educationSuggestions.map((education, index) => (
              <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium">{education.field}</h4>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {education.matchScore}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-600">{education.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button onClick={() => navigate("/app/search")} className="mr-4">
          <GraduationCap className="mr-2 h-4 w-4" />
          Explore Matching Programs
        </Button>
        <Button variant="outline" onClick={() => navigate("/app/personality-hub")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Personality Hub
        </Button>
      </div>
    </div>
  );
};

export default PersonalityResults;