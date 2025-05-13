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
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Funding Hub</h1>
        <p className="text-gray-600">Discover scholarships and loan options to fund your education journey</p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search scholarships and loans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-[280px]">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
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
      
      {/* Tabs for Scholarships and Loans */}
      <Tabs defaultValue="scholarships" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>
        
        {/* Scholarships Tab Content */}
        <TabsContent value="scholarships" className="space-y-4">
          {filteredScholarships.length === 0 ? (
            <div className="text-center py-10">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No scholarships found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            filteredScholarships.map(scholarship => (
              <Card key={scholarship.id} className={`overflow-hidden transition-all duration-200 ${scholarship.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{scholarship.name}</CardTitle>
                      <CardDescription className="text-sm">{scholarship.provider}</CardDescription>
                    </div>
                    {scholarship.featured && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{scholarship.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Deadline: {scholarship.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {scholarship.locations.map(location => (
                          <Badge key={location} variant="secondary" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-500 mt-1" />
                      <span className="text-sm">{scholarship.eligibility}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-2">
                  <Button variant="outline">Learn More</Button>
                  <Button className="ml-2">Apply Now</Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        {/* Loans Tab Content */}
        <TabsContent value="loans" className="space-y-4">
          {filteredLoans.length === 0 ? (
            <div className="text-center py-10">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No loans found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            filteredLoans.map(loan => (
              <Card key={loan.id} className={`overflow-hidden transition-all duration-200 ${loan.featured ? 'border-primary/50 bg-primary/5' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{loan.name}</CardTitle>
                      <CardDescription className="text-sm">{loan.provider}</CardDescription>
                    </div>
                    {loan.featured && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{loan.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Interest: {loan.interest}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Term: {loan.repaymentPeriod}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-500 mt-1" />
                      <span className="text-sm">{loan.eligibility}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Map className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-wrap gap-1">
                        {loan.locations.map(location => (
                          <Badge key={location} variant="secondary" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end pt-2">
                  <Button variant="outline">Learn More</Button>
                  <Button className="ml-2">Apply Now</Button>
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