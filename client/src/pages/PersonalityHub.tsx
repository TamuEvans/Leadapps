import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Briefcase, GraduationCap, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PersonalityHub = () => {
  const [, navigate] = useLocation();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Personality Hub</h1>
      
      <Card className="bg-white shadow-sm border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-lg">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Personality & Career Navigator
              </CardTitle>
              <CardDescription>Comprehensive assessment of your preferences, interests, and work styles</CardDescription>
            </div>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
              <Lightbulb className="h-6 w-6 text-amber-500 mb-2" />
              <span className="text-sm text-center font-medium">Learning Style</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
              <Target className="h-6 w-6 text-purple-500 mb-2" />
              <span className="text-sm text-center font-medium">Interest Areas</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-md">
              <Briefcase className="h-6 w-6 text-blue-500 mb-2" />
              <span className="text-sm text-center font-medium">Career Matches</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Take our comprehensive assessment to discover your unique personality profile, learning style, and get personalized recommendations for educational programs and career paths that match your strengths and preferences.
          </p>
          
          <Button 
            className="w-full"
            onClick={() => navigate("/app/personality-assessment")}
          >
            Take Assessment
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              Learning Style Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Discover your preferred learning style and get personalized study strategies to maximize your educational success.
            </p>
            <Button variant="outline" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Career Interest Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore potential career paths that align with your interests, skills, and personality traits.
            </p>
            <Button variant="outline" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalityHub;
