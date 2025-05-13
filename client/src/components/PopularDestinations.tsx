import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';

type Destination = {
  id: string;
  name: string;
  flag: string;
  image: string;
  cityImage: string;
  universities: number;
};

const destinations: Destination[] = [
  {
    id: 'caribbean',
    name: 'Caribbean',
    flag: '🇯🇲',
    image: '/images/destinations/caribbean.svg',
    cityImage: '/images/destinations/cities/kingston.svg',
    universities: 12
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    image: '/images/destinations/uk.svg',
    cityImage: '/images/destinations/cities/london.svg',
    universities: 150
  },
  {
    id: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    image: '/images/destinations/usa.svg',
    cityImage: '/images/destinations/cities/newyork.svg',
    universities: 200
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    image: '/images/destinations/canada.svg',
    cityImage: '/images/destinations/cities/toronto.svg',
    universities: 80
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    image: '/images/destinations/australia.svg',
    cityImage: '/images/destinations/cities/sydney.svg',
    universities: 40
  }
];

export const PopularDestinations = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        
        {/* Card Deck */}
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-5xl">
            <div className="relative flex flex-wrap justify-center gap-4 md:gap-8">
              {destinations.map((destination, index) => (
                <Link 
                  key={destination.id} 
                  href={`/study-locations/${destination.id}`}
                  className="block"
                >
                  <div 
                    className="group relative w-64 transition-all duration-300 hover:z-10 hover:scale-105"
                    style={{ marginLeft: index > 0 ? '-40px' : '0' }}
                  >
                    <Card className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 h-full border-2 border-white">
                      <div className="relative">
                        {/* Flag image overlay */}
                        <div 
                          className="absolute inset-0 h-44 bg-cover bg-center opacity-30" 
                          style={{ 
                            backgroundImage: `url(${destination.image})` 
                          }}
                        />
                        
                        {/* City image */}
                        <div 
                          className="h-44 bg-cover bg-center" 
                          style={{ 
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url(${destination.cityImage})` 
                          }}
                        >
                          <div className="w-full h-full flex items-end p-4">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium">
                              {destination.flag} {destination.name}
                            </div>
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;