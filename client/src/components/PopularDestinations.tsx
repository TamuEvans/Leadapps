import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import './CityBackgrounds.css';

type Destination = {
  id: string;
  name: string;
  flag: string;
  image: string;
  cityImage: string;
  cssClass: string;
  universities: number;
};

const destinations: Destination[] = [
  {
    id: 'caribbean',
    name: 'Caribbean',
    flag: '🇯🇲',
    image: '/images/destinations/caribbean.svg',
    cityImage: '/images/destinations/cities/kingston.svg',
    cssClass: 'kingston-bg',
    universities: 12
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    flag: '🇬🇧',
    image: '/images/destinations/uk.svg',
    cityImage: '/images/destinations/cities/london.svg',
    cssClass: 'london-bg',
    universities: 150
  },
  {
    id: 'united-states',
    name: 'United States',
    flag: '🇺🇸',
    image: '/images/destinations/usa.svg',
    cityImage: '/images/destinations/cities/newyork.svg',
    cssClass: 'newyork-bg',
    universities: 200
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    image: '/images/destinations/canada.svg',
    cityImage: '/images/destinations/cities/toronto.svg',
    cssClass: 'toronto-bg',
    universities: 80
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    image: '/images/destinations/australia.svg',
    cityImage: '/images/destinations/cities/sydney.svg',
    cssClass: 'sydney-bg',
    universities: 40
  }
];

export const PopularDestinations = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
        
        {/* Card Deck */}
        <div className="card-deck">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="card-wrapper"
              style={{ zIndex: destinations.length - index }}
            >
              <Link 
                href="/"
                className="block"
              >
                <Card className="destination-card border-none overflow-hidden p-0">
                  <div className="flex flex-col h-full">
                    <div className={`city-card ${destination.cssClass}`}>
                      {/* Image area - now free of text */}
                    </div>
                    <div className="white-card-footer">
                      <div className="destination-title">
                        <span className="flag-icon">{destination.flag}</span>
                        {destination.name}
                      </div>
                      <div className="universities-count">
                        {destination.universities} Universities
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-500">
                          Popular Destination
                        </div>
                        <span className="text-primary text-xs font-medium">
                          View →
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;