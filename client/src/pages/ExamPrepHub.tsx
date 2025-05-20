import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  BookOpen,
  FileText,
  Brain,
  Bookmark,
  GraduationCap,
  Clock,
  CheckCircle,
  BookOpenCheck,
  Users,
  Star,
  Filter,
  Search,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define exam types
const examTypes = [
  { id: 'csec', name: 'CSEC (Caribbean Secondary Education Certificate)' },
  { id: 'cape', name: 'CAPE (Caribbean Advanced Proficiency Examination)' },
  { id: 'bgcse', name: 'BGCSE (Bahamas General Certificate of Secondary Education)' },
  { id: 'sat', name: 'SAT (Scholastic Aptitude Test)' },
  { id: 'city-guilds', name: 'City & Guilds' },
  { id: 'nvq-j', name: 'NVQ-J (National Vocational Qualification of Jamaica)' },
];

// Define subjects by exam type
const subjects = {
  csec: [
    'Mathematics', 'English A', 'English B', 'Physics', 'Chemistry', 'Biology',
    'Human and Social Biology', 'Principles of Accounts', 'Principles of Business',
    'Information Technology', 'Social Studies', 'Caribbean History', 'Geography',
    'Spanish', 'French', 'Visual Arts', 'Technical Drawing', 'Food Nutrition & Health'
  ],
  cape: [
    'Accounting Unit 1 & 2', 'Applied Mathematics Unit 1 & 2', 'Biology Unit 1 & 2',
    'Caribbean Studies', 'Chemistry Unit 1 & 2', 'Communication Studies',
    'Computer Science Unit 1 & 2', 'Economics Unit 1 & 2', 'Entrepreneurship Unit 1 & 2',
    'Environmental Science Unit 1 & 2', 'Food & Nutrition Unit 1 & 2',
    'Geography Unit 1 & 2', 'History Unit 1 & 2', 'Information Technology Unit 1 & 2',
    'Integrated Mathematics', 'Law Unit 1 & 2', 'Literatures in English Unit 1 & 2',
    'Management of Business Unit 1 & 2', 'Pure Mathematics Unit 1 & 2',
    'Physics Unit 1 & 2', 'Sociology Unit 1 & 2', 'Spanish Unit 1 & 2'
  ],
  bgcse: [
    'English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics',
    'Combined Science', 'Religious Studies', 'History', 'Geography',
    'Spanish', 'French', 'Economics', 'Accounting', 'Commerce'
  ],
  sat: [
    'Reading', 'Writing', 'Math (No Calculator)', 'Math (Calculator)',
    'Essay (Optional)'
  ],
  'city-guilds': [
    'English', 'Mathematics', 'Information Technology', 'Engineering',
    'Health and Social Care', 'Hospitality and Catering', 'Construction'
  ],
  'nvq-j': [
    'Customer Service', 'Business Administration', 'Information Technology',
    'Early Childhood Development', 'Food Preparation', 'Tourism', 'Agriculture'
  ],
};

