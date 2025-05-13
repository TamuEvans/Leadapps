import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';

type Destination = {
  id: string;
  name: string;
  flag: string;
  image: string;
  universities: number;
};

const destinations: Destination[] = [
  {
    id: 'caribbean',
    name: 'Caribbean',
    flag: '🇯🇲',
    image: '/images/destinations/caribbean.svg',
    universities: 12
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    image: '/images/destinations/uk.svg',
    universities: 150
  },
  {
    id: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    image: '/images/destinations/usa.svg',
    universities: 200
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    image: '/images/destinations/canada.svg',
    universities: 80
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    image: '/images/destinations/australia.svg',
    universities: 40
  }
];

export const PopularDestinations = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {destinations.map((destination) => (
            <Link 
              key={destination.id} 
              href={`/study-locations/${destination.id}`}
            >
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full">
                <div 
                  className="h-44 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${destination.image})` 
                  }}
                >
                  <div className="w-full h-full flex items-end p-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium">
                      {destination.flag} {destination.name}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">{destination.universities} Universities</div>
                    <span className="text-primary text-sm font-medium">View →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;