import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, MapPin, GraduationCap, Calendar, Globe, Clock, DollarSign, Info } from 'lucide-react';
import { Link } from 'wouter';

interface University {
  id: number;
  name: string;
  country: string;
  city: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  admissionRequirements?: string;
  applicationDeadlines?: any;
  contactEmail?: string;
  contactPhone?: string;
  ranking?: number;
  fundingOptions?: any;
  accommodationInfo?: string;
  internationalStudentInfo?: string;
}

interface Program {
  id: number;
  universityId: number;
  name: string;
  degree: string;
  level: string;
  discipline: string;
  duration: string;
  tuitionFee: number;
  currency: string;
  description: string;
  requirements?: any;
}

export default function UniversityProfilePage() {
  // Get the tab from the URL query parameter
  const getTabFromUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab === 'programs' || tab === 'admission') {
        return tab;
      }
    }
    return 'overview'; // Default tab
  };
  const { id } = useParams<{ id: string }>();
  const universityId = parseInt(id);
  
  // Fetch university details
  const { data: university, isLoading: isLoadingUniversity, isError: isErrorUniversity } = 
    useQuery<University>({
      queryKey: [`/api/universities/${universityId}`],
      queryFn: async () => {
        const response = await fetch(`/api/universities/${universityId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch university details');
        }
        return response.json();
      },
    });
  
  // Fetch programs for the university
  const { data: programsData, isLoading: isLoadingPrograms } = 
    useQuery<{ data: Program[] }>({
      queryKey: [`/api/universities/${universityId}/programs`],
      queryFn: async () => {
        const response = await fetch(`/api/universities/${universityId}/programs?limit=100`);
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }
        return response.json();
      },
      enabled: !isNaN(universityId),
    });

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (isLoadingUniversity) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading university profile...</p></div>;
  }
  
  if (isErrorUniversity || !university) {
    return <div className="flex justify-center items-center min-h-screen"><p>Error loading university information.</p></div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        {/* University Logo */}
        <div className="w-full md:w-1/4 flex-shrink-0">
          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <img 
                  src={university.logoUrl} 
                  alt={university.name} 
                  className="h-48 object-contain"
                />
              </div>
              <div className="mt-4 space-y-3">
                <Button asChild className="w-full">
                  <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" />
                    Official Website
                  </a>
                </Button>
                <Button variant="outline" className="w-full">
                  <Link to={`/app/university-search`} className="flex items-center justify-center gap-2">
                    Back to Search
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* University Information */}
        <div className="w-full md:w-3/4">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{university.name}</CardTitle>
              <CardDescription className="flex items-center text-base">
                <MapPin className="h-4 w-4 mr-1" />
                {university.city}, {university.country}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={getTabFromUrl()} className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="programs">Programs</TabsTrigger>
                  <TabsTrigger value="admission">Admission</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700">{university.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {university.ranking && (
                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <GraduationCap className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Ranking</p>
                          <p className="text-gray-700">#{university.ranking} Worldwide</p>
                        </div>
                      </div>
                    )}
                    
                    {university.contactEmail && (
                      <div className="flex items-start gap-2">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <Info className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Contact</p>
                          <p className="text-gray-700">{university.contactEmail}</p>
                          {university.contactPhone && (
                            <p className="text-gray-700">{university.contactPhone}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {university.accommodationInfo && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Accommodation</h3>
                      <p className="text-gray-700">{university.accommodationInfo}</p>
                    </div>
                  )}
                  
                  {university.internationalStudentInfo && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">International Students</h3>
                      <p className="text-gray-700">{university.internationalStudentInfo}</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Programs Tab */}
                <TabsContent value="programs">
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-4">Available Programs</h3>
                    
                    {isLoadingPrograms ? (
                      <p>Loading programs...</p>
                    ) : programsData && programsData.data.length > 0 ? (
                      <div className="space-y-4">
                        {/* Group programs by level */}
                        {["Undergraduate", "Graduate", "Doctoral"].map(level => {
                          const programsInLevel = programsData.data.filter(
                            program => program.level === level
                          );
                          
                          if (programsInLevel.length === 0) return null;
                          
                          return (
                            <div key={level} className="mb-6">
                              <h4 className="text-md font-semibold mb-3">{level} Programs</h4>
                              <div className="grid grid-cols-1 gap-3">
                                {programsInLevel.map(program => (
                                  <Card key={program.id} className="border shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <Link href={`/app/programs/${program.id}`}>
                                            <h5 className="font-medium text-blue-600 hover:underline">{program.name}</h5>
                                          </Link>
                                          <p className="text-sm text-gray-600">{program.degree} • {program.discipline}</p>
                                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                                            <span className="flex items-center">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {program.duration}
                                            </span>
                                            <span className="flex items-center">
                                              <DollarSign className="h-3 w-3 mr-1" />
                                              {formatCurrency(program.tuitionFee, program.currency)}
                                            </span>
                                          </div>
                                        </div>
                                        <Button size="sm" asChild>
                                          <Link href={`/app/programs/${program.id}`}>
                                            View Details
                                          </Link>
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p>No programs available.</p>
                    )}
                  </div>
                </TabsContent>
                
                {/* Admission Tab */}
                <TabsContent value="admission">
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold mb-2">Admission Requirements</h3>
                    <p className="text-gray-700">
                      {university.admissionRequirements || 
                       "Detailed admission requirements are available on the university website."}
                    </p>
                    
                    {university.applicationDeadlines && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Application Deadlines</h3>
                        <div className="space-y-2">
                          {typeof university.applicationDeadlines === 'object' ? (
                            Object.entries(university.applicationDeadlines).map(([term, deadline]) => (
                              <div key={term} className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{term}:</span> {deadline as string}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-700">{university.applicationDeadlines}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {university.fundingOptions && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Funding Options</h3>
                        <p className="text-gray-700">
                          {typeof university.fundingOptions === 'object' 
                            ? JSON.stringify(university.fundingOptions) 
                            : university.fundingOptions}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Button asChild>
                        <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          Visit Official Website <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}