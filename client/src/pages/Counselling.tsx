import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Video, User, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Counsellor data
const counsellors = [
  {
    id: 1,
    name: "Dr. Amara Johnson",
    avatar: "",
    title: "Senior Education Advisor",
    specialties: ["US Applications", "Medical Schools", "Scholarship Guidance"],
    experience: "12 years",
    education: "Ph.D. in Educational Psychology, Harvard University",
    location: "Kingston, Jamaica",
    languages: ["English", "Spanish"],
    bio: "Dr. Johnson specializes in guiding Caribbean students through competitive US medical school applications. With over a decade of experience, she has helped hundreds of students secure scholarships and placements at top institutions."
  },
  {
    id: 2,
    name: "Michael Chen, M.Ed.",
    avatar: "",
    title: "International Admissions Specialist",
    specialties: ["Canadian Immigration", "Engineering Programs", "Graduate Applications"],
    experience: "8 years",
    education: "M.Ed. in Higher Education, University of Toronto",
    location: "Port of Spain, Trinidad",
    languages: ["English", "Mandarin"],
    bio: "Michael's expertise lies in navigating the Canadian education system and immigration processes. He provides strategic guidance for engineering and technical program applications with a special focus on research opportunities."
  },
  {
    id: 3,
    name: "Sophia Williams",
    avatar: "",
    title: "Career Counsellor & Essay Coach",
    specialties: ["Personal Statements", "Interview Preparation", "UK Universities"],
    experience: "6 years",
    education: "M.A. in Creative Writing, University of Edinburgh",
    location: "Bridgetown, Barbados",
    languages: ["English", "French"],
    bio: "Sophia combines her writing expertise with in-depth knowledge of UK university admissions to help students craft compelling personal statements. She also provides comprehensive interview coaching for Oxbridge and Russell Group applications."
  },
  {
    id: 4,
    name: "Dr. Rajiv Patel",
    avatar: "",
    title: "STEM Education Specialist",
    specialties: ["Technology Programs", "Research Applications", "Scholarship Applications"],
    experience: "15 years",
    education: "Ph.D. in Computer Science, MIT",
    location: "Georgetown, Guyana",
    languages: ["English", "Hindi"],
    bio: "With a background in computer science research, Dr. Patel specializes in guiding students toward technology and engineering programs. He helps students identify research opportunities and prepare competitive applications for STEM scholarships."
  },
  {
    id: 5,
    name: "Gabriela Sanchez",
    avatar: "",
    title: "Arts & Humanities Advisor",
    specialties: ["Visual Arts Programs", "Portfolio Development", "Creative Scholarships"],
    experience: "9 years",
    education: "MFA in Fine Arts, Rhode Island School of Design",
    location: "San Juan, Puerto Rico",
    languages: ["English", "Spanish"],
    bio: "Gabriela guides creative students through specialized arts program applications. She provides portfolio development advice and helps students navigate audition processes for performing arts and fine arts programs worldwide."
  },
  {
    id: 6,
    name: "Thomas Bennett",
    avatar: "",
    title: "Financial Aid Specialist",
    specialties: ["Scholarship Applications", "Financial Planning", "Budget Guidance"],
    experience: "11 years",
    education: "MBA in Finance, London School of Economics",
    location: "Nassau, Bahamas",
    languages: ["English"],
    bio: "Thomas specializes in helping students navigate the financial aspects of international education. He provides expert guidance on scholarship applications, student loans, and developing realistic financial plans for studying abroad."
  },
  {
    id: 7,
    name: "Dr. Leila Abrams",
    avatar: "",
    title: "Medical & Health Sciences Advisor",
    specialties: ["Pre-Med Programs", "Nursing Applications", "Healthcare Careers"],
    experience: "14 years",
    education: "M.D., Johns Hopkins University",
    location: "Kingston, Jamaica",
    languages: ["English", "Arabic"],
    bio: "Dr. Abrams provides specialized guidance for students pursuing medical and health science careers. With experience as a medical school admissions committee member, she offers insider perspective on competitive healthcare program applications."
  },
  {
    id: 8,
    name: "James Wilson",
    avatar: "",
    title: "Graduate Studies Expert",
    specialties: ["MBA Applications", "Law School Admissions", "Advanced Degrees"],
    experience: "10 years",
    education: "J.D., Yale Law School",
    location: "St. George's, Grenada",
    languages: ["English"],
    bio: "James specializes in graduate-level applications, particularly for MBA and law programs. He provides comprehensive guidance on entrance exams, application strategies, and connecting educational choices with long-term career goals."
  },
  {
    id: 9,
    name: "Anika Forsyth",
    avatar: "",
    title: "Student Transition Specialist",
    specialties: ["First-Year Experience", "Cultural Adjustment", "Student Wellbeing"],
    experience: "7 years",
    education: "M.Sc. in Psychology, University of the West Indies",
    location: "Castries, St. Lucia",
    languages: ["English", "French"],
    bio: "Anika focuses on the emotional and psychological aspects of studying abroad. She provides guidance on cultural adjustment, homesickness, and developing healthy coping strategies for the challenges of international education."
  },
  {
    id: 10,
    name: "David Kwong",
    avatar: "",
    title: "Technology & Digital Media Specialist",
    specialties: ["Computer Science", "Digital Arts", "Tech Scholarships"],
    experience: "8 years",
    education: "M.Sc. in Computer Science, Stanford University",
    location: "Port of Spain, Trinidad",
    languages: ["English", "Cantonese"],
    bio: "David specializes in technology education pathways, including computer science, digital media, and emerging tech fields. He helps students identify programs aligned with specific tech career goals and prepare competitive applications."
  }
];

