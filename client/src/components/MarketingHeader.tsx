import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown } from 'lucide-react';
import logoImage from '../assets/logo.png';

const MarketingHeader = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const handleMouseEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };
  
  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 fixed w-full z-50 top-0 left-0">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link to="/" className="flex items-center flex-shrink-0 mr-4">
          <img src={logoImage} alt="Leadapps Logo" className="h-7 w-auto" />
        </Link>
        
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex items-center">
            <ul className="flex space-x-6 items-center">
              <li 
                className="relative h-7 flex items-center" 
                onMouseEnter={() => handleMouseEnter('study')} 
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/study/caribbean" className="flex items-center text-gray-600 hover:text-blue-600 text-xs font-medium">
                  Study <ChevronDown className="ml-1 h-3 w-3" />
                </Link>
                <div 
                  className={`absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${activeDropdown === 'study' ? 'block' : 'hidden'}`}
                >
                  <div className="py-3 px-1">
                    <div className="mb-2"><Link to="/study/caribbean" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Caribbean</Link></div>
                    <div className="mb-2"><Link to="/study/us" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">US</Link></div>
                    <div className="mb-2"><Link to="/study/uk" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">UK</Link></div>
                    <div className="mb-2"><Link to="/study/canada" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Canada</Link></div>
                  </div>
                </div>
              </li>
              <li 
                className="relative h-7 flex items-center" 
                onMouseEnter={() => handleMouseEnter('services')} 
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/services/application-assistance" className="flex items-center text-gray-600 hover:text-blue-600 text-xs font-medium">
                  Services <ChevronDown className="ml-1 h-3 w-3" />
                </Link>
                <div 
                  className={`absolute left-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${activeDropdown === 'services' ? 'block' : 'hidden'}`}
                >
                  <div className="py-3 px-1">
                    <div className="mb-2"><Link to="/services/application-assistance" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Application Assistance</Link></div>
                    <div className="mb-2"><Link to="/services/visa-guidance" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Visa Guidance</Link></div>
                    <div className="mb-2"><Link to="/services/accommodation" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Accommodation</Link></div>
                    <div className="mb-2"><Link to="/services/test-preparation" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Test Preparation</Link></div>
                  </div>
                </div>
              </li>
              <li className="h-7 flex items-center">
                <Link to="/about-us" className="text-gray-600 hover:text-blue-600 text-xs font-medium">About Us</Link>
              </li>
              <li className="h-7 flex items-center">
                <Link to="/info-centre" className="text-gray-600 hover:text-blue-600 text-xs font-medium">Articles</Link>
              </li>
              <li className="h-7 flex items-center">
                <Link to="/fairs-events" className="text-gray-600 hover:text-blue-600 text-xs font-medium">Events</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/student-login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs h-7 min-w-[100px] whitespace-nowrap">
              Student Login
            </Button>
          </Link>
          <Link to="/app">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs h-7 min-w-[90px] whitespace-nowrap">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MarketingHeader;