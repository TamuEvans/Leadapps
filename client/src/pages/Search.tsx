import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Search as SearchIcon, 
  MapPin, 
  Filter, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Building,
  GraduationCap,
  Clock,
  DollarSign,
  ScrollText,
  ClipboardList,
  FormInput,
  X,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Import university logos
import uwiLogo from "@assets/UWI_crest_and_word_300px_185577544cf12bf3bfc1910be478ef69.png";
import uccLogo from "@assets/NEW_UCC_logo.jpg";
import utechLogo from "@assets/utech_web.jpg";
import sguLogo from "@assets/sgu-logo-grenada-horizontal-color_orig.jpg";
import usfLogo from "@assets/usf-logo_orig.png";
import saitLogo from "@assets/sait.png";
import humberLogo from "@assets/humber-2col-cen_orig.gif";

// Mock data for search results
const mockResults = [
  {
    id: 1,
    programName: "MSc Business Analytics",
    institution: "University of the West Indies, Cave Hill Campus",
    location: "Bridgetown, Barbados",
    level: "Master's",
    duration: "1 Year Full-time",
    mode: "On-Campus",
    tuition: "Approx. $15,000 USD/year",
    applicationFee: "$50 USD",
    description: "This programme provides students with advanced analytical skills and knowledge to address complex business problems using data-driven approaches. Core modules include data mining, statistical analysis, and decision modeling.",
    logo: uwiLogo
  },
  {
    id: 2,
    programName: "Associate Degree in Computer Science",
    institution: "University of the Commonwealth Caribbean",
    location: "Kingston, Jamaica",
    level: "Associate's",
    duration: "2 Years",
    mode: "Full-time/Part-time",
    tuition: "Approx. $3,000 USD/year (Local)",
    applicationFee: "$30 USD",
    description: "Learn foundational skills in programming, databases, web development, and computer systems. This programme prepares students for entry-level IT positions or transfer to bachelor's degree programmes.",
    logo: uccLogo
  },
  {
    id: 3,
    programName: "Bachelor of Science in Civil Engineering",
    institution: "University of Technology, Jamaica",
    location: "Kingston, Jamaica",
    level: "Bachelor's",
    duration: "4 Years",
    mode: "Full-time",
    tuition: "Approx. $5,000 USD/year",
    applicationFee: "$40 USD",
    description: "This programme covers structural engineering, transportation systems, environmental engineering, and construction management. Accredited by the Jamaica Institution of Engineers.",
    logo: utechLogo
  },
  {
    id: 4,
    programName: "Doctor of Medicine (MD)",
    institution: "St. George's University",
    location: "St. George's, Grenada",
    level: "Doctorate",
    duration: "4 Years",
    mode: "On-Campus",
    tuition: "Approx. $65,000 USD/year",
    applicationFee: "$250 USD",
    description: "The Doctor of Medicine programme at SGU provides a comprehensive medical education with clinical training opportunities in the US, UK, and Caribbean. SGU graduates practice in more than 50 countries around the world.",
    logo: sguLogo
  },
  {
    id: 5,
    programName: "Master of Science in Cybersecurity",
    institution: "University of South Florida",
    location: "Tampa, Florida, USA",
    level: "Master's",
    duration: "2 Years",
    mode: "Online/On-Campus",
    tuition: "Approx. $30,000 USD total",
    applicationFee: "$85 USD",
    description: "This programme prepares students to develop, implement and manage secure computer systems and defend networks from cybersecurity threats through advanced coursework in cryptography, secure software, penetration testing, and security governance.",
    logo: usfLogo
  }
];

// Program level options
const programLevels = [
  { value: "all", label: "All Levels" },
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma" },
  { value: "associate", label: "Associate's" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "doctorate", label: "Doctorate" }
];

// Study areas
const studyAreas = [
  { value: "all", label: "All Areas" },
  { value: "business", label: "Business & Management" },
  { value: "computing", label: "Computing & IT" },
  { value: "engineering", label: "Engineering" },
  { value: "health", label: "Health Sciences" },
  { value: "humanities", label: "Humanities & Arts" },
  { value: "science", label: "Natural Sciences" },
  { value: "social", label: "Social Sciences" }
];

