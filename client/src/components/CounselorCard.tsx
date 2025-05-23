import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react';
import { Counselor } from '@shared/schema';

interface CounselorCardProps {
  counselor: Counselor;
  onBookSession?: (counselorId: number) => void;
  onViewProfile?: (counselorId: number) => void;
  isLoading?: boolean;
}

export default function CounselorCard({ 
  counselor, 
  onBookSession, 
  onViewProfile,
  isLoading = false 
}: CounselorCardProps) {
  const destinationMarkets = counselor.destinationMarkets ? 
    (Array.isArray(counselor.destinationMarkets) ? counselor.destinationMarkets : JSON.parse(counselor.destinationMarkets as string)) : [];
  
  const specialties = counselor.specialties ? 
    (Array.isArray(counselor.specialties) ? counselor.specialties : JSON.parse(counselor.specialties as string)) : [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={counselor.profileImageUrl || undefined} alt={counselor.name} />
            <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
              {counselor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="text-xl">{counselor.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {counselor.title}
            </CardDescription>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {renderStars(counselor.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {counselor.rating.toFixed(1)} ({counselor.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location and experience */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{counselor.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{counselor.yearsOfExperience} years exp.</span>
          </div>
        </div>

        {/* Cost range */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-600">
            ${counselor.costRangeMin} - ${counselor.costRangeMax} per session
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-700 line-clamp-3">
          {counselor.bio}
        </p>

        {/* Destination markets */}
        {destinationMarkets.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Destination Markets</h4>
            <div className="flex flex-wrap gap-1">
              {destinationMarkets.slice(0, 3).map((market: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {market}
                </Badge>
              ))}
              {destinationMarkets.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{destinationMarkets.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {specialties.slice(0, 2).map((specialty: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {specialties.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{specialties.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Availability indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-blue-600 font-medium">
            {counselor.isAvailable ? 'Available this week' : 'Limited availability'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile?.(counselor.id)}
            className="flex-1"
          >
            View Profile
          </Button>
          
          <Button
            size="sm"
            onClick={() => onBookSession?.(counselor.id)}
            disabled={!counselor.isAvailable || isLoading}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {isLoading ? 'Booking...' : 'Book Session'}
          </Button>
        </div>

        {/* Quick languages indicator */}
        {counselor.languages && counselor.languages.length > 0 && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Languages: {counselor.languages.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}