// Sample tutors data
const tutors = [
  {
    id: 1,
    name: 'Dr. Simone Edwards',
    avatar: '/images/tutors/tutor1.jpg',
    subjects: ['CSEC Mathematics', 'CAPE Pure Mathematics'],
    rating: 4.9,
    reviews: 127,
    hourlyRate: '$30-45',
    availability: 'Evenings & Weekends',
    bio: 'Mathematics lecturer with 15+ years of experience. Specializes in preparing students for CSEC and CAPE mathematics examinations with a proven track record of excellent results.',
  },
  {
    id: 2,
    name: 'Mr. Xavier Douglas',
    avatar: '/images/tutors/tutor2.jpg',
    subjects: ['CSEC Physics', 'CSEC Chemistry', 'CAPE Physics'],
    rating: 4.7,
    reviews: 98,
    hourlyRate: '$30-40',
    availability: 'Weekdays & Saturdays',
    bio: 'Experienced physics and chemistry teacher with an MSc in Applied Physics. Known for breaking down complex concepts using relatable examples that Caribbean students connect with.',
  },
  {
    id: 3,
    name: 'Ms. Gabrielle Antoine',
    avatar: '/images/tutors/tutor3.jpg',
    subjects: ['CSEC English A', 'CSEC English B', 'CAPE Communication Studies'],
    rating: 4.8,
    reviews: 142,
    hourlyRate: '$25-35',
    availability: 'Flexible Hours',
    bio: 'Published author and language specialist with a passion for literature and communication. Uses creative methods to improve students\' writing skills and analytical abilities.',
  },
  {
    id: 4,
    name: 'Mr. Rohan Blackwood',
    avatar: '/images/tutors/tutor4.jpg',
    subjects: ['CSEC Information Technology', 'CAPE Computer Science'],
    rating: 4.6,
    reviews: 76,
    hourlyRate: '$30-50',
    availability: 'Afternoons & Weekends',
    bio: 'Software engineer and IT educator with expertise in programming and systems development. Helps students master both theoretical concepts and practical application of IT.',
  },
  {
    id: 5,
    name: 'Mrs. Nadine Clarke-Thompson',
    avatar: '/images/tutors/tutor5.jpg',
    subjects: ['CSEC Biology', 'CSEC Human and Social Biology', 'CAPE Biology'],
    rating: 4.8,
    reviews: 113,
    hourlyRate: '$25-40',
    availability: 'Weekday Evenings',
    bio: 'Biology specialist with an MSc in Marine Biology. Makes biology engaging through virtual labs and field-based examples relevant to Caribbean ecosystems.',
  },
  {
    id: 6,
    name: 'Mr. Andre Bartley',
    avatar: '/images/tutors/tutor6.jpg',
    subjects: ['CSEC Principles of Business', 'CSEC Principles of Accounts', 'CAPE Management of Business'],
    rating: 4.7,
    reviews: 89,
    hourlyRate: '$30-45',
    availability: 'Flexible Schedule',
    bio: 'Former business consultant with an MBA who shifted to education. Provides real-world context to business subjects and excels at guiding students through case studies.',
  },
  {
    id: 7,
    name: 'Dr. Marlon Roberts',
    avatar: '/images/tutors/tutor7.jpg',
    subjects: ['SAT Math', 'SAT Reading', 'SAT Writing'],
    rating: 4.9,
    reviews: 156,
    hourlyRate: '$40-60',
    availability: 'Evenings & Weekends',
    bio: 'SAT prep specialist with a PhD in Education. Has helped hundreds of Caribbean students achieve top scores for US university applications.',
  },
];