// Institution types
const institutionTypes = [
  { value: "all", label: "All Types" },
  { value: "university", label: "University" },
  { value: "college", label: "College" },
  { value: "vocational", label: "Vocational School" },
  { value: "sixth_form", label: "Sixth Form" }
];

// Countries with emphasis on Caribbean nations
const countries = [
  { value: "all", label: "All Countries" },
  { value: "bb", label: "Barbados" },
  { value: "jm", label: "Jamaica" },
  { value: "tt", label: "Trinidad & Tobago" },
  { value: "lc", label: "Saint Lucia" },
  { value: "gd", label: "Grenada" },
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" }
];

// Tuition fee ranges
const tuitionRanges = [
  { value: "any", label: "Any" },
  { value: "under_5k", label: "Under $5,000" },
  { value: "5k_10k", label: "$5,000 - $10,000" },
  { value: "10k_20k", label: "$10,000 - $20,000" },
  { value: "over_20k", label: "Over $20,000" }
];

// Study modes
const studyModes = [
  { value: "any", label: "Any" },
  { value: "campus", label: "On-Campus" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
  { value: "fulltime", label: "Full-time" },
  { value: "parttime", label: "Part-time" }
];

// Duration options
const durations = [
  { value: "any", label: "Any" },
  { value: "under_1", label: "Under 1 Year" },
  { value: "1_2", label: "1-2 Years" },
  { value: "3_4", label: "3-4 Years" },
  { value: "over_4", label: "Over 4 Years" }
];

// Sort options
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "name_asc", label: "Programme Name A-Z" },
  { value: "inst_asc", label: "Institution Name A-Z" },
  { value: "tuition_low", label: "Tuition Low-High" }
];

