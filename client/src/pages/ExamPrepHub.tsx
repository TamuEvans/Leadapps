import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Users, Search, Target, TrendingUp, Plus, Clock, Star, CheckCircle, Play, FileText, Calendar, Upload, Download, Heart, Bookmark, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

  const { data: savedMaterials = [] } = useQuery({
    queryKey: ['/api/saved-materials'],
  });

  // Mutations for saved materials
  const toggleLikeMutation = useMutation({
    mutationFn: (materialId: number) => 
      apiRequest('PATCH', `/api/saved-materials/${materialId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-materials'] });
      toast({
        title: "Success",
        description: "Material updated successfully",
      });
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: (materialId: number) => 
      apiRequest('PATCH', `/api/saved-materials/${materialId}/bookmark`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-materials'] });
      toast({
        title: "Success", 
        description: "Bookmark updated successfully",
      });
    },
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="w-full sm:w-80">
                    <SelectValue placeholder="CAPE (Caribbean Advanced Proficiency Examination)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAPE">CAPE (Caribbean Advanced Proficiency Examination)</SelectItem>
                    <SelectItem value="CSEC">CSEC (Caribbean Secondary Education Certificate)</SelectItem>
                    <SelectItem value="BGCSE">BGCSE (Bahamas General Certificate of Secondary Education)</SelectItem>
                    <SelectItem value="SAT">SAT (Scholastic Assessment Test)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Find Resources
              </Button>
            </div>

            {/* Resource Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Study Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Study Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Comprehensive, syllabus-specific notes organized by topic to enhance your understanding.</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>• Key concepts and definitions</div>
                    <div>• Illustrated diagrams and examples</div>
                    <div>• Topic summaries and quick reviews</div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Browse Study Notes
                  </Button>
                </CardContent>
              </Card>

              {/* Flashcards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Flashcards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Digital flashcards to help you memorize key information and test your knowledge.</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>• Pre-made decks by subject and topic</div>
                    <div>• Interactive learning with instant feedback</div>
                    <div>• Track your progress and mastery</div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Explore Flashcards
                  </Button>
                </CardContent>
              </Card>

              {/* Question Bank */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Question Bank
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Thousands of questions with detailed solutions to help you practice and learn.</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>• Multiple choice and short answer formats</div>
                    <div>• Questions organized by difficulty level</div>
                    <div>• Detailed explanations and worked solutions</div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Access Question Bank
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Practice Tests Tab */}
          <TabsContent value="practice" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Test Your Knowledge</h2>
              <p className="text-gray-600 mb-6">Challenge yourself with practice tests designed to mirror actual exam conditions. Track your progress and identify areas for improvement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Builder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Test Builder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Create custom tests tailored to your needs.</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Select specific topics and subtopics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Choose question types and difficulty levels</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Set time limits and test format</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Build Custom Test
                  </Button>
                </CardContent>
              </Card>

              {/* Full Exam Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Full Exam Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Simulate real exam conditions with full-length tests.</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Complete mock exams with accurate timing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Experience realistic exam format and question mix</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Receive detailed performance analysis</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Take Mock Exam
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Collaborative Study Groups</h2>
              <p className="text-gray-600 mb-6">Join group study groups to collaborate, share resources, and learn together with other students.</p>
            </div>

            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by subject or exam"
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">CSEC English A & B</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Exam Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSEC">CSEC</SelectItem>
                      <SelectItem value="CAPE">CAPE</SelectItem>
                      <SelectItem value="SAT">SAT</SelectItem>
                      <SelectItem value="BGCSE">BGCSE</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            {/* Study Groups List */}
            <div className="space-y-4">
              {/* CSEC Mathematics Study Circle */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>CSEC</Badge>
                        <Badge variant="secondary">Mathematics</Badge>
                        <Badge variant="outline">Online</Badge>
                        <span className="text-sm text-gray-500">15 members</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">CSEC Mathematics Study Circle</h3>
                      <p className="text-sm text-gray-600 mb-3">Weekly study sessions focusing on key CSEC Mathematics topics, problem solving strategies, and exam preparation.</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created by Simone Edwards</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">Next Session:</span>
                        <span className="text-sm text-gray-600">27/05/2025 - 2:30 PM • 🟢 Online • 17 Applied • Algebra & Polynomials</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">Polynomials</Badge>
                        <Badge variant="outline" className="text-xs">Algebra</Badge>
                        <Badge variant="outline" className="text-xs">Calculus</Badge>
                        <Badge variant="outline" className="text-xs">Exam Prep</Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">SE SC SA U9</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button size="sm">Join Group</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CAPE Biology Unit 1 Group */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>CAPE</Badge>
                        <Badge variant="secondary">Biology</Badge>
                        <Badge variant="outline">Online</Badge>
                        <span className="text-sm text-gray-500">12 members</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">CAPE Biology Unit 1 Group</h3>
                      <p className="text-sm text-gray-600 mb-3">Focused study group for CAPE Biology Unit 1. We study using interactive concepts, analyzing case studies, and discussing key work.</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created by Nadine Clarke</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">Next Session:</span>
                        <span className="text-sm text-gray-600">27/05/2025 - 6:30 PM • 🟢 Online • 15 Applied • Cell Biology & Function Review</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">Biology</Badge>
                        <Badge variant="outline" className="text-xs">Metabolism</Badge>
                        <Badge variant="outline" className="text-xs">Electricity</Badge>
                        <Badge variant="outline" className="text-xs">Lab Work</Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">BC AB LAB U9</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button size="sm">Join Group</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SAT Preparation Team */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>SAT</Badge>
                        <Badge variant="secondary">SAT Prep</Badge>
                        <Badge variant="outline">Online</Badge>
                        <span className="text-sm text-gray-500">8 members</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">SAT Preparation Team</h3>
                      <p className="text-sm text-gray-600 mb-3">Intensive SAT prep group focusing on reading, writing, and math sections. We share resources, practice together, and provide feedback.</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created by Reece Williams</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">Next Session:</span>
                        <span className="text-sm text-gray-600">28/05/2025 - 4:00 PM • 🟢 Online • 10 Applied • Reading & Analysis Practice</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">SAT</Badge>
                        <Badge variant="outline" className="text-xs">Reading</Badge>
                        <Badge variant="outline" className="text-xs">Writing</Badge>
                        <Badge variant="outline" className="text-xs">College Prep</Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-2">TR JAL U5</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button size="sm">Join Group</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Study Sessions */}
            <div>
              <h3 className="text-xl font-bold mb-4">Upcoming Study Sessions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">May 23</div>
                      <div className="text-sm text-gray-500">4:00 PM</div>
                      <div className="font-semibold mt-2">Algebraic Fractions & Factorization</div>
                      <div className="text-sm text-gray-600">SAT Preparation Course</div>
                      <Badge className="mt-2">Online</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">May 25</div>
                      <div className="text-sm text-gray-500">6:00 PM</div>
                      <div className="font-semibold mt-2">Critical Reading & Analysis Practice</div>
                      <div className="text-sm text-gray-600">SAT Preparation Course</div>
                      <Badge className="mt-2">Online</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">May 23</div>
                      <div className="text-sm text-gray-500">3:00 PM</div>
                      <div className="font-semibold mt-2">Shakespeare's Macbeth - Character Analysis</div>
                      <div className="text-sm text-gray-600">English Literature Discussion Circle</div>
                      <Badge className="mt-2">Online</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">May 26</div>
                      <div className="text-sm text-gray-500">4:30 PM</div>
                      <div className="font-semibold mt-2">Forces & Motion Review</div>
                      <div className="text-sm text-gray-600">A-Level Physics & Applied Physics</div>
                      <Badge className="mt-2">Online</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-6">
                <Button variant="link">View All Sessions</Button>
              </div>
            </div>
          </TabsContent>

          {/* Find a Tutor Tab */}
          <TabsContent value="tutor" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">One-on-One Tutoring</h2>
              <p className="text-gray-600 mb-6">Connect with experienced tutors specializing in various subjects for personalized assistance. Our tutors have proven track records of helping students excel in their exams.</p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by subject or exam"
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Select>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Filter By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tutors</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="sciences">Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline">
                Apply Filters
              </Button>
            </div>

            {/* Tutors List */}
            <div className="space-y-6">
              {/* Dr. Simone Edwards */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">DSE</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">Dr. Simone Edwards</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>CSEC Mathematics</Badge>
                            <Badge variant="secondary">CAPE Pure Mathematics</Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">4.9</span>
                            <span className="text-sm text-gray-500">(127)</span>
                          </div>
                          <div className="text-sm text-gray-600">Hourly Rate: $30-45</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">Mathematics lecturer with 15+ years of experience. Specializes in preparing students for CSEC and CAPE mathematics examinations with a proven track record of excellent results.</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span><strong>Availability:</strong> Evenings & Weekends</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm">Book Session</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mr. Xavier Douglas */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-green-600">MXD</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">Mr. Xavier Douglas</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>CSEC Physics</Badge>
                            <Badge variant="secondary">CSEC Chemistry</Badge>
                            <Badge variant="secondary">CAPE Physics</Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">4.7</span>
                            <span className="text-sm text-gray-500">(89)</span>
                          </div>
                          <div className="text-sm text-gray-600">Hourly Rate: $30-40</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">Experienced physics and chemistry teacher with an MSc in Applied Physics. Known for breaking down complex concepts using relatable examples that Caribbean students connect with.</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span><strong>Availability:</strong> Weekdays & Saturdays</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm">Book Session</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ms. Gabrielle Antoine */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-purple-600">MGA</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">Ms. Gabrielle Antoine</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>CSEC English A</Badge>
                            <Badge variant="secondary">CSEC English B</Badge>
                            <Badge variant="secondary">CAPE Communication Studies</Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">4.8</span>
                            <span className="text-sm text-gray-500">(142)</span>
                          </div>
                          <div className="text-sm text-gray-600">Hourly Rate: $25-35</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">Published author and language specialist with a passion for literature and communication. Uses creative methods to improve students' writing skills and analytical abilities.</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span><strong>Availability:</strong> Flexible Hours</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm">Book Session</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mr. Rohan Blackwood */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-600">MRB</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">Mr. Rohan Blackwood</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>CSEC Information Technology</Badge>
                            <Badge variant="secondary">CAPE Computer Science</Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">4.6</span>
                            <span className="text-sm text-gray-500">(76)</span>
                          </div>
                          <div className="text-sm text-gray-600">Hourly Rate: $30-50</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">Software engineer and IT educator with expertise in programming and systems development. Helps students master both theoretical concepts and practical applications of IT.</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span><strong>Availability:</strong> Afternoons & Weekends</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm">Book Session</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dr. Marion Roberts */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">DMR</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">Dr. Marion Roberts</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge>SAT Math</Badge>
                            <Badge variant="secondary">SAT Reading</Badge>
                            <Badge variant="secondary">SAT Writing</Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">4.9</span>
                            <span className="text-sm text-gray-500">(156)</span>
                          </div>
                          <div className="text-sm text-gray-600">Hourly Rate: $40-60</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">SAT prep specialist with a PhD in Education. Has helped hundreds of Caribbean students achieve top scores for US university applications.</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <span><strong>Availability:</strong> Evenings & Weekends</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button size="sm">Book Session</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </TabsContent>

          {/* Coursework Hub Tab */}
          <TabsContent value="coursework" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Coursework Hub</h2>
              <p className="text-gray-600 mb-6">Access guidance and examples for School-Based Assessments (SBAs) and Internal Assessments (IAs). Get help with structured approaches to your coursework requirements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Example Repository */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-orange-600" />
                    Example Repository
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Browse high-quality examples of completed coursework for reference and guidance.</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">CSEC Biology SBA Examples</h4>
                      <p className="text-xs text-gray-600">Complete lab with detailed observations</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">CAPE Communication Studies IA</h4>
                      <p className="text-xs text-gray-600">Sample portfolios with feedback</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Repository
                  </Button>
                </CardContent>
              </Card>

              {/* Guidance Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Guidance Articles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Read expert articles on how to approach and excel in different types of coursework.</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">Choosing a Good SBA/IA Topic</h4>
                      <p className="text-xs text-gray-600">Tips for selecting manageable topics</p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">Data Collection Techniques</h4>
                      <p className="text-xs text-gray-600">Methods and best practices</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Read Articles
                  </Button>
                </CardContent>
              </Card>

              {/* Self-Grading Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    Self-Grading Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Use interactive checklists based on official rubrics to evaluate your own coursework.</p>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">CSEC Science SBA Checklist</h4>
                      <p className="text-xs text-gray-600">Verify all required elements</p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-1">CAPE Internal Assessment Evaluator</h4>
                      <p className="text-xs text-gray-600">Score your work against the marking scheme</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Access Tools
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* My Saved Materials Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">My Saved Materials</h3>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Render actual saved materials from database */}
                {Array.isArray(savedMaterials) && savedMaterials.map((material: any) => (
                  <Card key={material.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            material.category === 'notes' ? 'bg-blue-100' : 
                            material.category === 'practice_test' ? 'bg-green-100' : 
                            'bg-purple-100'
                          }`}>
                            {material.category === 'notes' ? (
                              <FileText className={`h-5 w-5 ${
                                material.category === 'notes' ? 'text-blue-600' : 
                                material.category === 'practice_test' ? 'text-green-600' : 
                                'text-purple-600'
                              }`} />
                            ) : material.category === 'practice_test' ? (
                              <Target className="h-5 w-5 text-green-600" />
                            ) : (
                              <Users className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{material.title}</h4>
                            <p className="text-xs text-gray-500">
                              Saved {new Date(material.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleLikeMutation.mutate(material.id)}
                          disabled={toggleLikeMutation.isPending}
                        >
                          <Heart className={`h-4 w-4 ${
                            material.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
                          }`} />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleBookmarkMutation.mutate(material.id)}
                          disabled={toggleBookmarkMutation.isPending}
                        >
                          <Bookmark className={`h-3 w-3 ${
                            material.isBookmarked ? 'fill-current' : ''
                          }`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Upload New File Card */}
                <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[120px]">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600 mb-1">Upload New File</p>
                    <p className="text-xs text-gray-500">Drop files here or click to browse</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-6">
                <Button variant="link">View All Saved Materials</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}