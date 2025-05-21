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
  Plus,
  UserPlus,
  School,
  Globe,
  Video,
  MapPin,
  BellDot,
  MessageSquare,
  ArrowUpRight,
  CalendarRange,
  Share2,
  Mail,
  Lock,
  Settings,
  PlusCircle,
  Check,
  X,
  AlertCircle,
  Send,
  LinkIcon,
  FileText as FileTextIcon,
  ClipboardList,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
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

// Study Group types
interface StudyGroup {
  id: number;
  name: string;
  description: string;
  subject: string;
  examType: string;
  meetingFrequency: string;
  format: string;
  members: Member[];
  memberCount: number;
  isPublic: boolean;
  creator: Member;
  created: string;
  nextSession: {
    date: string;
    time: string;
    topic: string;
  } | null;
  tags: string[];
}

interface Member {
  id: number;
  name: string;
  avatar: string;
  role: "admin" | "moderator" | "member";
  school?: string;
  joined: string;
}

// Sample study groups
const studyGroups: StudyGroup[] = [
  {
    id: 1,
    name: "CSEC Mathematics Study Circle",
    description: "Weekly study sessions focusing on key CSEC Mathematics topics, problem-solving strategies, and exam preparation.",
    subject: "Mathematics",
    examType: "CSEC",
    meetingFrequency: "Weekly",
    format: "Online",
    members: [
      { id: 1, name: "Simone Edwards", avatar: "/images/avatars/avatar-1.jpg", role: "admin", school: "Kingston College", joined: "2025-03-15" },
      { id: 2, name: "Xavier Douglas", avatar: "/images/avatars/avatar-2.jpg", role: "moderator", school: "Campion College", joined: "2025-03-16" },
      { id: 3, name: "Gabrielle Antoine", avatar: "/images/avatars/avatar-3.jpg", role: "member", school: "Immaculate Conception", joined: "2025-03-20" },
    ],
    memberCount: 15,
    isPublic: true,
    creator: { id: 1, name: "Simone Edwards", avatar: "/images/avatars/avatar-1.jpg", role: "admin", school: "Kingston College", joined: "2025-03-15" },
    created: "2025-03-15",
    nextSession: {
      date: "2025-05-25",
      time: "4:00 PM - 5:30 PM",
      topic: "Algebraic Fractions & Factorization"
    },
    tags: ["Mathematics", "Algebra", "Calculus", "Exam Prep"]
  },
  {
    id: 2,
    name: "CAPE Biology Unit 1 Group",
    description: "Collaborative study sessions for CAPE Biology Unit 1. We focus on understanding concepts, analyzing past papers, and reviewing lab work.",
    subject: "Biology",
    examType: "CAPE",
    meetingFrequency: "Bi-weekly",
    format: "Hybrid",
    members: [
      { id: 5, name: "Nadine Clarke", avatar: "/images/avatars/avatar-5.jpg", role: "admin", school: "St. George's College", joined: "2025-02-10" },
      { id: 6, name: "Andre Bartley", avatar: "/images/avatars/avatar-6.jpg", role: "moderator", school: "Wolmer's Boys", joined: "2025-02-15" },
      { id: 7, name: "Marlon Roberts", avatar: "/images/avatars/avatar-7.jpg", role: "member", school: "Jamaica College", joined: "2025-02-20" },
    ],
    memberCount: 12,
    isPublic: true,
    creator: { id: 5, name: "Nadine Clarke", avatar: "/images/avatars/avatar-5.jpg", role: "admin", school: "St. George's College", joined: "2025-02-10" },
    created: "2025-02-10",
    nextSession: {
      date: "2025-05-27",
      time: "5:00 PM - 6:30 PM",
      topic: "Cell Structure & Function Review"
    },
    tags: ["Biology", "Cellular Biology", "Lab Work", "SBA Help"]
  },
  {
    id: 3,
    name: "SAT Preparation Team",
    description: "Intensive SAT prep group focusing on reading, writing, and math sections. We share resources, practice together, and provide feedback.",
    subject: "SAT Prep",
    examType: "SAT",
    meetingFrequency: "Twice Weekly",
    format: "Online",
    members: [
      { id: 8, name: "Tanya Williams", avatar: "/images/avatars/avatar-8.jpg", role: "admin", school: "American International School", joined: "2025-01-05" },
      { id: 9, name: "Jerome Henderson", avatar: "/images/avatars/avatar-9.jpg", role: "moderator", school: "Hillel Academy", joined: "2025-01-10" },
    ],
    memberCount: 8,
    isPublic: false,
    creator: { id: 8, name: "Tanya Williams", avatar: "/images/avatars/avatar-8.jpg", role: "admin", school: "American International School", joined: "2025-01-05" },
    created: "2025-01-05",
    nextSession: {
      date: "2025-05-22",
      time: "6:00 PM - 8:00 PM",
      topic: "Critical Reading & Analysis Practice"
    },
    tags: ["SAT", "Reading", "Math", "Writing", "College Prep"]
  },
  {
    id: 4,
    name: "CSEC Physics Challenge Group",
    description: "Group dedicated to mastering CSEC Physics through problem solving, experimentation discussions, and concept clarification.",
    subject: "Physics",
    examType: "CSEC",
    meetingFrequency: "Weekly",
    format: "Hybrid",
    members: [
      { id: 10, name: "Marcus Bennett", avatar: "/images/avatars/avatar-10.jpg", role: "admin", school: "Ardenne High", joined: "2025-04-01" },
      { id: 11, name: "Denise Forrest", avatar: "/images/avatars/avatar-11.jpg", role: "member", school: "St. Andrew High", joined: "2025-04-05" },
    ],
    memberCount: 10,
    isPublic: true,
    creator: { id: 10, name: "Marcus Bennett", avatar: "/images/avatars/avatar-10.jpg", role: "admin", school: "Ardenne High", joined: "2025-04-01" },
    created: "2025-04-01",
    nextSession: {
      date: "2025-05-26",
      time: "4:30 PM - 6:00 PM",
      topic: "Forces & Motion Review"
    },
    tags: ["Physics", "Mechanics", "Electricity", "Lab Work"]
  },
  {
    id: 5,
    name: "English Literature Discussion Circle",
    description: "Analysis and discussions on CAPE English Literature texts, themes, and writing techniques. Regular essay practice and feedback.",
    subject: "English Literature",
    examType: "CAPE",
    meetingFrequency: "Weekly",
    format: "In-Person",
    members: [
      { id: 12, name: "Olivia Simmons", avatar: "/images/avatars/avatar-12.jpg", role: "admin", school: "Wolmer's Girls", joined: "2025-03-01" },
      { id: 13, name: "Jason Murray", avatar: "/images/avatars/avatar-13.jpg", role: "moderator", school: "Campion College", joined: "2025-03-05" },
    ],
    memberCount: 7,
    isPublic: true,
    creator: { id: 12, name: "Olivia Simmons", avatar: "/images/avatars/avatar-12.jpg", role: "admin", school: "Wolmer's Girls", joined: "2025-03-01" },
    created: "2025-03-01",
    nextSession: {
      date: "2025-05-24",
      time: "2:00 PM - 4:00 PM",
      topic: "Shakespeare's Macbeth - Character Analysis"
    },
    tags: ["Literature", "Writing", "Literary Analysis", "Poetry"]
  },
];