export default function ExamPrepHub() {
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tutorFilter, setTutorFilter] = useState('all');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Exam Preparation Hub</h1>
        <p className="text-gray-600">Comprehensive resources to help you excel in your exams</p>
      </div>
      
      {/* Main Tabs for different sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="resources" className="text-sm">Learning Resources</TabsTrigger>
          <TabsTrigger value="practice" className="text-sm">Practice Tests</TabsTrigger>
          <TabsTrigger value="tutors" className="text-sm">Find a Tutor</TabsTrigger>
          <TabsTrigger value="coursework" className="text-sm">Coursework Hub</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Select Exam Type Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Select Your Exam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Choose from a variety of examination types including CSEC, CAPE, BGCSE, and SAT.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {examTypes.slice(0, 4).map(exam => (
                    <Button 
                      key={exam.id} 
                      variant="outline" 
                      className="justify-start text-left h-auto py-3"
                    >
                      <span className="truncate text-sm">{exam.name.split(' ')[0]}</span>
                    </Button>
                  ))}
                </div>
                <Button variant="link" className="mt-2 p-0 h-auto text-sm text-blue-600">
                  View all exam types
                </Button>
              </CardContent>
            </Card>
            
            {/* Quick Start Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpenCheck className="h-5 w-5 mr-2 text-green-600" />
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Select your exam type and subject</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Review study notes and practice with flashcards</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Take practice tests to assess your knowledge</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Connect with a tutor for personalized help</span>
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  Start Learning Now
                </Button>
              </CardContent>
            </Card>
            
            {/* Stats Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Your Exam Prep Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Recently Practiced</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">CSEC Mathematics</span>
                      <Badge variant="outline" className="bg-blue-50">65% Accuracy</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Practice Tests</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">CSEC English A</span>
                      <Badge variant="outline" className="bg-amber-50">Scheduled</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Study Time This Week</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">3.5 hours</span>
                      <Button variant="link" className="p-0 h-auto text-xs text-blue-600">
                        View Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Featured Content Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Featured Resources</h2>
              <Button variant="link" className="text-blue-600">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">CSEC Mathematics Practice</CardTitle>
                  <CardDescription>Complete test with worked solutions</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 mb-2">CSEC</Badge>
                  <p className="text-sm text-gray-600">Test yourself with past paper style questions on key topics.</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full text-sm">Start Practice</Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">CAPE Biology Study Notes</CardTitle>
                  <CardDescription>Unit 1 complete revision</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-100 mb-2">CAPE</Badge>
                  <p className="text-sm text-gray-600">Comprehensive study notes covering all Unit 1 topics.</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full text-sm">View Notes</Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">SAT Reading & Writing</CardTitle>
                  <CardDescription>Strategy guide with examples</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 mb-2">SAT</Badge>
                  <p className="text-sm text-gray-600">Master techniques for the verbal section of the SAT.</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full text-sm">View Guide</Button>
                </CardFooter>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">BGCSE Science Flashcards</CardTitle>
                  <CardDescription>Key terms and concepts</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 mb-2">BGCSE</Badge>
                  <p className="text-sm text-gray-600">Digital flashcards to help memorize essential science concepts.</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full text-sm">Study Cards</Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </TabsContent>
        
        {/* Learning Resources Tab Content */}
        <TabsContent value="resources" className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Select Exam Type</label>
                <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map(exam => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Select Subject</label>
                <Select 
                  value={selectedSubject} 
                  onValueChange={setSelectedSubject}
                  disabled={!selectedExamType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedExamType ? "Choose a subject" : "Select exam type first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedExamType && subjects[selectedExamType as keyof typeof subjects]?.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="md:mb-0 bg-blue-600">
                <Search className="h-4 w-4 mr-2" />
                Find Resources
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Study Notes Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Study Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive, syllabus-specific notes organized by topic to enhance your understanding.
                </p>
                <ul className="space-y-2">
                  <li className="bg-gray-50 p-3 rounded text-sm">Key concepts and definitions</li>
                  <li className="bg-gray-50 p-3 rounded text-sm">Illustrated diagrams and examples</li>
                  <li className="bg-gray-50 p-3 rounded text-sm">Topic summaries and quick reviews</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Browse Study Notes</Button>
              </CardFooter>
            </Card>
            
            {/* Flashcards Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bookmark className="h-5 w-5 mr-2 text-green-600" />
                  Flashcards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Digital flashcards to help you memorize key information and test your knowledge.
                </p>
                <ul className="space-y-2">
                  <li className="bg-gray-50 p-3 rounded text-sm">Pre-made decks by subject and topic</li>
                  <li className="bg-gray-50 p-3 rounded text-sm">Interactive learning with instant feedback</li>
                  <li className="bg-gray-50 p-3 rounded text-sm">Track your progress and mastery</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Explore Flashcards</Button>
              </CardFooter>
            </Card>
            
            {/* Question Bank Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Question Bank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Thousands of questions with detailed solutions to help you practice and learn.
                </p>
                <ul className="space-y-2">
                  <li className="bg-gray-50 p-3 rounded text-sm">Multiple choice and short answer formats</li>
                  <li className="bg-gray-50 p-3 rounded text-sm">Questions organized by difficulty level</li>
                  <li className="bg-gray-50 p-3 rounded text-sm">Detailed explanations and worked solutions</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Access Question Bank</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Find a Tutor Tab Content */}
        <TabsContent value="tutors" className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">One-on-One Tutoring</h2>
            <p className="text-gray-600 mb-6">
              Connect with experienced tutors specializing in various subjects for personalized assistance.
              Our tutors have proven track records of helping students excel in their exams.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Find Tutors</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search by subject or exam" className="pl-10" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Filter By</label>
                <Select value={tutorFilter} onValueChange={setTutorFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tutors</SelectItem>
                    <SelectItem value="csec">CSEC Specialists</SelectItem>
                    <SelectItem value="cape">CAPE Specialists</SelectItem>
                    <SelectItem value="sat">SAT Specialists</SelectItem>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="md:mb-0 bg-indigo-600">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
          
          {/* Tutors List */}
          <div className="grid grid-cols-1 gap-4">
            {tutors.map(tutor => (
              <Card key={tutor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={tutor.avatar} alt={tutor.name} />
                        <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 font-medium">{tutor.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({tutor.reviews})</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{tutor.name}</h3>
                      <div className="flex flex-wrap gap-2 my-2">
                        {tutor.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{tutor.bio}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Hourly Rate:</span>
                          <span className="ml-2 font-medium">{tutor.hourlyRate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Availability:</span>
                          <span className="ml-2">{tutor.availability}</span>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="mr-2">View Profile</Button>
                          <Button size="sm" className="bg-blue-600">Book Session</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" className="mr-2">Previous</Button>
            <Button variant="outline" className="mr-2">1</Button>
            <Button variant="outline" className="bg-blue-50 mr-2">2</Button>
            <Button variant="outline" className="mr-2">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </TabsContent>
        
        {/* Other content tabs (simplified for now) */}
        <TabsContent value="practice" className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Your Knowledge</h2>
            <p className="text-gray-600 mb-6">
              Challenge yourself with practice tests designed to mirror actual exam conditions. 
              Track your progress and identify areas for improvement.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Builder Card */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpenCheck className="h-5 w-5 mr-2 text-blue-600" />
                    Test Builder
                  </CardTitle>
                  <CardDescription>
                    Create custom tests tailored to your needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Select specific topics and subtopics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Choose question types and difficulty levels</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Set time limits and test format</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Build Custom Test
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Full Exam Mode Card */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    Full Exam Mode
                  </CardTitle>
                  <CardDescription>
                    Simulate real exam conditions with full-length tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Complete mock exams with accurate timing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Experience realistic exam format and question mix</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Receive detailed performance analysis</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Take Mock Exam
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="coursework" className="space-y-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">Coursework Hub</h2>
            <p className="text-gray-600 mb-6">
              Access guidance and examples for School-Based Assessments (SBAs) and Internal Assessments (IAs).
              Get help with structured approaches to your coursework requirements.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Example Repository Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-amber-600" />
                    Example Repository
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Browse high-quality examples of completed coursework for reference and guidance.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">CSEC Biology SBA Examples</p>
                      <p className="text-gray-500 text-xs">Complete lab write-ups with annotations</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">CAPE Communication Studies IA</p>
                      <p className="text-gray-500 text-xs">Sample portfolios with feedback</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Repository</Button>
                </CardFooter>
              </Card>
              
              {/* Guidance Articles Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                    Guidance Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Read expert articles on how to approach and excel in different types of coursework.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">Choosing a Good SBA/IA Topic</p>
                      <p className="text-gray-500 text-xs">Tips for selecting manageable topics</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">Data Collection Techniques</p>
                      <p className="text-gray-500 text-xs">Methods and best practices</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Read Articles</Button>
                </CardFooter>
              </Card>
              
              {/* Self-Grading Tools Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Self-Grading Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Use interactive checklists based on official rubrics to evaluate your own coursework.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">CSEC Science SBA Checklist</p>
                      <p className="text-gray-500 text-xs">Verify all required elements</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="font-medium">CAPE Internal Assessment Evaluator</p>
                      <p className="text-gray-500 text-xs">Score your work against the marking scheme</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Access Tools</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}