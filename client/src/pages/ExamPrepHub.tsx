import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Users, Search, Target, TrendingUp, Plus, Clock, Star, CheckCircle, Play, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ExamResourceCard from "@/components/ExamResourceCard";
import StudyGroupCard from "@/components/StudyGroupCard";
import CounselorCard from "@/components/CounselorCard";

export default function ExamPrepHub() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: examResources = [] } = useQuery({
    queryKey: ['/api/exam-resources'],
  });

  const { data: studyGroups = [] } = useQuery({
    queryKey: ['/api/study-groups'],
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['/api/exam-resources/progress/my-progress'],
  });

  const { data: counselors = [] } = useQuery({
    queryKey: ['/api/counselors'],
  });

  // Available exam types
  const examTypes = [
    { value: "CSEC", label: "CSEC" },
    { value: "CAPE", label: "CAPE" },
    { value: "BGCSE", label: "BGCSE" },
    { value: "SAT", label: "SAT" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exam Preparation Hub</h1>
            <p className="text-gray-600 mt-2">Comprehensive resources to help you excel in your exams</p>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning Resources</TabsTrigger>
            <TabsTrigger value="practice">Practice Tests</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
            <TabsTrigger value="tutor">Find a Tutor</TabsTrigger>
            <TabsTrigger value="coursework">Coursework Hub</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Search Bar on Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search study materials, practice tests, tutors, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Select Your Exam */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Select Your Exam
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Choose from a variety of examination types including CSEC, CAPE, BGCSE, and SAT</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button variant="outline" className="h-16 flex flex-col">
                      <span className="font-semibold">CSEC</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col">
                      <span className="font-semibold">CAPE</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col">
                      <span className="font-semibold">BGCSE</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex flex-col">
                      <span className="font-semibold">SAT</span>
                    </Button>
                  </div>
                  
                  <Button variant="link" className="w-full text-blue-600">
                    View all exam types
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Start Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    Quick Start Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Select your exam type and subject</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Review study notes or start with flashcards</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Take practice tests to assess your knowledge</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Connect with a tutor for personalized help</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">
                    Start Learning Now
                  </Button>
                </CardContent>
              </Card>

              {/* Your Exam Prep Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Your Exam Prep Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Recently Practiced</span>
                        <span className="font-semibold">65% Accuracy</span>
                      </div>
                      <div className="text-sm text-gray-600">CSEC Mathematics</div>
                      <Progress value={65} className="mt-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Upcoming Practice Tests</span>
                        <span className="font-semibold">Scheduled</span>
                      </div>
                      <div className="text-sm text-gray-600">CSEC English A</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Study Time This Week</span>
                        <span className="font-semibold">3.5 hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="link" className="w-full text-blue-600 mt-4">
                    View Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Featured Resources */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Featured Resources</h2>
                <Button variant="link" className="text-blue-600">View All</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <Badge variant="secondary">CSEC</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">CSEC Mathematics Practice</h3>
                    <p className="text-sm text-gray-600 mb-4">Complete fast with worked solutions</p>
                    <Button variant="outline" className="w-full">Start Practice</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <Badge variant="secondary">CAPE</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">CAPE Biology Study Notes</h3>
                    <p className="text-sm text-gray-600 mb-4">Unit 1 complete revision</p>
                    <Button variant="outline" className="w-full">View Notes</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Target className="h-5 w-5 text-orange-600" />
                      </div>
                      <Badge variant="secondary">SAT</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">SAT Reading & Writing</h3>
                    <p className="text-sm text-gray-600 mb-4">Strategy guide with practice</p>
                    <Button variant="outline" className="w-full">View Guide</Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <Badge variant="secondary">BGCSE</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">BGCSE Science Flashcards</h3>
                    <p className="text-sm text-gray-600 mb-4">Digital flashcards to help memorize essential science concepts</p>
                    <Button variant="outline" className="w-full">Study Cards</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Learning Resources Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examResources.map((resource: any) => (
                <ExamResourceCard
                  key={resource.id}
                  resource={resource}
                  userProgress={userProgress.find((p: any) => p.resourceId === resource.id)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Practice Tests Tab */}
          <TabsContent value="practice" className="space-y-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Tests Coming Soon</h3>
              <p className="text-gray-600">We're preparing comprehensive practice tests for all exam types.</p>
            </div>
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Study Groups</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Group
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group: any) => (
                <StudyGroupCard key={group.id} group={group} />
              ))}
            </div>
          </TabsContent>

          {/* Find a Tutor Tab */}
          <TabsContent value="tutor" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Expert Tutors</h2>
              <Badge variant="secondary">Available for booking</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample tutors for demo */}
              {[
                {
                  id: 1,
                  displayName: "Sarah Johnson",
                  specialties: ["Mathematics", "Physics"],
                  destinationMarkets: ["UK", "Canada"],
                  profileImageUrl: null,
                  rating: 4.8,
                  costRangeMin: 50,
                  costRangeMax: 80,
                  yearsOfExperience: 8
                },
                {
                  id: 2,
                  displayName: "Marcus Williams",
                  specialties: ["English", "Literature"],
                  destinationMarkets: ["USA", "Australia"],
                  profileImageUrl: null,
                  rating: 4.9,
                  costRangeMin: 60,
                  costRangeMax: 90,
                  yearsOfExperience: 12
                },
                {
                  id: 3,
                  displayName: "Dr. Priya Sharma",
                  specialties: ["Chemistry", "Biology"],
                  destinationMarkets: ["UK", "USA"],
                  profileImageUrl: null,
                  rating: 4.7,
                  costRangeMin: 70,
                  costRangeMax: 100,
                  yearsOfExperience: 15
                }
              ].map((tutor) => (
                <Card key={tutor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tutor.displayName}</h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{tutor.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {tutor.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Markets:</p>
                        <div className="flex flex-wrap gap-1">
                          {tutor.destinationMarkets.map((market, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {market}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        ${tutor.costRangeMin}-${tutor.costRangeMax}/hour • {tutor.yearsOfExperience} years exp.
                      </p>
                    </div>
                    
                    <Button className="w-full">Book Session</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coursework Hub Tab */}
          <TabsContent value="coursework" className="space-y-6">
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coursework Hub Coming Soon</h3>
              <p className="text-gray-600">Track your coursework progress and assignments all in one place.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}