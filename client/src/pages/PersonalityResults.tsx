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
  Check,
  MoonStar,
  Flower,
  Fingerprint,
  Star,
  Sparkles
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
  // Additional astrological, human design, and enneagram data
  astrology?: {
    sunSign: string;
    moonSign: string;
    ascendantSign: string;
    planetaryPlacements: {
      planet: string;
      sign: string;
      house?: number;
      interpretation: string;
    }[];
    summary: string;
  };
  humanDesign?: {
    type: string;
    authority: string;
    profile: string;
    definition: string;
    centers: {
      name: string;
      status: string;
      meaning: string;
    }[];
    summary: string;
  };
  enneagram?: {
    primaryType: string;
    wing: string;
    triad: string;
    growthPath: string;
    stressPath: string;
    description: string;
  };
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
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="learning-style">Learning Style</TabsTrigger>
          <TabsTrigger value="strengths">Key Strengths</TabsTrigger>
          <TabsTrigger value="interests">Interest Areas</TabsTrigger>
          <TabsTrigger value="environment">Ideal Environment</TabsTrigger>
          {results.astrology && <TabsTrigger value="astrology">Astrology</TabsTrigger>}
          {results.humanDesign && <TabsTrigger value="human-design">Human Design</TabsTrigger>}
          {results.enneagram && <TabsTrigger value="enneagram">Enneagram</TabsTrigger>}
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
        
        {/* Astrology Tab */}
        {results.astrology && (
          <TabsContent value="astrology">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MoonStar className="mr-2 h-5 w-5 text-indigo-600" />
                  Your Astrological Profile
                </CardTitle>
                <CardDescription>
                  Planetary influences and celestial insights based on your birth date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <Star className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h4 className="font-medium text-indigo-900">Sun Sign</h4>
                    <p className="text-indigo-700 font-bold text-lg">{results.astrology.sunSign}</p>
                    <p className="text-xs text-indigo-600 mt-1">Core Identity</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <MoonStar className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-purple-900">Moon Sign</h4>
                    <p className="text-purple-700 font-bold text-lg">{results.astrology.moonSign}</p>
                    <p className="text-xs text-purple-600 mt-1">Emotional Nature</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-blue-900">Ascendant</h4>
                    <p className="text-blue-700 font-bold text-lg">{results.astrology.ascendantSign}</p>
                    <p className="text-xs text-blue-600 mt-1">Social Persona</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Key Planetary Placements</h4>
                  <div className="space-y-3">
                    {results.astrology.planetaryPlacements.map((placement, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-indigo-700">{placement.planet}</span>
                          <span className="mx-2 text-gray-400">in</span>
                          <span className="font-medium text-indigo-700">{placement.sign}</span>
                          {placement.house && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full ml-2">
                              House {placement.house}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{placement.interpretation}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Astrological Summary</h4>
                  <p className="text-gray-700">{results.astrology.summary}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* Human Design Tab */}
        {results.humanDesign && (
          <TabsContent value="human-design">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flower className="mr-2 h-5 w-5 text-rose-600" />
                  Your Human Design
                </CardTitle>
                <CardDescription>
                  Your energetic blueprint and personal operating system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-rose-50 rounded-lg p-4 text-center">
                    <h4 className="font-medium text-rose-900 text-sm">Type</h4>
                    <p className="text-rose-700 font-bold text-lg">{results.humanDesign.type}</p>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <h4 className="font-medium text-amber-900 text-sm">Authority</h4>
                    <p className="text-amber-700 font-bold text-lg">{results.humanDesign.authority}</p>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <h4 className="font-medium text-emerald-900 text-sm">Profile</h4>
                    <p className="text-emerald-700 font-bold text-lg">{results.humanDesign.profile}</p>
                  </div>
                  
                  <div className="bg-sky-50 rounded-lg p-4 text-center">
                    <h4 className="font-medium text-sky-900 text-sm">Definition</h4>
                    <p className="text-sky-700 font-bold text-lg">{results.humanDesign.definition}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Energy Centers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.humanDesign.centers.map((center, index) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className={`h-8 w-8 rounded-full mr-3 flex items-center justify-center flex-shrink-0 ${
                          center.status === 'Defined' ? 'bg-green-100 text-green-600' :
                          center.status === 'Undefined' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {center.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h5 className="font-medium">{center.name}</h5>
                            <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                              center.status === 'Defined' ? 'bg-green-100 text-green-800' :
                              center.status === 'Undefined' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {center.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{center.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Human Design Summary</h4>
                  <p className="text-gray-700">{results.humanDesign.summary}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* Enneagram Tab */}
        {results.enneagram && (
          <TabsContent value="enneagram">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fingerprint className="mr-2 h-5 w-5 text-violet-600" />
                  Your Enneagram Type
                </CardTitle>
                <CardDescription>
                  Core motivations, fears, and growth paths
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-violet-50 p-5 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-violet-800">Type {results.enneagram.primaryType}</h3>
                  <p className="text-violet-600 mb-2">with {results.enneagram.wing} wing</p>
                  <p className="text-violet-700">{results.enneagram.triad} Triad</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="font-medium text-green-800 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M18 21a8 8 0 0 0-16 0"></path>
                        <path d="M10 7v0"></path>
                        <path d="M14 7v0"></path>
                        <path d="M12 3v0"></path>
                      </svg>
                      Growth Path
                    </h4>
                    <p className="text-gray-700">Type {results.enneagram.growthPath}</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="font-medium text-red-800 flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="m21 15-5-1-2.5 2.5c-2.5 2.5-6.5-1.5-4-4L12 10 11 5"></path>
                        <path d="M7.5 15.5 7 19.5"></path>
                        <path d="M13.5 9.5 12 4"></path>
                        <path d="m16 16 4.5.5"></path>
                        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8"></path>
                      </svg>
                      Stress Path
                    </h4>
                    <p className="text-gray-700">Type {results.enneagram.stressPath}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Enneagram Description</h4>
                  <p className="text-gray-700 whitespace-pre-line">{results.enneagram.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
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