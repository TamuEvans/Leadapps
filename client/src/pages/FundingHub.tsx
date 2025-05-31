import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar, DollarSign, GraduationCap, Map, School, User, X, Check, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for loans
const mockLoans = [
  {
    id: 1,
    name: "Caribbean Student Education Loan",
    provider: "First Caribbean Bank",
    amount: "$5,000 - $50,000",
    interest: "5.5%",
    repaymentPeriod: "5-15 years",
    eligibility: "Caribbean citizens pursuing undergraduate or graduate degrees",
    locations: ["Jamaica", "Trinidad", "Barbados"],
    featured: true
  },
  {
    id: 2,
    name: "International Student Loan Program",
    provider: "Global Education Finance",
    amount: "$10,000 - $100,000",
    interest: "6.75%",
    repaymentPeriod: "7-20 years",
    eligibility: "International students with a co-signer",
    locations: ["US", "UK", "Canada"],
    featured: false
  },
  {
    id: 3,
    name: "Graduate Studies Loan",
    provider: "Education Trust Barbados",
    amount: "$15,000 - $60,000",
    interest: "4.9%",
    repaymentPeriod: "10 years",
    eligibility: "Barbadian students pursuing graduate degrees",
    locations: ["Barbados", "Grenada", "St. Lucia", "US", "UK"],
    featured: false
  },
  {
    id: 4,
    name: "Commonwealth Education Financing",
    provider: "Commonwealth Bank",
    amount: "$8,000 - $75,000",
    interest: "5.25%",
    repaymentPeriod: "7-15 years",
    eligibility: "Students from Commonwealth countries",
    locations: ["UK", "Canada", "Australia"],
    featured: true
  },
  {
    id: 5,
    name: "Professional Development Loan",
    provider: "Jamaica National Bank",
    amount: "$3,000 - $25,000",
    interest: "7.0%",
    repaymentPeriod: "3-7 years",
    eligibility: "Jamaican professionals pursuing additional qualifications",
    locations: ["Jamaica", "US"],
    featured: false
  }
];

// Mock data for scholarships
const mockScholarships = [
  {
    id: 1,
    name: "CARICOM Excellence Scholarship",
    provider: "CARICOM Foundation",
    amount: "$15,000 per year",
    coverage: "Tuition, books, housing stipend",
    deadline: "March 15, 2025",
    eligibility: "CARICOM citizens with exceptional academic performance",
    locations: ["Jamaica", "Trinidad", "Barbados", "Bahamas", "Grenada", "UK", "Canada", "US"],
    featured: true
  },
  {
    id: 2,
    name: "Global Leaders Program",
    provider: "International Education Fund",
    amount: "$25,000 per year",
    coverage: "Full tuition and living expenses",
    deadline: "January 30, 2025",
    eligibility: "Outstanding students with leadership potential",
    locations: ["US", "UK", "Canada", "Australia"],
    featured: true
  },
  {
    id: 3,
    name: "STEM Innovation Scholarship",
    provider: "Caribbean Development Bank",
    amount: "$10,000 per year",
    coverage: "Tuition only",
    deadline: "April 10, 2025",
    eligibility: "Caribbean students pursuing STEM degrees",
    locations: ["Jamaica", "Trinidad", "Barbados", "St. Lucia", "Dominica", "US", "Canada"],
    featured: false
  },
  {
    id: 4,
    name: "Future Educators Grant",
    provider: "Ministry of Education Jamaica",
    amount: "$8,000 per year",
    coverage: "Tuition and books",
    deadline: "May 1, 2025",
    eligibility: "Jamaican students pursuing education degrees",
    locations: ["Jamaica", "UK"],
    featured: false
  },
  {
    id: 5,
    name: "Healthcare Professionals Scholarship",
    provider: "Pan-Caribbean Health Association",
    amount: "$20,000 per year",
    coverage: "Full tuition and stipend",
    deadline: "February 28, 2025",
    eligibility: "Caribbean students pursuing medical and healthcare fields",
    locations: ["Jamaica", "Trinidad", "Barbados", "Bahamas", "St. Lucia", "Grenada", "US", "UK"],
    featured: true
  }
];