const Search = () => {
  // Navigation
  const [location, setLocation] = useLocation();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(true); // Set to true by default to show all programmes
  
  // Parse query parameters from URL when component mounts
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const program = params.get('program');
    const country = params.get('country');
    const level = params.get('level');
    
    // Set state based on URL parameters
    if (program) setSearchQuery(program);
    if (country) setLocationQuery(country);
    if (level) setProgramLevel(level);
    
    // If any parameter is present, trigger a search
    if (program || country || level) {
      setHasSearched(true);
    }
  }, [location]);
  
  // Filter states
  const [programLevel, setProgramLevel] = useState<string>("all");
  const [studyArea, setStudyArea] = useState<string>("all");
  const [institutionType, setInstitutionType] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [tuition, setTuition] = useState<string>("any");
  const [mode, setMode] = useState<string>("any");
  const [duration, setDuration] = useState<string>("any");
  const [sortBy, setSortBy] = useState<string>("relevance");
  
  // Favorite/wishlist tracking
  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('programFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  // Active filters tracking for display
  const [activeFilters, setActiveFilters] = useState<{id: string, label: string}[]>([]);
  
  // Filter displayed results based on current search and filter values
  const [filteredResults, setFilteredResults] = useState(mockResults);
  
  // Mutation for creating a new application
  const createApplicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/applications", data);
    },
    onSuccess: () => {
      // Invalidate applications query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      
      toast({
        title: "Application started!",
        description: "You've been redirected to the application page to continue.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error starting application",
        description: error.message || "There was an error starting your application. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle Apply Now button click
  const handleApplyNow = async (program: any) => {
    try {
      // Create a new application for this program
      const response = await createApplicationMutation.mutateAsync({
        programId: program.id,
        // The backend will assign the studentId based on the authenticated user
        status: "draft"
      });
      
      // Wait for the response to be processed
      await response.json();
      
      // Add a short delay to ensure the data is fetched before navigation
      setTimeout(() => {
        // Redirect to the applications page with a parameter indicating we came from search
        setLocation("/app/applications?from=search");
      }, 300);
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };
  
  // Effect to update filters when any search or filter value changes
  React.useEffect(() => {
    // Update active filters based on selections
    const newFilters = [];
    
    if (programLevel !== "all") {
      const label = programLevels.find(p => p.value === programLevel)?.label || "";
      newFilters.push({id: `level_${programLevel}`, label: `Level: ${label}`});
    }
    
    if (studyArea !== "all") {
      const label = studyAreas.find(a => a.value === studyArea)?.label || "";
      newFilters.push({id: `area_${studyArea}`, label: `Area: ${label}`});
    }
    
    if (country !== "all") {
      const label = countries.find(c => c.value === country)?.label || "";
      newFilters.push({id: `country_${country}`, label: `Country: ${label}`});
    }
    
    setActiveFilters(newFilters);
    
    // Filter results based on search query, location, and other filters
    let results = [...mockResults];
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      results = results.filter(program => 
        program.programName.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by location
    if (locationQuery.trim() !== "") {
      const location = locationQuery.toLowerCase();
      results = results.filter(program => 
        program.institution.toLowerCase().includes(location) ||
        program.location.toLowerCase().includes(location)
      );
    }
    
    // Filter by program level
    if (programLevel !== "all") {
      results = results.filter(program => 
        program.level.toLowerCase().includes(programLevel.toLowerCase())
      );
    }
    
    setFilteredResults(results);
  }, [searchQuery, locationQuery, programLevel, studyArea, country, tuition, mode, duration]);
  
  // Legacy handle search function (now just for the button click)
  const handleSearch = () => {
    // The search is now automatic through the useEffect, 
    // but we'll keep this for the button for UX consistency
  };
  
  // Remove a specific filter
  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== filterId));
    
    // Reset corresponding filter state
    if (filterId.startsWith("level_")) setProgramLevel("all");
    if (filterId.startsWith("area_")) setStudyArea("all");
    if (filterId.startsWith("country_")) setCountry("all");
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    // Clear search inputs
    setSearchQuery("");
    setLocationQuery("");
    
    // Clear dropdown filters
    setProgramLevel("all");
    setStudyArea("all");
    setInstitutionType("all");
    setCountry("all");
    setTuition("any");
    setMode("any");
    setDuration("any");
    
    // Clear active filter tags
    setActiveFilters([]);
  };
  
  // Toggle program favorite/wishlist status
  const toggleFavorite = (programId: number) => {
    const newFavorites = favorites.includes(programId)
      ? favorites.filter(id => id !== programId)
      : [...favorites, programId];
      
    // Update state
    setFavorites(newFavorites);
    
    // Save to localStorage
    localStorage.setItem('programFavorites', JSON.stringify(newFavorites));
    
    // Show feedback toast (optional)
    const action = favorites.includes(programId) ? 'removed from' : 'added to';
    console.log(`Program ${action} your wishlist`);
  };
  
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-300 to-cyan-400 rounded-full opacity-20 blur-xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">🔍 Search Programmes & Institutions</h1>
          <p className="text-white/90 text-lg">Discover your perfect educational path from thousands of programmes worldwide</p>
        </div>
      </div>
      
      {/* Search Bar & Primary Filters */}
      <Card className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="searchQuery" className="block text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                🎓 What do you want to study?
              </label>
              <div className="relative">
                <Input
                  id="searchQuery"
                  placeholder="Enter keywords, programme name, or subject..."
                  className="pl-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-purple-400 bg-white/70 backdrop-blur-sm text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <label htmlFor="locationQuery" className="block text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  📍 Where do you want to study?
                </label>
                <div className="relative">
                  <Input
                    id="locationQuery"
                    placeholder="Enter location or institution..."
                    className="pl-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-teal-400 bg-white/70 backdrop-blur-sm text-lg"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-teal-500" />
                </div>
              </div>
              
              <div className="md:mt-8">
                <Button 
                  onClick={handleSearch} 
                  className="w-full md:w-auto h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-2xl text-lg font-semibold"
                >
                  <SearchIcon className="h-5 w-5 mr-2" /> Search Now
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-6 bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
          
          {/* Advanced Filters Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-3 text-purple-500" />
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Advanced Filters</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="programLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Programme Level
                </label>
                <Select
                  value={programLevel}
                  onValueChange={setProgramLevel}
                >
                  <SelectTrigger id="programLevel" className="w-full h-11 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-white/70">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {programLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="studyArea" className="block text-sm font-medium text-gray-700 mb-2">
                  Study Area
                </label>
                <Select
                  value={studyArea}
                  onValueChange={setStudyArea}
                >
                  <SelectTrigger id="studyArea" className="w-full h-11 rounded-xl border-2 border-gray-200 focus:border-green-400 bg-white/70">
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyAreas.map(area => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Type
                </label>
                <Select
                  value={institutionType}
                  onValueChange={setInstitutionType}
                >
                  <SelectTrigger id="institutionType" className="w-full h-11 rounded-xl border-2 border-gray-200 focus:border-orange-400 bg-white/70">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                >
                  <SelectTrigger id="country" className="w-full h-11 rounded-xl border-2 border-gray-200 focus:border-pink-400 bg-white/70">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="tuition" className="block text-xs font-medium text-gray-500 mb-1">
                  Tuition Fee (per year)
                </label>
                <Select
                  value={tuition}
                  onValueChange={setTuition}
                >
                  <SelectTrigger id="tuition" className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {tuitionRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="mode" className="block text-xs font-medium text-gray-500 mb-1">
                  Mode of Study
                </label>
                <Select
                  value={mode}
                  onValueChange={setMode}
                >
                  <SelectTrigger id="mode" className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyModes.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-xs font-medium text-gray-500 mb-1">
                  Duration
                </label>
                <Select
                  value={duration}
                  onValueChange={setDuration}
                >
                  <SelectTrigger id="duration" className="w-full">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(duration => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button size="sm" onClick={handleSearch}>
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active Filters:</span>
          {activeFilters.map(filter => (
            <Badge key={filter.id} variant="secondary" className="px-2 py-1">
              {filter.label}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => removeFilter(filter.id)} 
              />
            </Badge>
          ))}
        </div>
      )}
      
      {/* Search Results */}
      {hasSearched ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="bg-blue-50 p-2 px-4 rounded-md border border-blue-100 w-full md:w-auto">
              <h2 className="text-sm font-medium text-blue-700">
                Showing {filteredResults.length > 0 ? `1-${filteredResults.length}` : '0'} of {filteredResults.length} programmes
                {searchQuery && <span> for "{searchQuery}"</span>}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results List */}
          <div className="space-y-6">
            {filteredResults.length > 0 ? (
              filteredResults.map(program => (
                <Card key={program.id} className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden hover:shadow-2xl transform hover:scale-102 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="flex-shrink-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg hidden md:block">
                        <img src={program.logo} alt={program.institution} className="w-24 h-20 object-contain" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{program.programName}</h3>
                          <p className="text-lg font-semibold text-purple-600 mt-1">{program.institution}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-2">
                            <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                            {program.location}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(program.id)}
                          className={`rounded-full p-3 transition-all duration-200 ${favorites.includes(program.id) ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}
                        >
                          <Heart className="h-5 w-5" fill={favorites.includes(program.id) ? "currentColor" : "none"} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center text-sm bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3">
                          <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium text-gray-700">Level: {program.level}</span>
                        </div>
                        <div className="flex items-center text-sm bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3">
                          <Clock className="h-4 w-4 mr-2 text-green-500" />
                          <span className="font-medium text-gray-700">Duration: {program.duration}</span>
                        </div>
                        <div className="flex items-center text-sm bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3">
                          <Building className="h-4 w-4 mr-2 text-orange-500" />
                          <span className="font-medium text-gray-700">Mode: {program.mode}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 text-sm mt-4">
                        <div className="flex items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                          <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="font-medium text-gray-700">Tuition: {program.tuition}</span>
                        </div>
                        <div className="flex items-center bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-3">
                          <FormInput className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className="font-medium text-gray-700">Application Fee: {program.applicationFee}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-4 leading-relaxed line-clamp-2">{program.description}</p>
                      
                      <div className="mt-6 flex flex-wrap justify-end gap-3">
                        <Button asChild className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-full px-6">
                          <Link to={`/app/programs/${program.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-full px-6"
                          onClick={() => handleApplyNow(program)}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            ) : (
              <div className="p-12 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-0 shadow-xl">
                <SearchIcon className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">No programmes found</h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg">
                  Try adjusting your search criteria or filters to find more programmes.
                </p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              <Button variant="default" size="icon" className="w-8 h-8">1</Button>
              <Button variant="outline" size="icon" className="w-8 h-8">2</Button>
              <Button variant="outline" size="icon" className="w-8 h-8">3</Button>
              <span className="mx-1">...</span>
              <Button variant="outline" size="icon" className="w-8 h-8">10</Button>
            </div>
            
            <Button variant="outline" size="sm">
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-gray-500">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-medium text-gray-700 mb-2">Start Your Search</h2>
          <p className="max-w-md mx-auto">
            Enter a subject, programme, or field of study above to search for educational programmes that match your interests and qualifications.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
