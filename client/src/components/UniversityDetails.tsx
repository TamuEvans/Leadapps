import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// Types
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
}

interface ProgramsResponse {
  data: Program[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function UniversityDetails() {
  const { id } = useParams<{ id: string }>();
  const universityId = parseInt(id);
  
  // State for program filters
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10; // Number of programs per page
  
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
  
  // Build the query string for programs API call
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (disciplineFilter && disciplineFilter !== 'all') params.append('discipline', disciplineFilter);
    if (levelFilter && levelFilter !== 'all') params.append('level', levelFilter);
    if (nameFilter) params.append('name', nameFilter);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    return params.toString();
  };
  
  // Fetch programs
  const { data: programsData, isLoading: isLoadingPrograms, isError: isErrorPrograms } = 
    useQuery<ProgramsResponse>({
      queryKey: [`/api/universities/${universityId}/programs`, disciplineFilter, levelFilter, nameFilter, page],
      queryFn: async () => {
        const response = await fetch(`/api/universities/${universityId}/programs?${buildQueryString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }
        return response.json();
      },
      enabled: !isNaN(universityId),
    });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };
  
  // Handle pagination
  const nextPage = () => {
    if (programsData && page < programsData.pagination.totalPages) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  // Option lists for filters
  const disciplines = [
    { value: "all", label: "All Disciplines" },
    { value: "Computing", label: "Computing" },
    { value: "Business", label: "Business" },
    { value: "Engineering", label: "Engineering" },
    { value: "Medical Sciences", label: "Medical Sciences" },
    { value: "Social Sciences", label: "Social Sciences" },
    { value: "Hospitality", label: "Hospitality" },
    { value: "Education", label: "Education" },
    { value: "Law", label: "Law" },
    { value: "Sciences", label: "Sciences" },
    { value: "Health Sciences", label: "Health Sciences" },
  ];
  
  const levels = [
    { value: "all", label: "All Levels" },
    { value: "Undergraduate", label: "Undergraduate" },
    { value: "Graduate", label: "Graduate" },
    { value: "Doctoral", label: "Doctoral" },
  ];
  
  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  if (isNaN(universityId)) {
    return (
      <div className="container mx-auto my-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid University ID</h1>
        <Button asChild>
          <Link to="/app/university-search">Back to Search</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto my-8 px-4">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/app/university-search">← Back to Search</Link>
        </Button>
      </div>
      
      {/* University Header */}
      {isLoadingUniversity ? (
        <div className="mb-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isErrorUniversity ? (
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">Failed to load university details</h3>
          <p>Please try again later</p>
        </div>
      ) : university ? (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className="w-32 h-32 bg-gray-100 flex items-center justify-center p-2 rounded-lg">
              {university.logoUrl ? (
                <img
                  src={university.logoUrl}
                  alt={`${university.name} logo`}
                  className="max-h-28 max-w-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-lg font-medium">No logo</div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{university.name}</h1>
              <p className="text-lg text-gray-600 mb-2">
                {university.city}, {university.country}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Visit University Website
                  </a>
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">About the University</h2>
            <p className="text-gray-700">{university.description}</p>
          </div>
        </div>
      ) : null}
      
      {/* Programs Section */}
      <Tabs defaultValue="list" className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Programs Available</h2>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="card">Card View</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Search and filters */}
        <form onSubmit={handleSearch} className="mb-6 grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="name-filter" className="block text-sm font-medium mb-1">
              Program Name
            </label>
            <Input
              id="name-filter"
              placeholder="Search by name..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="discipline-filter" className="block text-sm font-medium mb-1">
              Discipline
            </label>
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a discipline" />
              </SelectTrigger>
              <SelectContent>
                {disciplines.map((discipline) => (
                  <SelectItem key={discipline.value} value={discipline.value}>
                    {discipline.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="level-filter" className="block text-sm font-medium mb-1">
              Level
            </label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Search
            </Button>
          </div>
        </form>
        
        {/* List View */}
        <TabsContent value="list">
          {isLoadingPrograms ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isErrorPrograms ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-2">Failed to load programs</h3>
              <p>Please try again later</p>
            </div>
          ) : programsData?.data.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-2">No programs found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <Table>
              <TableCaption>List of available programs</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Program Name</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Tuition Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programsData?.data.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.degree}</TableCell>
                    <TableCell>
                      <Badge variant={
                        program.level === 'Undergraduate' ? 'default' :
                        program.level === 'Graduate' ? 'secondary' : 'outline'
                      }>
                        {program.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{program.discipline}</TableCell>
                    <TableCell>{program.duration}</TableCell>
                    <TableCell>
                      {formatCurrency(program.tuitionFee, program.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm">
                        <Link to={`/app/programs/${program.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        
        {/* Card View */}
        <TabsContent value="card">
          {isLoadingPrograms ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-8 w-4/5 mb-2" />
                    <Skeleton className="h-4 w-3/5" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : isErrorPrograms ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-2">Failed to load programs</h3>
              <p>Please try again later</p>
            </div>
          ) : programsData?.data.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-2">No programs found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {programsData?.data.map((program) => (
                <Card key={program.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription>
                          {program.degree} • {program.duration}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        program.level === 'Undergraduate' ? 'default' :
                        program.level === 'Graduate' ? 'secondary' : 'outline'
                      }>
                        {program.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Discipline:</span>
                      <span className="text-sm font-medium">{program.discipline}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Tuition Fee:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(program.tuitionFee, program.currency)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 line-clamp-3">
                      {program.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/app/programs/${program.id}`}>
                        View Program Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Pagination */}
        {programsData && programsData.data.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {programsData.data.length} of {programsData.pagination.total} programs
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={page >= programsData.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}