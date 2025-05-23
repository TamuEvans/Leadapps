import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Users, Target, TrendingUp, Search, Filter, Plus } from 'lucide-react';
import ExamResourceCard from '@/components/ExamResourceCard';
import StudyGroupCard from '@/components/StudyGroupCard';
import { useToast } from '@/hooks/use-toast';

export default function ExamPrepHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { toast } = useToast();

  // Fetch exam resources
  const { data: examResources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['/api/exam-resources', { examType: selectedExam, subject: selectedSubject }],
  });

  // Fetch study groups
  const { data: studyGroups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/study-groups', { examType: selectedExam, subject: selectedSubject }],
  });

  // Fetch user progress
  const { data: userProgress = [] } = useQuery({
    queryKey: ['/api/exam-resources/progress/my-progress'],
  });

  const examTypes = [
    { value: 'CSEC', label: 'CSEC' },
    { value: 'CAPE', label: 'CAPE' },
    { value: 'BGCSE', label: 'BGCSE' },
    { value: 'SAT', label: 'SAT' },
    { value: 'IELTS', label: 'IELTS' },
    { value: 'TOEFL', label: 'TOEFL' }
  ];

  const subjects = [
    'Mathematics', 'English', 'Biology', 'Chemistry', 'Physics', 
    'History', 'Geography', 'Literature', 'Economics', 'Computer Science'
  ];

  const handleResourceAccess = (resourceId: number) => {
    toast({
      title: "Resource Access",
      description: "Opening exam resource...",
    });
    // This would navigate to the resource or open in a modal
  };

  const handleJoinGroup = (groupId: number) => {
    toast({
      title: "Study Group",
      description: "Joining study group...",
    });
    // This would call the join API
  };

  const filteredResources = examResources.filter((resource: any) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = !selectedExam || selectedExam === 'all' || resource.examType === selectedExam;
    const matchesSubject = !selectedSubject || selectedSubject === 'all' || resource.subject === selectedSubject;
    
    return matchesSearch && matchesExam && matchesSubject;
  });

  const filteredGroups = studyGroups.filter((group: any) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = !selectedExam || selectedExam === 'all' || group.examType === selectedExam;
    const matchesSubject = !selectedSubject || selectedSubject === 'all' || group.subject === selectedSubject;
    
    return matchesSearch && matchesExam && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exam Prep Hub</h1>
          <p className="text-gray-600 mt-1">
            Master CSEC, CAPE, BGCSE, SAT and more with comprehensive resources
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Study Group
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{examResources.length}</p>
                <p className="text-sm text-gray-600">Resources Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{studyGroups.length}</p>
                <p className="text-sm text-gray-600">Study Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{userProgress.length}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {userProgress.reduce((acc: number, p: any) => acc + p.completionPercentage, 0) / (userProgress.length || 1)}%
                </p>
                <p className="text-sm text-gray-600">Avg. Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search resources and study groups..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Exam Type" />
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

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Exam Resources</TabsTrigger>
          <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
          <TabsTrigger value="practice-tests">Practice Tests</TabsTrigger>
          <TabsTrigger value="my-progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Exam Resources</h2>
              <Badge variant="secondary">{filteredResources.length} resources</Badge>
            </div>

            {resourcesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource: any) => (
                  <ExamResourceCard
                    key={resource.id}
                    resource={resource}
                    userProgress={userProgress.find((p: any) => p.resourceId === resource.id)}
                    onAccess={handleResourceAccess}
                  />
                ))}
              </div>
            )}

            {!resourcesLoading && filteredResources.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="study-groups">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Study Groups</h2>
              <Badge variant="secondary">{filteredGroups.length} groups</Badge>
            </div>

            {groupsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group: any) => (
                  <StudyGroupCard
                    key={group.id}
                    studyGroup={group}
                    onJoin={handleJoinGroup}
                  />
                ))}
              </div>
            )}

            {!groupsLoading && filteredGroups.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups found</h3>
                  <p className="text-gray-600">Be the first to create a study group for this exam!</p>
                  <Button className="mt-4">Create Study Group</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="practice-tests">
          <Card>
            <CardHeader>
              <CardTitle>Practice Tests</CardTitle>
              <CardDescription>
                Test your knowledge with our comprehensive practice exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Practice Tests Coming Soon</h3>
                <p className="text-gray-600">We're preparing interactive practice tests for all exam types.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-progress">
          <Card>
            <CardHeader>
              <CardTitle>My Progress</CardTitle>
              <CardDescription>
                Track your learning journey across all exam preparations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProgress.length > 0 ? (
                <div className="space-y-4">
                  {userProgress.map((progress: any) => (
                    <div key={progress.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Resource #{progress.resourceId}</h4>
                        <p className="text-sm text-gray-600">Status: {progress.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{progress.completionPercentage}%</p>
                        {progress.score && (
                          <p className="text-sm text-gray-600">Score: {progress.score}%</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No progress yet</h3>
                  <p className="text-gray-600">Start studying to track your progress here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}