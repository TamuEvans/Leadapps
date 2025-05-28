import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, Brain, Target, Clock, Star, Play, Download, Heart, Bookmark, Search, Filter } from "lucide-react";

export default function CSECEnglish() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Study materials data
  const studyNotes = [
    {
      id: 'ea-comp-1',
      title: 'Reading Comprehension Strategies',
      subject: 'English A',
      topic: 'Comprehension',
      difficulty: 'Basic',
      duration: '30 mins',
      description: 'Master techniques for understanding explicit and implicit meanings in texts'
    },
    {
      id: 'ea-gram-1',
      title: 'Parts of Speech and Grammar',
      subject: 'English A',
      topic: 'Grammar',
      difficulty: 'Basic',
      duration: '45 mins',
      description: 'Complete guide to Caribbean Standard English grammar rules'
    },
    {
      id: 'ea-writ-1',
      title: 'Essay Writing Structure',
      subject: 'English A',
      topic: 'Writing',
      difficulty: 'Intermediate',
      duration: '60 mins',
      description: 'Learn to write compelling essays with proper structure and flow'
    },
    {
      id: 'eb-lit-1',
      title: 'Literary Devices and Techniques',
      subject: 'English B',
      topic: 'Literary Analysis',
      difficulty: 'Intermediate',
      duration: '50 mins',
      description: 'Comprehensive guide to analyzing literary devices in texts'
    },
    {
      id: 'eb-poet-1',
      title: 'Poetry Analysis Techniques',
      subject: 'English B',
      topic: 'Poetry',
      difficulty: 'Advanced',
      duration: '55 mins',
      description: 'Master the art of poetry analysis with advanced techniques'
    }
  ];

  const flashcards = [
    { id: 'fc-1', subject: 'English A', topic: 'Grammar', question: 'What is a noun?', difficulty: 'Basic' },
    { id: 'fc-2', subject: 'English A', topic: 'Comprehension', question: 'Explicit vs Implicit information?', difficulty: 'Intermediate' },
    { id: 'fc-3', subject: 'English B', topic: 'Literary Devices', question: 'What is a metaphor?', difficulty: 'Basic' },
    { id: 'fc-4', subject: 'English B', topic: 'Poetry', question: 'What is enjambment?', difficulty: 'Advanced' },
    { id: 'fc-5', subject: 'English A', topic: 'Writing', question: 'Three parts of an essay?', difficulty: 'Basic' }
  ];

  const practiceTests = [
    {
      id: 'pt-1',
      title: 'English A Paper 1 Practice Test',
      subject: 'English A',
      paper: 'Paper 1',
      duration: 90,
      questions: 45,
      difficulty: 'Intermediate',
      description: 'Complete practice test with comprehension passages'
    },
    {
      id: 'pt-2',
      title: 'English A Paper 2 Practice Test',
      subject: 'English A',
      paper: 'Paper 2',
      duration: 120,
      questions: 6,
      difficulty: 'Advanced',
      description: 'Essay writing and directed writing practice'
    },
    {
      id: 'pt-3',
      title: 'English B Paper 3 Practice Test',
      subject: 'English B',
      paper: 'Paper 3',
      duration: 90,
      questions: 20,
      difficulty: 'Advanced',
      description: 'Literary analysis and prescribed text questions'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject: string) => {
    return subject === 'English A' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CSEC English A & B</h1>
            <p className="text-gray-600 mt-2">Complete study resources based on the official CXC syllabus</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Syllabus
            </Button>
            <Button size="sm">
              <Target className="h-4 w-4 mr-2" />
              Set Study Goals
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{studyNotes.length}</p>
                  <p className="text-sm text-gray-600">Study Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{flashcards.length}</p>
                  <p className="text-sm text-gray-600">Flashcards</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{practiceTests.length}</p>
                  <p className="text-sm text-gray-600">Practice Tests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">65%</p>
                  <p className="text-sm text-gray-600">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search study materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Difficulties</option>
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Study Notes</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="tests">Practice Tests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    English A Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Reading Comprehension</span>
                    <Progress value={75} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Grammar & Language</span>
                    <Progress value={60} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Essay Writing</span>
                    <Progress value={45} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Summary Writing</span>
                    <Progress value={50} className="w-20" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    English B Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Literary Analysis</span>
                    <Progress value={65} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Poetry Analysis</span>
                    <Progress value={40} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Prose Analysis</span>
                    <Progress value={55} className="w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Drama Analysis</span>
                    <Progress value={30} className="w-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exam Structure Overview */}
            <Card>
              <CardHeader>
                <CardTitle>CSEC English Exam Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-3">English A</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Paper 1 - Reading Comprehension</span>
                        <span>1h 30min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paper 2 - Directed Writing & Essays</span>
                        <span>2h 10min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>School-Based Assessment</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-3">English B</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Paper 1 - Multiple Choice</span>
                        <span>1h 15min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paper 3 - Literary Essays</span>
                        <span>1h 30min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>School-Based Assessment</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <div className="grid gap-4">
              {studyNotes.map((note) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{note.title}</h3>
                          <Badge className={getSubjectColor(note.subject)}>
                            {note.subject}
                          </Badge>
                          <Badge className={getDifficultyColor(note.difficulty)}>
                            {note.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{note.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {note.duration}
                          </span>
                          <span>Topic: {note.topic}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Study
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map((card) => (
                <Card key={card.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getSubjectColor(card.subject)}>
                        {card.subject}
                      </Badge>
                      <Badge className={getDifficultyColor(card.difficulty)}>
                        {card.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">{card.question}</h4>
                    <p className="text-sm text-gray-600 mb-3">Topic: {card.topic}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Brain className="h-4 w-4 mr-2" />
                      Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Practice Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="grid gap-4">
              {practiceTests.map((test) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{test.title}</h3>
                          <Badge className={getSubjectColor(test.subject)}>
                            {test.subject}
                          </Badge>
                          <Badge className={getDifficultyColor(test.difficulty)}>
                            {test.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{test.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {test.duration} mins
                          </span>
                          <span>{test.questions} questions</span>
                          <span>{test.paper}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}