// Upcoming study sessions across all groups
const upcomingSessions = [
  {
    id: 1,
    groupId: 1,
    groupName: "CSEC Mathematics Study Circle",
    date: "2025-05-25",
    time: "4:00 PM - 5:30 PM",
    topic: "Algebraic Fractions & Factorization",
    format: "Online",
    link: "https://meet.example.com/math-circle",
  },
  {
    id: 2,
    groupId: 3,
    groupName: "SAT Preparation Team",
    date: "2025-05-22",
    time: "6:00 PM - 8:00 PM",
    topic: "Critical Reading & Analysis Practice",
    format: "Online",
    link: "https://meet.example.com/sat-prep",
  },
  {
    id: 3,
    groupId: 5,
    groupName: "English Literature Discussion Circle",
    date: "2025-05-24",
    time: "2:00 PM - 4:00 PM",
    topic: "Shakespeare's Macbeth - Character Analysis",
    format: "In-Person",
    location: "Kingston Public Library, Meeting Room 2",
  },
  {
    id: 4,
    groupId: 4,
    groupName: "CSEC Physics Challenge Group",
    date: "2025-05-26",
    time: "4:30 PM - 6:00 PM",
    topic: "Forces & Motion Review",
    format: "Hybrid",
    link: "https://meet.example.com/physics-group",
    location: "St. Andrew Science Lab",
  },
  {
    id: 5,
    groupId: 2,
    groupName: "CAPE Biology Unit 1 Group",
    date: "2025-05-27",
    time: "5:00 PM - 6:30 PM",
    topic: "Cell Structure & Function Review",
    format: "Hybrid",
    link: "https://meet.example.com/bio-group",
    location: "St. George's Biology Lab",
  },
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

// Mock friends list for invitation feature
const friendsList = [
  { id: 101, name: "Tanesha Brown", email: "tanesha.b@email.com", avatar: "/images/avatars/avatar-11.jpg", school: "Campion College" },
  { id: 102, name: "Marcus Powell", email: "marcus.p@email.com", avatar: "/images/avatars/avatar-12.jpg", school: "Wolmer's Boys School" },
  { id: 103, name: "Simone James", email: "simone.j@email.com", avatar: "/images/avatars/avatar-13.jpg", school: "Immaculate Conception High" },
  { id: 104, name: "Devon Richards", email: "devon.r@email.com", avatar: "/images/avatars/avatar-14.jpg", school: "Kingston College" },
  { id: 105, name: "Kimberly Grant", email: "kimberly.g@email.com", avatar: "/images/avatars/avatar-15.jpg", school: "St. Andrew High School" },
];

// Mock shared resources for resource sharing feature
const sharedResources = [
  { id: 201, name: "CSEC Biology Past Papers (2020-2025)", type: "PDF", size: "4.2 MB", sharedBy: "Nadine Clarke", sharedOn: "2025-05-01" },
  { id: 202, name: "Chemistry Lab Techniques Video", type: "Video", size: "145 MB", sharedBy: "Jason Miller", sharedOn: "2025-05-08" },
  { id: 203, name: "CAPE Physics Formula Sheet", type: "PDF", size: "1.8 MB", sharedBy: "Andre Lopez", sharedOn: "2025-04-29" },
  { id: 204, name: "SAT Reading Comprehension Strategies", type: "PDF", size: "3.5 MB", sharedBy: "Tanya Williams", sharedOn: "2025-05-12" },
  { id: 205, name: "History Timeline Infographic", type: "Image", size: "2.1 MB", sharedBy: "Michelle Thompson", sharedOn: "2025-05-05" },
];

// Mock group tasks for task management feature
const groupTasks = [
  { id: 301, title: "Complete Biology Chapter 5 Review", assignedTo: ["Jason Miller", "Michelle Thompson"], dueDate: "2025-05-25", status: "In Progress" },
  { id: 302, title: "Practice Lab Report Writing", assignedTo: ["Nadine Clarke", "Andre Lopez"], dueDate: "2025-05-28", status: "Not Started" },
  { id: 303, title: "Create Study Guide for Ecosystems", assignedTo: ["All Members"], dueDate: "2025-06-05", status: "Not Started" },
  { id: 304, title: "Review Mock Exam Questions", assignedTo: ["Michelle Thompson"], dueDate: "2025-05-22", status: "Completed" },
  { id: 305, title: "Prepare Group Presentation", assignedTo: ["Jason Miller", "Michelle Thompson", "Andre Lopez"], dueDate: "2025-06-10", status: "Not Started" },
];

export default function ExamPrepHub() {
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tutorFilter, setTutorFilter] = useState('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showResourcesDialog, setShowResourcesDialog] = useState(false);
  const [showTasksDialog, setShowTasksDialog] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [createGroupStep, setCreateGroupStep] = useState(1);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  
  // New group form state
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    subject: '',
    examType: '',
    meetingFrequency: 'Weekly',
    format: 'Online',
    isPublic: true,
    tags: [] as string[]
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Exam Preparation Hub</h1>
        <p className="text-gray-600">Comprehensive resources to help you excel in your exams</p>
      </div>
      
      {/* Main Tabs for different sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="resources" className="text-sm">Learning Resources</TabsTrigger>
          <TabsTrigger value="practice" className="text-sm">Practice Tests</TabsTrigger>
          <TabsTrigger value="study-groups" className="text-sm">Study Groups</TabsTrigger>
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
        
        {/* Study Groups Tab Content */}
        <TabsContent value="study-groups" className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Collaborative Study Groups</h2>
                <p className="text-gray-600">
                  Join or create peer study groups to collaborate, share resources, and learn together with other students.
                </p>
              </div>
              <Button 
                className="mt-3 md:mt-0 bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                onClick={() => {
                  setShowCreateGroupDialog(true);
                  setCreateGroupStep(1);
                  setNewGroup({
                    name: '',
                    description: '',
                    subject: '',
                    examType: '',
                    meetingFrequency: 'Weekly',
                    format: 'Online',
                    isPublic: true,
                    tags: []
                  });
                }}
              >
                <Plus className="h-4 w-4" /> Create Group
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Search Groups</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search by subject, exam, or topic" className="pl-10" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-subjects">All Subjects</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Exams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-exams">All Exams</SelectItem>
                      <SelectItem value="csec">CSEC</SelectItem>
                      <SelectItem value="cape">CAPE</SelectItem>
                      <SelectItem value="sat">SAT</SelectItem>
                      <SelectItem value="bgcse">BGCSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-formats">Any Format</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Study Groups List */}
          <div className="grid grid-cols-1 gap-4">
            {studyGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center">
                            {group.name}
                            {!group.isPublic && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600">
                                Private
                              </Badge>
                            )}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1 mb-2">
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600">
                              {group.examType}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 text-green-600">
                              {group.subject}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50 text-purple-600">
                              {group.format}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1" /> 
                          <span>{group.memberCount} members</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-4">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                          <span>Meets {group.meetingFrequency}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                          <span>Created by {group.creator.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Since {new Date(group.created).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {group.nextSession && (
                        <div className="bg-blue-50 p-3 rounded-md mb-4">
                          <p className="text-sm font-medium text-blue-700 mb-1">Next Session</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-700">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-blue-500" />
                              <span>{new Date(group.nextSession.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-blue-500" />
                              <span>{group.nextSession.time}</span>
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-1 text-blue-500" />
                              <span>{group.nextSession.topic}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="border-2 border-white h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                          {group.memberCount > 3 && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium">
                              +{group.memberCount - 3}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="flex gap-1 items-center">
                                <MessageCircle className="h-4 w-4" /> Group Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                  setActiveGroupId(group.id);
                                  setShowResourcesDialog(true);
                                }}
                              >
                                <Share2 className="h-4 w-4" /> Share Resources
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                  setActiveGroupId(group.id);
                                  setShowTasksDialog(true);
                                }}
                              >
                                <ClipboardList className="h-4 w-4" /> View Tasks
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                  setActiveGroupId(group.id);
                                  setShowInviteDialog(true);
                                  setSelectedFriends([]);
                                }}
                              >
                                <UserPlus className="h-4 w-4" /> Invite Friends
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                <Settings className="h-4 w-4" /> Group Settings
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button size="sm" className="bg-indigo-600 flex gap-1 items-center">
                            <UserPlus className="h-4 w-4" /> Join Group
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Upcoming Sessions Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Upcoming Study Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingSessions.slice(0, 4).map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="w-20 flex flex-col items-center justify-center text-center bg-indigo-50 p-2 rounded-lg">
                        <p className="text-lg font-bold text-indigo-800">
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs font-medium text-indigo-600">{session.time.split(' - ')[0]}</p>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-base font-semibold">{session.topic}</h3>
                        <p className="text-sm text-indigo-600 mb-2">{session.groupName}</p>
                        
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mb-3">
                          <div className="flex items-center">
                            {session.format === "Online" ? (
                              <Video className="h-3 w-3 mr-1" />
                            ) : session.format === "In-Person" ? (
                              <MapPin className="h-3 w-3 mr-1" />
                            ) : (
                              <Globe className="h-3 w-3 mr-1" />
                            )}
                            <span>{session.format}</span>
                          </div>
                          {session.location && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-36">{session.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {session.link && (
                            <Button size="sm" className="text-xs h-7 bg-indigo-600">
                              Join Online
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline">View All Sessions</Button>
            </div>
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

      {/* Friend Invitation Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Friends to Study Group</DialogTitle>
            <DialogDescription>
              Select friends to invite to your study group. They'll receive an invitation to join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search friends by name or school" className="pl-10" />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {friendsList.map((friend) => (
                <div 
                  key={friend.id} 
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{friend.name}</p>
                      <p className="text-xs text-gray-500">{friend.school}</p>
                    </div>
                  </div>
                  <Checkbox 
                    checked={selectedFriends.includes(friend.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFriends([...selectedFriends, friend.id]);
                      } else {
                        setSelectedFriends(selectedFriends.filter(id => id !== friend.id));
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <div className="text-sm text-gray-500">
              {selectedFriends.length} friends selected
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-indigo-600 gap-2">
                <Send className="h-4 w-4" /> Send Invitations
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Sharing Dialog */}
      <Dialog open={showResourcesDialog} onOpenChange={setShowResourcesDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Shared Study Resources</DialogTitle>
            <DialogDescription>
              Access and share study materials within your group to help everyone prepare for exams.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search resources" className="pl-10" />
              </div>
              <Button className="bg-indigo-600">
                <PlusCircle className="h-4 w-4 mr-2" /> Upload Resource
              </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-3 border-b text-sm font-medium text-gray-600">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Shared By</div>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y">
                {sharedResources.map((resource) => (
                  <div key={resource.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50">
                    <div className="col-span-6 flex items-center gap-2">
                      {resource.type === 'PDF' && <FileTextIcon className="h-4 w-4 text-red-500" />}
                      {resource.type === 'Video' && <Video className="h-4 w-4 text-blue-500" />}
                      {resource.type === 'Image' && <FileTextIcon className="h-4 w-4 text-green-500" />}
                      <span className="text-sm">{resource.name}</span>
                    </div>
                    <div className="col-span-2 text-sm">{resource.type}</div>
                    <div className="col-span-2 text-sm">{resource.size}</div>
                    <div className="col-span-2 text-sm">{resource.sharedBy}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowResourcesDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Tasks Dialog */}
      <Dialog open={showTasksDialog} onOpenChange={setShowTasksDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Study Group Tasks</DialogTitle>
            <DialogDescription>
              Track and manage study tasks for your group to keep everyone on the same page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search tasks" className="pl-10" />
              </div>
              <Button className="bg-indigo-600">
                <PlusCircle className="h-4 w-4 mr-2" /> Add New Task
              </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-3 border-b text-sm font-medium text-gray-600">
                <div className="col-span-5">Task</div>
                <div className="col-span-3">Assigned To</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2">Status</div>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y">
                {groupTasks.map((task) => (
                  <div key={task.id} className="grid grid-cols-12 p-3 items-center hover:bg-gray-50">
                    <div className="col-span-5 flex items-center gap-2">
                      {task.status === 'Completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : task.status === 'In Progress' ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm">{task.title}</span>
                    </div>
                    <div className="col-span-3 text-sm">
                      {task.assignedTo.length > 2 
                        ? `${task.assignedTo[0]} +${task.assignedTo.length - 1} more`
                        : task.assignedTo.join(', ')}
                    </div>
                    <div className="col-span-2 text-sm">{task.dueDate}</div>
                    <div className="col-span-2">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${task.status === 'Completed' ? 'bg-green-50 text-green-600' : 
                            task.status === 'In Progress' ? 'bg-yellow-50 text-yellow-600' : 
                            'bg-gray-50 text-gray-600'}
                        `}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowTasksDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Study Group Dialog */}
      <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Create a New Study Group</DialogTitle>
            <DialogDescription>
              Set up your study group to collaborate and prepare for exams with other students.
            </DialogDescription>
          </DialogHeader>
          
          {/* Step indicator */}
          <div className="relative mb-6 mt-2">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${createGroupStep >= 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                  1
                </div>
                <span className="mt-2 text-xs font-medium">Details</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${createGroupStep >= 2 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                  2
                </div>
                <span className="mt-2 text-xs font-medium">Settings</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${createGroupStep >= 3 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                  3
                </div>
                <span className="mt-2 text-xs font-medium">Invitations</span>
              </div>
            </div>
          </div>
          
          {/* Step 1: Group Details */}
          {createGroupStep === 1 && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="group-name" className="text-sm font-medium">Group Name*</label>
                <Input 
                  id="group-name" 
                  placeholder="Enter a descriptive name for your group" 
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="group-description" className="text-sm font-medium">Description*</label>
                <textarea 
                  id="group-description" 
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Describe your group's focus, goals, and what members can expect"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Type*</label>
                  <Select 
                    value={newGroup.examType}
                    onValueChange={(value) => setNewGroup({...newGroup, examType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject*</label>
                  <Input 
                    placeholder="e.g. Biology, Mathematics, English" 
                    value={newGroup.subject}
                    onChange={(e) => setNewGroup({...newGroup, subject: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Group Settings */}
          {createGroupStep === 2 && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Meeting Frequency</label>
                <Select 
                  value={newGroup.meetingFrequency}
                  onValueChange={(value) => setNewGroup({...newGroup, meetingFrequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How often will you meet?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="As Needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Meeting Format</label>
                <Select 
                  value={newGroup.format}
                  onValueChange={(value) => setNewGroup({...newGroup, format: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How will you meet?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Tags (Optional)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newGroup.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setNewGroup({
                          ...newGroup, 
                          tags: newGroup.tags.filter((_, i) => i !== index)
                        })}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    id="tag-input" 
                    placeholder="Add a tag (e.g. SBA Help, Lab Work)" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        setNewGroup({
                          ...newGroup,
                          tags: [...newGroup.tags, e.currentTarget.value.trim()]
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const input = document.getElementById('tag-input') as HTMLInputElement;
                      if (input.value.trim()) {
                        setNewGroup({
                          ...newGroup,
                          tags: [...newGroup.tags, input.value.trim()]
                        });
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="public-group" 
                  checked={newGroup.isPublic}
                  onCheckedChange={(checked) => 
                    setNewGroup({...newGroup, isPublic: checked as boolean})
                  }
                />
                <label
                  htmlFor="public-group"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Make this group public and discoverable in search
                </label>
              </div>
            </div>
          )}
          
          {/* Step 3: Invite Members */}
          {createGroupStep === 3 && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-gray-600">Invite friends to join your study group from the start. You can always invite more people later.</p>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search friends by name or school" className="pl-10" />
              </div>
              
              <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2">
                {friendsList.map((friend) => (
                  <div 
                    key={friend.id} 
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{friend.name}</p>
                        <p className="text-xs text-gray-500">{friend.school}</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFriends([...selectedFriends, friend.id]);
                        } else {
                          setSelectedFriends(selectedFriends.filter(id => id !== friend.id));
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between mt-6">
            {createGroupStep > 1 ? (
              <Button variant="outline" onClick={() => setCreateGroupStep(createGroupStep - 1)}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setShowCreateGroupDialog(false)}>
                Cancel
              </Button>
            )}
            
            {createGroupStep < 3 ? (
              <Button 
                className="bg-indigo-600"
                onClick={() => setCreateGroupStep(createGroupStep + 1)}
                disabled={createGroupStep === 1 && (!newGroup.name || !newGroup.description || !newGroup.examType || !newGroup.subject)}
              >
                Continue
              </Button>
            ) : (
              <Button 
                className="bg-indigo-600"
                onClick={() => {
                  // Handle study group creation here
                  setShowCreateGroupDialog(false);
                  // Reset form and show success message or redirect
                }}
              >
                Create Group
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}