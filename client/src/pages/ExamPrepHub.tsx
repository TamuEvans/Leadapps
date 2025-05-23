import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Users, Search, Target, TrendingUp, Plus, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ExamResourceCard from "@/components/ExamResourceCard";
import StudyGroupCard from "@/components/StudyGroupCard";

export default function ExamPrepHub() {
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

  // Available exam types
  const examTypes = [
    { value: "CSEC", label: "CSEC" },
    { value: "CAPE", label: "CAPE" },
    { value: "BGCSE", label: "BGCSE" },
    { value: "SAT", label: "SAT" }
  ];

  // Filter resources and groups
  const filteredResources = examResources.filter((resource: any) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || resource.examType === selectedExam;
    return matchesSearch && matchesExam;
  });

  const filteredGroups = studyGroups.filter((group: any) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || group.examType === selectedExam;
    return matchesSearch && matchesExam;
  });

  // Calculate progress stats
  const completedResources = userProgress.filter((p: any) => p.progress === 100).length;
  const overallProgress = userProgress.length > 0 
    ? Math.round(userProgress.reduce((acc: number, p: any) => acc + p.progress, 0) / userProgress.length)
    : 0;

  const handleStartStudying = async (resourceId: number) => {
    try {
      await apiRequest("POST", `/api/exam-resources/${resourceId}/start-studying`);
      toast({
        title: "Started studying!",
        description: "Your progress will be tracked automatically.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/exam-resources/progress/my-progress'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start studying. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      await apiRequest("POST", `/api/study-groups/${groupId}/join`);
      toast({
        title: "Joined study group!",
        description: "You can now collaborate with other students.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/study-groups'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join study group. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Exam Prep Hub</h1>
        <p className="text-gray-600">Master your exams with study materials, practice tests, and study groups</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-700">Resources Completed</p>
                <p className="text-2xl font-bold text-blue-900">{completedResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-700">Study Groups</p>
                <p className="text-2xl font-bold text-green-900">{studyGroups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-purple-700">Progress</p>
                <p className="text-2xl font-bold text-purple-900">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-orange-700">Resources Available</p>
                <p className="text-2xl font-bold text-orange-900">{examResources.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search study materials, subjects, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {examTypes.map((exam) => (
                  <SelectItem key={exam.value} value={exam.value}>
                    {exam.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Study Materials Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Study Materials</h2>
          <Badge variant="secondary">{filteredResources.length} available</Badge>
        </div>
        
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.slice(0, 6).map((resource: any) => (
              <ExamResourceCard
                key={resource.id}
                resource={resource}
                onStartStudying={() => handleStartStudying(resource.id)}
                userProgress={userProgress.find((p: any) => p.resourceId === resource.id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No study materials found</h3>
              <p className="text-gray-600">Try adjusting your search or exam filter</p>
            </CardContent>
          </Card>
        )}
        
        {filteredResources.length > 6 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              View All {filteredResources.length} Materials
            </Button>
          </div>
        )}
      </div>

      {/* Study Groups Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Study Groups</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Group
          </Button>
        </div>
        
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.slice(0, 6).map((group: any) => (
              <StudyGroupCard
                key={group.id}
                studyGroup={group}
                onJoin={() => handleJoinGroup(group.id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No study groups found</h3>
              <p className="text-gray-600">Be the first to create a study group for your exam!</p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Study Group
              </Button>
            </CardContent>
          </Card>
        )}
        
        {filteredGroups.length > 6 && (
          <div className="text-center mt-6">
            <Button variant="outline">
              View All Study Groups
            </Button>
          </div>
        )}
      </div>

      {/* Quick Progress Overview */}
      {userProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Your Recent Study Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProgress.slice(0, 3).map((progress: any) => {
                const resource = examResources.find((r: any) => r.id === progress.resourceId);
                return (
                  <div key={progress.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{resource?.title || 'Unknown Resource'}</h4>
                      <p className="text-sm text-gray-600">{resource?.subject} • {resource?.examType}</p>
                      <div className="mt-2">
                        <Progress value={progress.progress} className="h-2" />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-semibold text-lg">{progress.progress}%</p>
                      <p className="text-sm text-gray-500">
                        {progress.lastAccessed 
                          ? new Date(progress.lastAccessed).toLocaleDateString()
                          : 'Not started'
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}