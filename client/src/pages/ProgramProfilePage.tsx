import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Building,
  BriefcaseBusiness,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface University {
  id: number;
  name: string;
  country: string;
  city: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
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
  applicationDeadline?: string;
  startDates?: string[];
  careerProspects?: string;
  facultyInformation?: string;
  scholarships?: any;
  accreditation?: string;
  internshipOpportunities?: string;
  studyAbroadOptions?: boolean;
  campusResources?: string;
}

export default function ProgramProfilePage() {
  const { id } = useParams<{ id: string }>();
  const programId = parseInt(id);
  
  // Fetch program details
  const { data: program, isLoading: isLoadingProgram, isError: isErrorProgram } = 
    useQuery<Program>({
      queryKey: [`/api/programs/${programId}`],
      queryFn: async () => {
        const response = await fetch(`/api/programs/${programId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch program details');
        }
        return response.json();
      },
      enabled: !isNaN(programId),
    });
  
  // Fetch university details once we have the program
  const { data: university, isLoading: isLoadingUniversity } = 
    useQuery<University>({
      queryKey: [`/api/universities/${program?.universityId}`],
      queryFn: async () => {
        const response = await fetch(`/api/universities/${program?.universityId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch university details');
        }
        return response.json();
      },
      enabled: !!program?.universityId,
    });
  
  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (isLoadingProgram || isLoadingUniversity) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading program information...</p></div>;
  }
  
  if (isErrorProgram || !program) {
    return <div className="flex justify-center items-center min-h-screen"><p>Error loading program information.</p></div>;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 max-w-6xl">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{program.name}</h1>
          {university && (
            <div className="flex items-center mt-2">
              <Link href={`/app/universities/${university.id}`}>
                <a className="flex items-center hover:underline text-blue-600">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{university.name}</span>
                </a>
              </Link>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <span className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {university.city}, {university.country}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/university-search">
              Back to Search
            </Link>
          </Button>
          {university && (
            <Button asChild>
              <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{program.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Degree</p>
                    <p className="text-gray-700">{program.degree}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Discipline</p>
                    <p className="text-gray-700">{program.discipline}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-gray-700">{program.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tuition Fee</p>
                    <p className="text-gray-700">{formatCurrency(program.tuitionFee, program.currency)}</p>
                  </div>
                </div>
                
                {program.startDates && (
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Start Dates</p>
                      <p className="text-gray-700">
                        {Array.isArray(program.startDates) 
                          ? program.startDates.join(", ") 
                          : program.startDates}
                      </p>
                    </div>
                  </div>
                )}
                
                {program.applicationDeadline && (
                  <div className="flex items-start gap-2">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <AlertCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Application Deadline</p>
                      <p className="text-gray-700">{program.applicationDeadline}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="requirements">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requirements">
              <Card>
                <CardHeader>
                  <CardTitle>Admission Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  {program.requirements ? (
                    <div className="space-y-4">
                      {typeof program.requirements === 'object' ? (
                        <ul className="space-y-2">
                          {Object.entries(program.requirements).map(([key, value]) => (
                            <li key={key} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                              <div>
                                <span className="font-medium">{key}:</span> {value as string}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700">{program.requirements}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Please contact the university for detailed admission requirements.
                    </p>
                  )}
                  
                  {program.accreditation && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Accreditation</h4>
                      <p className="text-gray-700">{program.accreditation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="career">
              <Card>
                <CardHeader>
                  <CardTitle>Career Prospects</CardTitle>
                </CardHeader>
                <CardContent>
                  {program.careerProspects ? (
                    <p className="text-gray-700">{program.careerProspects}</p>
                  ) : (
                    <p className="text-gray-600">
                      Information about career prospects for this program is not currently available.
                    </p>
                  )}
                  
                  {program.internshipOpportunities && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Internship Opportunities</h4>
                      <p className="text-gray-700">{program.internshipOpportunities}</p>
                    </div>
                  )}
                  
                  {program.studyAbroadOptions && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Study Abroad Options</h4>
                      <p className="text-gray-700">
                        This program offers study abroad opportunities for eligible students.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Campus Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  {program.campusResources ? (
                    <p className="text-gray-700">{program.campusResources}</p>
                  ) : (
                    <p className="text-gray-600">
                      Information about campus resources for this program is not currently available. Please visit the university website for more details.
                    </p>
                  )}
                  
                  {program.facultyInformation && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Faculty Information</h4>
                      <p className="text-gray-700">{program.facultyInformation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {university && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>University Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-center mb-4">
                  <img 
                    src={university.logoUrl} 
                    alt={university.name}
                    className="h-32 object-contain" 
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{university.name}</h3>
                <p className="text-sm text-gray-700 mb-4">
                  {university.description.length > 150 
                    ? `${university.description.substring(0, 150)}...` 
                    : university.description}
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/app/universities/${university.id}`}>
                    View University Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {program.scholarships && (
            <Card>
              <CardHeader>
                <CardTitle>Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                {typeof program.scholarships === 'object' ? (
                  <ul className="space-y-2">
                    {Object.entries(program.scholarships).map(([name, details]) => (
                      <li key={name} className="border-b pb-2 last:border-0">
                        <h4 className="font-medium">{name}</h4>
                        <p className="text-sm text-gray-700">{details as string}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{program.scholarships}</p>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Ready to Apply?</CardTitle>
              <CardDescription>
                Start your application process for this program
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Review admission requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Check application deadlines</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Prepare required documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">Submit your application</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              {university && (
                <Button className="w-full" asChild>
                  <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" />
                    Apply on University Website
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}