// Available country options
const countries = [
  { value: "Jamaica", label: "Jamaica" },
  { value: "Trinidad", label: "Trinidad & Tobago" },
  { value: "Barbados", label: "Barbados" },
  { value: "Bahamas", label: "Bahamas" },
  { value: "Grenada", label: "Grenada" },
  { value: "St. Lucia", label: "St. Lucia" },
  { value: "Dominica", label: "Dominica" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" }
];

const FundingHub = () => {
  const [activeTab, setActiveTab] = useState("scholarships");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  
  // Filter function for loans
  const filteredLoans = mockLoans.filter(loan => {
    const matchesSearch = loan.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         loan.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedCountries.length === 0 || 
                           loan.locations.some(location => selectedCountries.includes(location));
    
    return matchesSearch && matchesLocation;
  });
  
  // Filter function for scholarships
  const filteredScholarships = mockScholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scholarship.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedCountries.length === 0 || 
                           scholarship.locations.some(location => selectedCountries.includes(location));
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 blur-xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">💰 Funding Hub</h1>
          <p className="text-xl text-white/90">Discover scholarships and loan options to fund your education journey</p>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-white to-blue-50 shadow-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search scholarships and loans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 rounded-2xl border-2 border-blue-200 focus:border-blue-400 text-lg"
            />
          </div>
          <div className="w-full md:w-[280px]">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full h-12 justify-between rounded-2xl border-2 border-green-200 hover:border-green-400 bg-gradient-to-r from-green-50 to-emerald-50"
                >
                  {selectedCountries.length > 0
                    ? `${selectedCountries.length} location${selectedCountries.length > 1 ? "s" : ""} selected`
                    : "Filter by location"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {countries.map((country) => (
                      <CommandItem
                        key={country.value}
                        value={country.value}
                        onSelect={() => {
                          setSelectedCountries((prev) => {
                            if (prev.includes(country.value)) {
                              return prev.filter((c) => c !== country.value);
                            } else {
                              return [...prev, country.value];
                            }
                          });
                        }}
                      >
                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                          {selectedCountries.includes(country.value) ? (
                            <Check className="h-4 w-4" />
                          ) : null}
                        </div>
                        {country.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {selectedCountries.length > 0 && (
                    <div className="border-t border-gray-200 p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={() => setSelectedCountries([])}
                      >
                        Clear selection
                      </Button>
                    </div>
                  )}
                </CommandList>
              </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>
      
      {/* Tabs for Scholarships and Loans */}
      <Tabs defaultValue="scholarships" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          <TabsTrigger value="scholarships" className="rounded-xl font-medium text-gray-600 bg-white hover:bg-gray-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200">🎓 Scholarships</TabsTrigger>
          <TabsTrigger value="loans" className="rounded-xl font-medium text-gray-600 bg-white hover:bg-gray-50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200">💰 Loans</TabsTrigger>
        </TabsList>
        
        {/* Scholarships Tab Content */}
        <TabsContent value="scholarships" className="space-y-4">
          {filteredScholarships.length === 0 ? (
            <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-green-50 shadow-xl">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No scholarships found</h3>
                <p className="text-gray-600 leading-relaxed">Try adjusting your search or filter to find what you're looking for.</p>
              </CardContent>
            </Card>
          ) : (
            filteredScholarships.map(scholarship => (
              <Card key={scholarship.id} className="rounded-3xl border-0 bg-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800 mb-2">{scholarship.name}</CardTitle>
                      <CardDescription className="text-gray-600 font-medium">{scholarship.provider}</CardDescription>
                    </div>
                    {scholarship.featured && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 rounded-full px-3 py-1 shadow-lg">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4 px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                        <School className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{scholarship.coverage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Deadline: {scholarship.deadline}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center">
                        <Map className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {scholarship.locations.map(location => (
                          <Badge key={location} className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 rounded-lg">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 leading-relaxed">{scholarship.eligibility}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-2 px-6 pb-6 gap-3">
                  <Button variant="outline" className="rounded-2xl border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 font-medium">Learn More</Button>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-medium shadow-lg">Apply Now</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        {/* Loans Tab Content */}
        <TabsContent value="loans" className="space-y-4">
          {filteredLoans.length === 0 ? (
            <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-blue-50 shadow-xl">
              <CardContent className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No loans found</h3>
                <p className="text-gray-600 leading-relaxed">Try adjusting your search or filter to find what you're looking for.</p>
              </CardContent>
            </Card>
          ) : (
            filteredLoans.map(loan => (
              <Card key={loan.id} className="rounded-3xl border-0 bg-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800 mb-2">{loan.name}</CardTitle>
                      <CardDescription className="text-gray-600 font-medium">{loan.provider}</CardDescription>
                    </div>
                    {loan.featured && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 rounded-full px-3 py-1 shadow-lg">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4 px-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{loan.amount}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Interest: {loan.interest}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Term: {loan.repaymentPeriod}</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 leading-relaxed">{loan.eligibility}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl flex items-center justify-center">
                        <Map className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {loan.locations.map(location => (
                          <Badge key={location} className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-0 rounded-lg">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-2 px-6 pb-6 gap-3">
                  <Button variant="outline" className="rounded-2xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium">Learn More</Button>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium shadow-lg">Apply Now</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundingHub;