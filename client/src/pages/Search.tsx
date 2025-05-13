import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  X
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
    description: "This program provides students with advanced analytical skills and knowledge to address complex business problems using data-driven approaches. Core modules include data mining, statistical analysis, and decision modeling.",
    logo: "https://placehold.co/80"
  },
  {
    id: 2,
    programName: "Associate Degree in Computer Science",
    institution: "Barbados Community College",
    location: "Eyrie Howells' Road, St. Michael, Barbados",
    level: "Associate's",
    duration: "2 Years",
    mode: "Full-time/Part-time",
    tuition: "Approx. $3,000 BBD/year (Local)",
    description: "Learn foundational skills in programming, databases, web development, and computer systems. This program prepares students for entry-level IT positions or transfer to bachelor's degree programs.",
    logo: "https://placehold.co/80"
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
    description: "This program covers structural engineering, transportation systems, environmental engineering, and construction management. Accredited by the Jamaica Institution of Engineers.",
    logo: "https://placehold.co/80"
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
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(true); // Set to true by default to show all programmes
  
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
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Active filters tracking for display
  const [activeFilters, setActiveFilters] = useState<{id: string, label: string}[]>([]);
  
  // Filter displayed results based on current search and filter values
  const [filteredResults, setFilteredResults] = useState(mockResults);
  
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
    setProgramLevel("all");
    setStudyArea("all");
    setInstitutionType("all");
    setCountry("all");
    setTuition("any");
    setMode("any");
    setDuration("any");
    setActiveFilters([]);
  };
  
  // Toggle program favorite/wishlist status
  const toggleFavorite = (programId: number) => {
    if (favorites.includes(programId)) {
      setFavorites(favorites.filter(id => id !== programId));
    } else {
      setFavorites([...favorites, programId]);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Search Programmes & Institutions</h1>
      
      {/* Search Bar & Primary Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
                What do you want to study? (e.g., Business, Engineering, CAPE subject)
              </label>
              <div className="relative">
                <Input
                  id="searchQuery"
                  placeholder="Enter keywords, programme name, or subject..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="locationQuery" className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Country, City, or Institution Name)
                </label>
                <div className="relative">
                  <Input
                    id="locationQuery"
                    placeholder="Enter location or institution..."
                    className="pl-10"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="md:mt-6">
                <Button 
                  onClick={handleSearch} 
                  className="w-full md:w-auto"
                >
                  <SearchIcon className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Advanced Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="programLevel" className="block text-xs font-medium text-gray-500 mb-1">
                  Programme Level
                </label>
                <Select
                  value={programLevel}
                  onValueChange={setProgramLevel}
                >
                  <SelectTrigger id="programLevel" className="w-full">
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
                <label htmlFor="studyArea" className="block text-xs font-medium text-gray-500 mb-1">
                  Study Area
                </label>
                <Select
                  value={studyArea}
                  onValueChange={setStudyArea}
                >
                  <SelectTrigger id="studyArea" className="w-full">
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
                <label htmlFor="institutionType" className="block text-xs font-medium text-gray-500 mb-1">
                  Institution Type
                </label>
                <Select
                  value={institutionType}
                  onValueChange={setInstitutionType}
                >
                  <SelectTrigger id="institutionType" className="w-full">
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
                <label htmlFor="country" className="block text-xs font-medium text-gray-500 mb-1">
                  Country
                </label>
                <Select
                  value={country}
                  onValueChange={setCountry}
                >
                  <SelectTrigger id="country" className="w-full">
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
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map(program => (
                <Card key={program.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="flex-shrink-0 bg-gray-100 rounded-md p-2 hidden md:block">
                        <img src={program.logo} alt={program.institution} className="w-16 h-16 object-contain" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{program.programName}</h3>
                          <p className="text-primary font-medium">{program.institution}</p>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {program.location}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(program.id)}
                          className={favorites.includes(program.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"}
                        >
                          <Heart className="h-5 w-5" fill={favorites.includes(program.id) ? "currentColor" : "none"} />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>Level: {program.level}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>Duration: {program.duration}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          <span>Mode: {program.mode}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span>Tuition: {program.tuition}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">{program.description}</p>
                      
                      <div className="mt-4 flex justify-end">
                        <Button variant="default">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
                <SearchIcon className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No programmes found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
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
