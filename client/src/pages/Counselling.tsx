import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Video, User, MapPin, Briefcase, GraduationCap, Search, Filter, Star, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Counsellor data
const counsellors = [
  {
    id: 1,
    name: "Dr. Shanice Thompson",
    avatar: "",
    title: "Senior Education Advisor",
    specialties: ["US Applications", "Medical Schools", "Scholarship Guidance"],
    destinations: ["US"],
    gender: "Female",
    experience: "12 years",
    education: "Ph.D. in Educational Psychology, Harvard University",
    location: "Kingston, Jamaica",
    languages: ["English", "Spanish"],
    costRange: "$100-150 per hour",
    rating: 4.9,
    reviewCount: 127,
    bio: "Dr. Thompson specializes in guiding Caribbean students through competitive US medical school applications. Her expertise is primarily focused on US destinations, particularly for medical and healthcare programs. With over a decade of experience, she has helped hundreds of students secure scholarships and placements at top American institutions."
  },
  {
    id: 2,
    name: "Kwame Richardson, M.Ed.",
    avatar: "",
    title: "International Admissions Specialist",
    specialties: ["Canadian Immigration", "Engineering Programs", "Graduate Applications"],
    destinations: ["Canada"],
    gender: "Male",
    experience: "8 years",
    education: "M.Ed. in Higher Education, University of Toronto",
    location: "Port of Spain, Trinidad",
    languages: ["English", "French"],
    costRange: "$85-120 per hour",
    rating: 4.7,
    reviewCount: 92,
    bio: "Kwame's expertise lies in navigating the Canadian education system and immigration processes. He focuses exclusively on Canadian destinations, providing strategic guidance for engineering and technical program applications with a special emphasis on research opportunities and post-graduation work permits in Canada."
  },
  {
    id: 3,
    name: "Rhianna Blackman",
    avatar: "",
    title: "Career Counsellor & Essay Coach",
    specialties: ["Personal Statements", "Interview Preparation", "UK Universities"],
    destinations: ["UK"],
    gender: "Female",
    experience: "6 years",
    education: "M.A. in Creative Writing, University of Edinburgh",
    location: "Bridgetown, Barbados",
    languages: ["English", "French"],
    costRange: "$70-100 per hour",
    rating: 4.8,
    reviewCount: 84,
    bio: "Rhianna combines her writing expertise with in-depth knowledge of UK university admissions to help students craft compelling personal statements. Her focus is exclusively on UK destinations, particularly Russell Group universities. She provides comprehensive interview coaching for Oxbridge and other competitive UK program applications."
  },
  {
    id: 4,
    name: "Dr. Andre Campbell",
    avatar: "",
    title: "STEM Education Specialist",
    specialties: ["Technology Programs", "Research Applications", "Scholarship Applications"],
    destinations: ["US", "Canada", "UK"],
    gender: "Male",
    experience: "15 years",
    education: "Ph.D. in Computer Science, MIT",
    location: "Georgetown, Guyana",
    languages: ["English", "Portuguese"],
    costRange: "$110-170 per hour",
    rating: 4.9,
    reviewCount: 156,
    bio: "With a background in computer science research, Dr. Campbell specializes in guiding students toward technology and engineering programs across multiple destinations. His expertise spans US, Canadian, and UK technology programs, with particular emphasis on helping students identify research opportunities and prepare competitive applications for STEM scholarships internationally."
  },
  {
    id: 5,
    name: "Gabriela Ramirez",
    avatar: "",
    title: "Arts & Humanities Advisor",
    specialties: ["Visual Arts Programs", "Portfolio Development", "Creative Scholarships"],
    destinations: ["US", "Caribbean"],
    gender: "Female",
    experience: "9 years",
    education: "MFA in Fine Arts, Rhode Island School of Design",
    location: "San Juan, Puerto Rico",
    languages: ["English", "Spanish"],
    costRange: "$90-120 per hour",
    rating: 4.6,
    reviewCount: 73,
    bio: "Gabriela guides creative students through specialized arts program applications. Her expertise covers both Caribbean and US destinations for arts education. She provides portfolio development advice and helps students navigate audition processes for performing arts and fine arts programs at Caribbean institutions and top US conservatories."
  },
  {
    id: 6,
    name: "Dwayne Braithwaite",
    avatar: "",
    title: "Financial Aid Specialist",
    specialties: ["Scholarship Applications", "Financial Planning", "Budget Guidance"],
    destinations: ["US", "Canada", "UK", "Caribbean"],
    gender: "Male",
    experience: "11 years",
    education: "MBA in Finance, London School of Economics",
    location: "Nassau, Bahamas",
    languages: ["English"],
    costRange: "$95-140 per hour",
    rating: 4.8,
    reviewCount: 112,
    bio: "Dwayne specializes in helping students navigate the financial aspects of international education. His expertise spans all major destinations (US, UK, Canada, and the Caribbean), providing tailored guidance on scholarship applications, student loans, and developing realistic financial plans for studying abroad in any of these regions."
  },
  {
    id: 7,
    name: "Dr. Asha Mathurin",
    avatar: "",
    title: "Medical & Health Sciences Advisor",
    specialties: ["Pre-Med Programs", "Nursing Applications", "Healthcare Careers"],
    destinations: ["US", "Caribbean"],
    gender: "Female",
    experience: "14 years",
    education: "M.D., Johns Hopkins University",
    location: "Kingston, Jamaica",
    languages: ["English", "Hindi"],
    costRange: "$120-180 per hour",
    rating: 5.0,
    reviewCount: 143,
    bio: "Dr. Mathurin provides specialized guidance for students pursuing medical and health science careers across multiple destinations. Her advising covers programs in the Caribbean, US, and UK, with particular expertise in Caribbean and US medical schools. With experience as a medical school admissions committee member, she offers insider perspective on competitive healthcare program applications."
  },
  {
    id: 8,
    name: "Marcus Charles",
    avatar: "",
    title: "Graduate Studies Expert",
    specialties: ["MBA Applications", "Law School Admissions", "Advanced Degrees"],
    destinations: ["US", "Canada"],
    gender: "Male",
    experience: "10 years",
    education: "J.D., Yale Law School",
    location: "St. George's, Grenada",
    languages: ["English"],
    costRange: "$100-150 per hour",
    rating: 4.7,
    reviewCount: 91,
    bio: "Marcus specializes in graduate-level applications, particularly for MBA and law programs. His expertise is primarily focused on US destinations, with additional knowledge of Canadian options. He provides comprehensive guidance on entrance exams, application strategies, and connecting educational choices with long-term career goals for students seeking advanced degrees in North America."
  },
  {
    id: 9,
    name: "Ayanna Dupont",
    avatar: "",
    title: "Student Transition Specialist",
    specialties: ["First-Year Experience", "Cultural Adjustment", "Student Wellbeing"],
    destinations: ["UK", "Canada"],
    gender: "Female",
    experience: "7 years",
    education: "M.Sc. in Psychology, University of the West Indies",
    location: "Castries, St. Lucia",
    languages: ["English", "French", "Creole"],
    bio: "Ayanna focuses on the emotional and psychological aspects of studying abroad. She provides guidance on cultural adjustment across multiple destinations, with special expertise in the transition to UK and Canadian universities. Her counseling helps students develop healthy coping strategies for the specific challenges of each destination's educational environment and cultural context."
  },
  {
    id: 10,
    name: "Terrell Baptiste",
    avatar: "",
    title: "Technology & Digital Media Specialist",
    specialties: ["Computer Science", "Digital Arts", "Tech Scholarships"],
    destinations: ["US", "Canada"],
    gender: "Male",
    experience: "8 years",
    education: "M.Sc. in Computer Science, Stanford University",
    location: "Port of Spain, Trinidad",
    languages: ["English", "French"],
    bio: "Terrell specializes in technology education pathways, including computer science, digital media, and emerging tech fields. His advising primarily covers US and Canadian destinations for tech education, with particular expertise in Silicon Valley connections. He helps students identify programs aligned with specific tech career goals and prepare competitive applications for North American tech hubs."
  }
];

