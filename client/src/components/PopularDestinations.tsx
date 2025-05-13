import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import './CityBackgrounds.css';

type Destination = {
  id: string;
  name: string;
  flag: string;
  multiFlags?: string[]; // Optional array of additional flags
  image: string;
  cityImage: string;
  cssClass: string;
  universities: number;
};

const destinations: Destination[] = [
  {
    id: 'caribbean',
    name: 'Caribbean',
    flag: '🇯🇲', // Jamaica
    multiFlags: ['🇯🇲', '🇹🇹', '🇧🇧', '🇧🇸', '🇬🇩'], // Jamaica, Trinidad, Barbados, Bahamas, Grenada
    image: '/images/destinations/caribbean.svg',
    cityImage: '/images/destinations/cities/grenada.webp',
    cssClass: 'kingston-bg',
    universities: 12
  },
  {
    id: 'united-kingdom',
    name: 'UK',
    flag: '🇬🇧',
    image: '/images/destinations/uk.svg',
    cityImage: '/images/destinations/cities/london-bridge.jpg',
    cssClass: 'london-bg',
    universities: 150
  },
  {
    id: 'united-states',
    name: 'USA',
    flag: '🇺🇸',
    image: '/images/destinations/usa.svg',
    cityImage: '/images/destinations/cities/miami.jpg',
    cssClass: 'miami-bg',
    universities: 200
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    image: '/images/destinations/canada.svg',
    cityImage: '/images/destinations/cities/toronto-cn-tower.jpg',
    cssClass: 'toronto-bg',
    universities: 80
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    image: '/images/destinations/australia.svg',
    cityImage: '/images/destinations/cities/sydney.webp',
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
                <Card className="destination-card shadow-none border-none overflow-hidden p-0 bg-white">
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className={`city-card ${destination.cssClass}`}>
                      {/* Flag in corner of image */}
                      {destination.multiFlags ? (
                        <div className="multi-flags">
                          {destination.multiFlags.map((flag, index) => (
                            <span key={index} className="flag">{flag}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="corner-flag">{destination.flag}</span>
                      )}
                    </div>
                    <div className="white-card-footer">
                      <div className="destination-title">
                        {destination.name}
                      </div>
                      <div className="universities-count">
                        {destination.universities} Universities
                      </div>
                      <div className="flex justify-end items-center mt-2">
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