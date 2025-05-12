import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { Link } from "wouter";
import { UserRound, BookOpen, GraduationCap, ListChecks } from "lucide-react";

const Home = () => {
  const { profileCompletionPercentage } = useProfile();

  const quickLinks = [
    {
      title: "Complete Your Profile",
      description: "Update your personal information and academic background.",
      icon: <UserRound className="h-8 w-8 text-primary" />,
      link: "/profile",
      buttonText: "Continue Profile",
    },
    {
      title: "Browse Programs",
      description: "Explore educational programs and institutions.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      link: "/search",
      buttonText: "Search Programs",
    },
    {
      title: "View Applications",
      description: "Check the status of your submitted applications.",
      icon: <ListChecks className="h-8 w-8 text-primary" />,
      link: "/applications",
      buttonText: "Review Applications",
    },
    {
      title: "Education Resources",
      description: "Access helpful guides, articles and counseling services.",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      link: "/articles",
      buttonText: "Explore Resources",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to LeadApps</h1>
          <p className="text-gray-600 mt-1">Your educational journey simplified</p>
        </div>
        
        <Card className="w-full md:w-auto bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                  <UserRound className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile completion</p>
                <div className="flex items-center mt-1">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${profileCompletionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{profileCompletionPercentage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((item, index) => (
          <Card key={index} className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                {item.icon}
              </div>
              <CardTitle className="text-lg font-semibold mt-2">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <Button asChild className="w-full">
                <Link href={item.link}>{item.buttonText}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white shadow-sm border-primary border-l-4">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Get Started with Your Educational Journey</h3>
              <p className="mt-1 text-sm text-gray-600">
                Complete your profile to discover programs that match your interests and qualifications. Our counselors are also available to guide you through the application process.
              </p>
              <div className="mt-3">
                <Button asChild variant="outline" size="sm">
                  <Link href="/counselling">Schedule Counseling</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
