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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 via-teal-500 to-cyan-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-20 blur-xl"></div>
        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-4xl font-bold mb-2">🎯 Study Counselling</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Connect with expert Caribbean education counselors who specialize in helping students 
            achieve their tertiary education goals across different destination markets.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{counselors.length}</p>
                <p className="text-sm font-medium text-gray-600">Expert Counselors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{destinationMarkets.length}</p>
                <p className="text-sm font-medium text-gray-600">Destination Markets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">4.8</p>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">98%</p>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 p-8">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Filter className="h-6 w-6 text-purple-500" />
            Find Your Perfect Counselor
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Use filters to find counselors that match your specific needs and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 h-5 w-5" />
            <Input
              placeholder="Search by name, specialization, or keywords..."
              className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-purple-400 bg-white/70 backdrop-blur-sm text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-purple-300 to-transparent" />

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Destination Market</label>
              <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 bg-white/70">
                  <SelectValue placeholder="All Destinations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {destinationMarkets.map((destination) => (
                    <SelectItem key={destination} value={destination}>
                      {destination}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Program Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-green-400 bg-white/70">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-orange-400 bg-white/70">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">Gender</label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-pink-400 bg-white/70">
                  <SelectValue placeholder="Any Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Gender</SelectItem>
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
          <Card className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl">
            <CardContent className="p-16 text-center">
              <Users className="h-20 w-20 text-purple-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">No counselors found</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Try adjusting your filters or search criteria to find more counselors.
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-full px-8 py-3"
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
      <Card className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-xl overflow-hidden">
        <CardHeader className="p-8 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ✨ How Study Counselling Works
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Get personalized guidance for your tertiary education journey
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold">1. Find Your Counselor</h3>
              <p className="text-sm text-gray-600">
                Browse our network of expert counselors and find one that matches your destination and program preferences.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">2. Book Your Session</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Schedule a one-on-one consultation session at a time that works for you, either online or in-person.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">3. Get Expert Guidance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Receive personalized advice on program selection, applications, scholarships, and visa processes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}