import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const PersonalityHub = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Personality Hub</h1>
      
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Discover Your Learning Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Take our assessment to discover your learning style and get personalized recommendations for educational programs that match your preferences.
          </p>
          <Button>Take Assessment</Button>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Career Interest Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Explore potential career paths that align with your interests, skills, and personality traits.
          </p>
          <Button>Explore Careers</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalityHub;
