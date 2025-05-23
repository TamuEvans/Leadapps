import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, Calendar, MapPin, DollarSign, Star, Users } from 'lucide-react';
import CounselorCard from '@/components/CounselorCard';
import { useToast } from '@/hooks/use-toast';

export default function Counselling() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [minRating, setMinRating] = useState(0);
  const { toast } = useToast();

  // Fetch counselors
  const { data: counselors = [], isLoading } = useQuery({
    queryKey: ['/api/counselors'],
  });

  const destinationMarkets = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'New Zealand', 'Germany', 'Netherlands', 'France'
  ];

  const specialties = [
    'Undergraduate Programs', 'Graduate Programs', 'Medical School',
    'Engineering Programs', 'Business School', 'Law School',
    'Scholarship Applications', 'Student Visa Guidance'
  ];

  const locations = [
    'Trinidad and Tobago', 'Jamaica', 'Barbados', 'Guyana',
    'St. Lucia', 'Grenada', 'Bahamas', 'Belize'
  ];

  const handleBookSession = (counselorId: number) => {
    toast({
      title: "Book Session",
      description: "Redirecting to booking page...",
    });
    // This would navigate to booking flow
  };

  const handleViewProfile = (counselorId: number) => {
    toast({
      title: "View Profile",
      description: "Opening counselor profile...",
    });
    // This would navigate to detailed counselor profile
  };

  const filteredCounselors = counselors.filter((counselor: any) => {
    const matchesSearch = counselor.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         counselor.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDestination = !selectedDestination || 
                              counselor.destinationMarkets?.includes(selectedDestination);
    
    const matchesSpecialty = !selectedSpecialty || 
                            counselor.specialties?.includes(selectedSpecialty);
    
    const matchesLocation = !selectedLocation || 
                           counselor.location === selectedLocation;
    
    const matchesGender = !genderFilter || counselor.gender === genderFilter;
    
    const matchesRating = !minRating || (counselor.rating || 0) >= minRating;

    return matchesSearch && matchesDestination && matchesSpecialty && 
           matchesLocation && matchesGender && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Study Counselling</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with expert Caribbean education counselors who specialize in helping students 
          achieve their tertiary education goals across different destination markets.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{counselors.length}</p>
                <p className="text-sm text-gray-600">Expert Counselors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{destinationMarkets.length}</p>
                <p className="text-sm text-gray-600">Destination Markets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Find Your Perfect Counselor
          </CardTitle>
          <CardDescription>
            Use filters to find counselors that match your specific needs and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, specialization, or keywords..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Separator />

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination Market</label>
              <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Destinations</SelectItem>
                  {destinationMarkets.map((destination) => (
                    <SelectItem key={destination} value={destination}>
                      {destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Program Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Gender</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Minimum Rating</label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <Button
                  key={rating}
                  variant={minRating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMinRating(rating)}
                  className="flex items-center gap-1"
                >
                  <Star className="h-3 w-3" />
                  {rating === 0 ? 'Any' : `${rating}+`}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Available Counselors
          </h2>
          <Badge variant="secondary" className="text-sm">
            {filteredCounselors.length} counselor{filteredCounselors.length !== 1 ? 's' : ''} found
          </Badge>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCounselors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCounselors.map((counselor: any) => (
              <CounselorCard
                key={counselor.id}
                counselor={counselor}
                onBookSession={handleBookSession}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No counselors found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search criteria to find more counselors.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDestination('');
                  setSelectedSpecialty('');
                  setSelectedLocation('');
                  setGenderFilter('');
                  setMinRating(0);
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* How It Works Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>How Study Counselling Works</CardTitle>
          <CardDescription>
            Get personalized guidance for your tertiary education journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">1. Find Your Counselor</h3>
              <p className="text-sm text-gray-600">
                Browse our network of expert counselors and find one that matches your destination and program preferences.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">2. Book Your Session</h3>
              <p className="text-sm text-gray-600">
                Schedule a one-on-one consultation session at a time that works for you, either online or in-person.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">3. Get Expert Guidance</h3>
              <p className="text-sm text-gray-600">
                Receive personalized advice on program selection, applications, scholarships, and visa processes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}