const Counselling = () => {
  const [selectedCounsellor, setSelectedCounsellor] = useState<number | null>(null);

  return (
    <div className="space-y-8 pb-8">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Counselling Services</h1>
      
      <div className="space-y-8">
        {/* Service Options */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Service Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2 flex flex-col items-center">
                <CardTitle className="text-md font-semibold flex flex-col items-center">
                  <MessageCircle className="h-8 w-8 mb-2 text-primary" />
                  Chat Consultation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Connect with an education counselor via text chat to get quick answers to your questions.
                </p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2 flex flex-col items-center">
                <CardTitle className="text-md font-semibold flex flex-col items-center">
                  <Video className="h-8 w-8 mb-2 text-primary" />
                  Video Consultation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Schedule a face-to-face video session with an education advisor for in-depth guidance.
                </p>
                <Button className="w-full">Book Session</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2 flex flex-col items-center">
                <CardTitle className="text-md font-semibold flex flex-col items-center">
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  Application Review
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Get expert feedback on your application materials before submitting to institutions.
                </p>
                <Button className="w-full">Request Review</Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Upcoming Sessions */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-center">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">No Upcoming Sessions</h2>
            <p className="max-w-md mx-auto">
              You haven't scheduled any counselling sessions yet. Book a session to get personalized guidance for your educational journey.
            </p>
          </CardContent>
        </Card>
        
        {/* Choose Your Counsellor */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Choose Your Counsellor</h2>
            <p className="text-gray-600">
              Select a counsellor who specializes in your areas of interest for personalized guidance on your educational journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counsellors.map((counsellor) => (
              <Card 
                key={counsellor.id} 
                className={`bg-white transition-all ${
                  selectedCounsellor === counsellor.id 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'shadow-sm hover:shadow-md'
                }`}
                onClick={() => setSelectedCounsellor(
                  selectedCounsellor === counsellor.id ? null : counsellor.id
                )}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-16 w-16 border-2 border-gray-100">
                    <AvatarFallback>{counsellor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    <AvatarImage src={counsellor.avatar} alt={counsellor.name} />
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{counsellor.name}</CardTitle>
                    <CardDescription>{counsellor.title}</CardDescription>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{counsellor.location}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{counsellor.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{counsellor.education}</span>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-1">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {counsellor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {counsellor.bio}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button className="w-full">
                    Schedule with {counsellor.name.split(' ')[0]}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Counselling;
