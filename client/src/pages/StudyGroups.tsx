import React, { useState } from "react";
import { Link } from "wouter";
import {
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  MessageCircle,
  Video,
  Globe,
  Plus,
  UserPlus,
  School,
  Star,
  ChevronRight,
  GraduationCap,
  BellDot,
  MessageSquare,
  CalendarRange,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define types
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

// Dummy data for study groups
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

// Form schema for creating a study group
const createGroupSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(500),
  subject: z.string().min(1, "Please select a subject"),
  examType: z.string().min(1, "Please select an exam type"),
  meetingFrequency: z.string().min(1, "Please select a meeting frequency"),
  format: z.string().min(1, "Please select a format"),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

export default function StudyGroups() {
  const [activeTab, setActiveTab] = useState("discover");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterExamType, setFilterExamType] = useState("");
  const [filterFormat, setFilterFormat] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Form for creating a study group
  const form = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      examType: "",
      meetingFrequency: "Weekly",
      format: "Online",
      isPublic: true,
      tags: [],
    },
  });
  
  const onSubmit = (values: z.infer<typeof createGroupSchema>) => {
    console.log(values);
    // In a real implementation, we would send this data to the server
    // and create a new study group
    setShowCreateDialog(false);
    form.reset();
  };
  
  // Filter function for study groups
  const filteredGroups = studyGroups.filter(group => {
    if (filterSubject && group.subject !== filterSubject) return false;
    if (filterExamType && group.examType !== filterExamType) return false;
    if (filterFormat && group.format !== filterFormat) return false;
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Study Groups</h1>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </div>
        <p className="text-gray-600">Join or create study groups to collaborate with peers and excel in your exams</p>
      </div>
      
      {/* Main Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="discover">Discover Groups</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
        </TabsList>
        
        {/* Discover Groups Tab Content */}
        <TabsContent value="discover" className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 md:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Search Groups</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search by name, subject or topic" className="pl-10" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="English Literature">English Literature</SelectItem>
                      <SelectItem value="SAT Prep">SAT Prep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Type</label>
                  <Select value={filterExamType} onValueChange={setFilterExamType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Exams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Exams</SelectItem>
                      <SelectItem value="CSEC">CSEC</SelectItem>
                      <SelectItem value="CAPE">CAPE</SelectItem>
                      <SelectItem value="SAT">SAT</SelectItem>
                      <SelectItem value="BGCSE">BGCSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select value={filterFormat} onValueChange={setFilterFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Format</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="In-Person">In-Person</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" className="md:mb-0" onClick={() => {
                setFilterSubject("");
                setFilterExamType("");
                setFilterFormat("");
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredGroups.map((group) => (
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
                          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
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
                              <Calendar className="h-3 w-3 mr-1 text-blue-500" />
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
                          <Button variant="outline" size="sm" className="flex gap-1 items-center">
                            <MessageCircle className="h-4 w-4" /> Preview
                          </Button>
                          <Button size="sm" className="bg-blue-600 flex gap-1 items-center">
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
        </TabsContent>
        
        {/* My Groups Tab Content */}
        <TabsContent value="my-groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="bg-blue-100 p-6 rounded-full">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">You're not in any study groups yet</h3>
                    <p className="text-gray-600 mb-4">
                      Join or create a study group to collaborate with peers, share resources, and excel in your exams.
                      Study groups help enhance learning through discussion, peer teaching, and motivation.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                        onClick={() => setShowCreateDialog(true)}
                      >
                        <Plus className="h-4 w-4" /> Create Group
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => setActiveTab("discover")}
                      >
                        <Search className="h-4 w-4" /> Discover Groups
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Upcoming Sessions Tab Content */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {upcomingSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-48 flex flex-col items-center justify-center text-center bg-blue-50 p-4 rounded-lg">
                      <p className="text-xl font-bold text-blue-800">
                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm font-medium text-blue-600">{session.time}</p>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{session.topic}</h3>
                          <p className="text-indigo-600 font-medium">
                            {session.groupName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                          <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          {session.format === "Online" ? (
                            <Video className="h-4 w-4 mr-2 text-indigo-500" />
                          ) : session.format === "In-Person" ? (
                            <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                          ) : (
                            <Globe className="h-4 w-4 mr-2 text-indigo-500" />
                          )}
                          <span>{session.format}</span>
                        </div>
                      </div>
                      
                      {session.location && (
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mr-2 text-green-500" />
                          <span>{session.location}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        {session.link && (
                          <Button size="sm" className="bg-indigo-600 flex gap-1 items-center">
                            <Video className="h-4 w-4" /> Join Online
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="flex gap-1 items-center">
                          <CalendarRange className="h-4 w-4" /> Add to Calendar
                        </Button>
                        <Button variant="outline" size="sm" className="flex gap-1 items-center">
                          <MessageSquare className="h-4 w-4" /> Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {upcomingSessions.length === 0 && (
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Calendar className="h-10 w-10 text-gray-400" />
                    <h3 className="text-lg font-medium">No upcoming sessions</h3>
                    <p className="text-gray-600">
                      You don't have any upcoming study sessions scheduled.
                      Join a study group to participate in regular study sessions.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setActiveTab("discover")}
                    >
                      Discover Groups
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating a new study group */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Study Group</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new study group. You'll be able to invite members after creation.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CSEC Mathematics Study Circle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose, goals, and activities of your study group..." 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Literature">Literature</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Geography">Geography</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="SAT Prep">SAT Prep</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exam type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CSEC">CSEC</SelectItem>
                          <SelectItem value="CAPE">CAPE</SelectItem>
                          <SelectItem value="SAT">SAT</SelectItem>
                          <SelectItem value="BGCSE">BGCSE</SelectItem>
                          <SelectItem value="City & Guilds">City & Guilds</SelectItem>
                          <SelectItem value="NVQ-J">NVQ-J</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="meetingFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Frequency</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How often will you meet?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Twice Weekly">Twice Weekly</SelectItem>
                          <SelectItem value="As Needed">As Needed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Meeting format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Online">Online</SelectItem>
                          <SelectItem value="In-Person">In-Person</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Public Group</FormLabel>
                      <FormDescription>
                        Allow anyone to discover and request to join your group
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600">
                  Create Group
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}