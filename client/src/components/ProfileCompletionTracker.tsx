import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, FileText, User, GraduationCap, MapPin, Phone, Mail } from "lucide-react";

interface ProfileSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  required: boolean;
  weight: number;
}

interface ProfileCompletionTrackerProps {
  onSectionClick?: (sectionId: string) => void;
}

export default function ProfileCompletionTracker({ onSectionClick }: ProfileCompletionTrackerProps) {
  const { data: profile } = useQuery({
    queryKey: ['/api/profile/me'],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['/api/profile/documents'],
  });

  const { data: schools = [] } = useQuery({
    queryKey: ['/api/profile/schools'],
  });

  const { data: tests = [] } = useQuery({
    queryKey: ['/api/profile/test-scores'],
  });

  // Calculate completion status for each section
  const sections: ProfileSection[] = [
    {
      id: "personal_info",
      title: "Personal Information",
      description: "Basic details, contact information",
      icon: <User className="h-5 w-5" />,
      completed: Boolean(profile?.firstName && profile?.lastName && profile?.email && profile?.phone && profile?.dateOfBirth),
      required: true,
      weight: 20
    },
    {
      id: "contact_details",
      title: "Contact & Location",
      description: "Address, emergency contact",
      icon: <MapPin className="h-5 w-5" />,
      completed: Boolean(profile?.address && profile?.city && profile?.country),
      required: true,
      weight: 15
    },
    {
      id: "academic_history",
      title: "Academic History",
      description: "Previous schools and qualifications",
      icon: <GraduationCap className="h-5 w-5" />,
      completed: schools.length > 0,
      required: true,
      weight: 25
    },
    {
      id: "test_scores",
      title: "Test Scores",
      description: "SAT, ACT, IELTS, TOEFL scores",
      icon: <FileText className="h-5 w-5" />,
      completed: tests.length > 0,
      required: false,
      weight: 15
    },
    {
      id: "documents",
      title: "Required Documents",
      description: "Transcripts, certificates, ID",
      icon: <FileText className="h-5 w-5" />,
      completed: documents.length >= 3, // Assuming minimum 3 documents needed
      required: true,
      weight: 25
    }
  ];

  // Calculate overall completion percentage
  const completedWeight = sections
    .filter(section => section.completed)
    .reduce((sum, section) => sum + section.weight, 0);
  
  const totalRequiredWeight = sections
    .filter(section => section.required)
    .reduce((sum, section) => sum + section.weight, 0);
  
  const completionPercentage = Math.round((completedWeight / 100) * 100);
  const requiredCompletionPercentage = Math.round((completedWeight / totalRequiredWeight) * 100);

  const completedSections = sections.filter(s => s.completed).length;
  const totalSections = sections.length;
  const requiredSections = sections.filter(s => s.required).length;
  const completedRequiredSections = sections.filter(s => s.required && s.completed).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profile Completion</span>
          <Badge variant={completionPercentage >= 80 ? "default" : "secondary"}>
            {completionPercentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{completedSections}/{totalSections} sections</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Required Sections</span>
            <span className="font-medium">{completedRequiredSections}/{requiredSections} required</span>
          </div>
          <Progress value={requiredCompletionPercentage} className="h-2" />
        </div>

        {/* Completion Status Message */}
        <div className="p-4 rounded-lg bg-gray-50">
          {completionPercentage >= 100 ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Profile Complete!</span>
            </div>
          ) : completedRequiredSections === requiredSections ? (
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">All required sections complete</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">
                {requiredSections - completedRequiredSections} required section{requiredSections - completedRequiredSections !== 1 ? 's' : ''} remaining
              </span>
            </div>
          )}
          <p className="text-sm text-gray-600 mt-1">
            {completionPercentage >= 100 
              ? "Your profile is ready for university applications!"
              : "Complete your profile to improve your application chances."
            }
          </p>
        </div>

        {/* Section Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Profile Sections</h4>
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                section.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${onSectionClick ? 'cursor-pointer' : ''}`}
              onClick={() => onSectionClick?.(section.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  section.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {section.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{section.title}</span>
                    {section.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{section.weight}%</span>
                {section.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        {completionPercentage < 100 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Quick Actions</h4>
            <div className="grid grid-cols-1 gap-2">
              {sections
                .filter(section => !section.completed && section.required)
                .slice(0, 2)
                .map((section) => (
                  <Button
                    key={section.id}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-3"
                    onClick={() => onSectionClick?.(section.id)}
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span>Complete {section.title}</span>
                    </div>
                  </Button>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}