// Helper function to get unique values from counsellor data
const getUniqueValues = (data: any[], key: string): string[] => {
  const valuesSet = new Set<string>();
  data.forEach(item => {
    if (Array.isArray(item[key])) {
      item[key].forEach((value: string) => valuesSet.add(value));
    }
  });
  return Array.from(valuesSet).sort();
};

const Counselling = () => {
  const [selectedCounsellor, setSelectedCounsellor] = useState<number | null>(null);
  const [filteredCounsellors, setFilteredCounsellors] = useState(counsellors);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    gender: [] as string[],
    destinations: [] as string[],
    specialties: [] as string[],
    location: [] as string[],
  });
  
  // Selected search values
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  
  // Get unique values for filters
  const uniqueDestinations = getUniqueValues(counsellors, 'destinations');
  const uniqueSpecialties = getUniqueValues(counsellors, 'specialties');
  const uniqueLocations = counsellors.map(c => c.location).filter((loc, index, self) => self.indexOf(loc) === index).sort();
  
  // Handle filter changes
  useEffect(() => {
    const newFilters = { ...filters };
    
    // Update gender filter
    if (selectedGender && selectedGender !== 'all') {
      newFilters.gender = [selectedGender];
    } else {
      newFilters.gender = [];
    }
    
    // Update destinations filter
    if (selectedDestination && selectedDestination !== 'all') {
      newFilters.destinations = [selectedDestination];
    } else {
      newFilters.destinations = [];
    }
    
    // Update specialties filter
    if (selectedSpecialty && selectedSpecialty !== 'all') {
      newFilters.specialties = [selectedSpecialty];
    } else {
      newFilters.specialties = [];
    }
    
    // Update location filter
    if (selectedLocation && selectedLocation !== 'all') {
      newFilters.location = [selectedLocation];
    } else {
      newFilters.location = [];
    }
    
    setFilters(newFilters);
  }, [selectedGender, selectedDestination, selectedSpecialty, selectedLocation]);

  // Filter counsellors when filters or search change
  useEffect(() => {
    let result = counsellors;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.bio.toLowerCase().includes(query) || 
        c.specialties.some((s: string) => s.toLowerCase().includes(query))
      );
    }
    
    // Filter by gender
    if (filters.gender.length > 0) {
      result = result.filter(c => filters.gender.includes(c.gender));
    }
    
    // Filter by destinations
    if (filters.destinations.length > 0) {
      result = result.filter(c => c.destinations.some((d: string) => filters.destinations.includes(d)));
    }
    
    // Filter by specialties
    if (filters.specialties.length > 0) {
      result = result.filter(c => c.specialties.some((s: string) => filters.specialties.includes(s)));
    }
    
    // Filter by location
    if (filters.location.length > 0) {
      result = result.filter(c => filters.location.includes(c.location));
    }
    
    setFilteredCounsellors(result);
  }, [searchQuery, filters]);
  
  // Toggle filter function
  const toggleFilter = (category: 'gender' | 'destinations' | 'specialties' | 'location', value: string) => {
    setFilters(prev => {
      const currentValues = [...prev[category]];
      if (currentValues.includes(value)) {
        return { ...prev, [category]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...currentValues, value] };
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedGender("all");
    setSelectedDestination("all");
    setSelectedSpecialty("all");
    setSelectedLocation("all");
    setSearchQuery('');
  };

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
          
          {/* Search and Filter Bar */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search counsellors by name, specialty, or keywords..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => clearFilters()}
                >
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Gender Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Gender</h3>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Destination Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Destination Markets</h3>
                <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {uniqueDestinations.map((destination) => (
                      <SelectItem key={destination} value={destination}>
                        {destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Specialties Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Program Specialties</h3>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {uniqueSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location Filter */}
              <div>
                <h3 className="text-sm font-medium mb-2">Location</h3>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredCounsellors.length} of {counsellors.length} counsellors
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounsellors.map((counsellor) => (
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
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{counsellor.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        <User className="h-2.5 w-2.5 mr-1" />
                        {counsellor.gender}
                      </Badge>
                    </div>
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
                  
                  <div className="mb-2">
                    <h4 className="text-sm font-medium mb-1">Destinations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {counsellor.destinations.map((destination: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                          {destination}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-1">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {counsellor.specialties.map((specialty: string, index: number) => (
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
