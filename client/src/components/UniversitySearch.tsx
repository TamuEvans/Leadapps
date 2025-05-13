import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

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

interface UniversitiesResponse {
  data: University[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Main component
export function UniversitySearch() {
  // State for filters
  const [nameFilter, setNameFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 6; // Number of universities per page
  
  // Build the query string for API call
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (nameFilter) params.append('name', nameFilter);
    if (countryFilter && countryFilter !== 'all') params.append('country', countryFilter);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    return params.toString();
  };
  
  // Fetch universities
  const { data, isLoading, isError } = useQuery<UniversitiesResponse>({
    queryKey: ['/api/universities', nameFilter, countryFilter, page],
    queryFn: async () => {
      const response = await fetch(`/api/universities?${buildQueryString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch universities');
      }
      return response.json();
    },
  });
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };
  
  // Handle pagination
  const nextPage = () => {
    if (data && page < data.pagination.totalPages) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  // Countries list for filter
  const countries = [
    { value: "all", label: "All Countries" },
    { value: "Jamaica", label: "Jamaica" },
    { value: "Trinidad", label: "Trinidad" },
    { value: "Barbados", label: "Barbados" },
    { value: "Grenada", label: "Grenada" },
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
  ];
  
  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Your University</h1>
      
      {/* Search and filters */}
      <form onSubmit={handleSearch} className="mb-8 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="name-filter" className="block text-sm font-medium mb-1">
            University Name
          </label>
          <Input
            id="name-filter"
            placeholder="Search by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="country-filter" className="block text-sm font-medium mb-1">
            Country
          </label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
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
      
      {/* Results */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200">
                <Skeleton className="h-full w-full" />
              </div>
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
      ) : isError ? (
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">Failed to load universities</h3>
          <p>Please try again later</p>
        </div>
      ) : (
        <>
          {data?.data.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-xl font-semibold mb-2">No universities found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data?.data.map((university) => (
                  <Card key={university.id} className="overflow-hidden flex flex-col">
                    <div className="h-48 bg-gray-200 flex items-center justify-center p-4">
                      {university.logoUrl ? (
                        <img
                          src={university.logoUrl}
                          alt={`${university.name} logo`}
                          className="max-h-40 max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-lg font-medium">No logo available</div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/app/universities/${university.id}`}>
                            <CardTitle className="text-xl hover:text-blue-600 hover:underline cursor-pointer">
                              {university.name}
                            </CardTitle>
                          </Link>
                          <CardDescription>
                            {university.city}, {university.country}
                          </CardDescription>
                        </div>
                        <Badge>{university.country}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{university.description}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </Button>
                      <Button asChild className="flex-1">
                        <Link to={`/app/universities/${university.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-500">
                  Showing {data?.data.length ?? 0} of {data?.pagination.total ?? 0} universities
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
                    disabled={!data || page >= data.pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}