import React, { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Brain, Briefcase, GraduationCap, Lightbulb, Target, MessageCircle, Calendar, Video, User, MapPin, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PersonalityHub = () => {
  const [, navigate] = useLocation();
  const [selectedCounsellor, setSelectedCounsellor] = useState<number | null>(null);
  const [guidanceType, setGuidanceType] = useState("one-on-one");
  
  // Personality counsellors data
  const counsellors = [
    {
      id: 1,
      name: "Dr. Shanice Thompson",
      avatar: "",
      title: "Career & Personality Specialist",
      specialties: ["Personality Assessment", "Career Mapping", "Personal Development"],
      location: "Kingston, Jamaica",
      experience: "12 years",
      education: "Ph.D. in Psychology, UWI",
      costRange: "$80-120 per hour",
      rating: 4.9,
      reviewCount: 127,
      bio: "Dr. Thompson specializes in helping students understand their personality traits and how they relate to various career paths. She provides in-depth personality analysis and career guidance based on your unique attributes."
    },
    {
      id: 2,
      name: "Kwame Richardson, M.Ed.",
      avatar: "",
      title: "Youth Career Counsellor",
      specialties: ["Career Development", "Strengths Analysis", "Future Planning"],
      location: "Port of Spain, Trinidad",
      experience: "8 years",
      education: "M.Ed. in Counselling Psychology, UTT",
      costRange: "$75-100 per hour",
      rating: 4.7,
      reviewCount: 92,
      bio: "Kwame's approach combines strengths-based assessment with practical career guidance. He focuses on helping students identify their natural talents and matching them with fulfilling career options."
    },
    {
      id: 3,
      name: "Rhianna Blackman",
      avatar: "",
      title: "Holistic Development Coach",
      specialties: ["Self-Discovery", "Life Purpose", "Career Transition"],
      location: "Bridgetown, Barbados",
      experience: "6 years",
      education: "M.A. in Counselling, UWI Cave Hill",
      costRange: "$70-90 per hour",
      rating: 4.8,
      reviewCount: 84,
      bio: "Rhianna takes a holistic approach to personality and career counselling, helping students discover their core values, passions, and purpose. She specializes in guiding students through major life and career decisions."
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 blur-xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">🧠 Personality Hub</h1>
          <p className="text-xl text-white/90">Discover your unique strengths and find your perfect career path</p>
        </div>
      </div>
      
      {/* Main Assessment Card */}
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 shadow-xl overflow-hidden">
        <CardHeader className="p-8 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                <Brain className="mr-3 h-7 w-7 text-purple-600" />
                Personality & Career Navigator
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">Comprehensive assessment of your preferences, interests, and work styles</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">✨ Recommended</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <span className="text-center font-bold text-gray-800">Learning Style</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-center font-bold text-gray-800">Interest Areas</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-center font-bold text-gray-800">Career Matches</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6 text-lg leading-relaxed text-center">
            Take our comprehensive assessment to discover your unique personality profile, learning style, and get personalized recommendations for educational programs and career paths that match your strengths and preferences.
          </p>
          
          <div className="text-center">
            <Button 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={() => navigate("/app/personality-assessment")}
            >
              🚀 Take Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              <GraduationCap className="mr-3 h-6 w-6 text-blue-600" />
              Learning Style Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover your preferred learning style and get personalized study strategies to maximize your educational success.
            </p>
            <Button 
              variant="outline" 
              disabled 
              className="w-full rounded-full border-2 border-blue-200 text-blue-400"
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
          <CardHeader className="p-6">
            <CardTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              <Briefcase className="mr-3 h-6 w-6 text-green-600" />
              Career Interest Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Explore potential career paths that align with your interests, skills, and personality traits.
            </p>
            <Button 
              variant="outline" 
              disabled 
              className="w-full rounded-full border-2 border-green-200 text-green-400"
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Personality & Career Counsellors Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageCircle className="mr-2 h-5 w-5 text-purple-600" />
          Personality & Career Counsellors
        </h2>
        
        <Card className="bg-white shadow-sm border-purple-100 mb-6">
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-4">
              Connect with professional counsellors for personalized guidance on personality development and career planning. Choose the type of guidance that best suits your needs.
            </p>
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Select Your Guidance Preference:</h3>
              <RadioGroup value={guidanceType} onValueChange={setGuidanceType} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="one-on-one" id="one-on-one" />
                  <Label htmlFor="one-on-one" className="cursor-pointer">
                    <div className="font-medium">1-on-1 Guidance</div>
                    <p className="text-sm text-gray-500">Personal sessions focused on your specific needs and questions</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="in-depth" id="in-depth" />
                  <Label htmlFor="in-depth" className="cursor-pointer">
                    <div className="font-medium">In-Depth Exploration</div>
                    <p className="text-sm text-gray-500">Comprehensive analysis of your personality and career options over multiple sessions</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {counsellors.map((counsellor) => (
            <Card 
              key={counsellor.id} 
              className={`bg-white transition-all ${
                selectedCounsellor === counsellor.id 
                  ? 'ring-2 ring-purple-500 shadow-md' 
                  : 'shadow-sm hover:shadow-md'
              }`}
              onClick={() => setSelectedCounsellor(
                selectedCounsellor === counsellor.id ? null : counsellor.id
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-gray-100">
                    <AvatarFallback className="bg-purple-100 text-purple-800">{counsellor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    {counsellor.avatar && <AvatarImage src={counsellor.avatar} alt={counsellor.name} />}
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{counsellor.name}</CardTitle>
                    <CardDescription>{counsellor.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex items-center gap-1 text-sm text-amber-600 mb-2">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-medium">{counsellor.rating}</span>
                  <span className="text-gray-500 text-xs">({counsellor.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{counsellor.location}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{counsellor.experience} experience</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{counsellor.costRange}</span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {counsellor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {counsellor.bio}
                </p>
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-0">
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="h-4 w-4 mr-1" /> View Schedule
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <MessageCircle className="h-4 w-4 mr-1" /> Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalityHub;
