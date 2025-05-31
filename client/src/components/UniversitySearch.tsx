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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-300 to-blue-400 rounded-full opacity-20 blur-xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">🏫 Find Your University</h1>
          <p className="text-xl text-white/90">Discover top universities and institutions worldwide</p>
        </div>
      </div>
      
      {/* Search and filters */}
      <form onSubmit={handleSearch} className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-3xl shadow-xl border-0 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="name-filter" className="block text-sm font-bold text-gray-700 mb-2">
            University Name
          </label>
          <Input
            id="name-filter"
            placeholder="Search by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="rounded-2xl border-gray-200 h-12 shadow-sm"
          />
        </div>
        
        <div>
          <label htmlFor="country-filter" className="block text-sm font-bold text-gray-700 mb-2">
            Country
          </label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="rounded-2xl border-gray-200 h-12 shadow-sm">
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
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl h-12 shadow-lg font-medium">
            Search Universities
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
                  <Card key={university.id} className="overflow-hidden flex flex-col rounded-3xl border-0 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
                      {university.logoUrl ? (
                        <img
                          src={university.logoUrl}
                          alt={`${university.name} logo`}
                          className="max-h-40 max-w-full object-contain z-10 relative"
                        />
                      ) : (
                        <div className="text-gray-500 text-lg font-medium bg-white/80 px-4 py-2 rounded-2xl shadow-lg">No logo available</div>
                      )}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
                    </div>
                    <CardHeader className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/app/universities/${university.id}`}>
                            <CardTitle className="text-xl font-bold text-gray-800 hover:text-blue-600 hover:underline cursor-pointer mb-2">
                              {university.name}
                            </CardTitle>
                          </Link>
                          <CardDescription className="text-gray-600 font-medium">
                            {university.city}, {university.country}
                          </CardDescription>
                        </div>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 rounded-full px-3 py-1">{university.country}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600 line-clamp-3">{university.description}</p>
                    </CardContent>
                    <CardFooter className="flex gap-3 p-6">
                      <Button asChild variant="outline" className="flex-1 rounded-2xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium">
                        <Link to={`/app/universities/${university.id}?tab=programs`}>
                          Explore Programmes
                        </Link>
                      </Button>
                      <Button asChild className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium shadow-lg">
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