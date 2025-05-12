import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import logoImage from '../assets/logo.png';

const MarketingHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50 top-0 left-0">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center flex-grow">
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="Leadapps Logo" className="h-8 mr-2" />
          </Link>
          
          <nav className="hidden md:flex ml-12 flex-grow">
            <ul className="flex space-x-8">
              <li className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 font-medium">
                  Study <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50">
                  <ul className="py-2">
                    <li><Link to="/study/caribbean" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Caribbean</Link></li>
                    <li><Link to="/study/us" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">US</Link></li>
                    <li><Link to="/study/uk" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">UK</Link></li>
                    <li><Link to="/study/canada" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Canada</Link></li>
                    <li><Link to="/study/undergraduate" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Undergraduate</Link></li>
                    <li><Link to="/study/masters" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Masters</Link></li>
                    <li><Link to="/study/phd" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PhD</Link></li>
                  </ul>
                </div>
              </li>
              <li className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 font-medium">
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50">
                  <ul className="py-2">
                    <li><Link to="/services/application-assistance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Application Assistance</Link></li>
                    <li><Link to="/services/visa-guidance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Visa Guidance</Link></li>
                    <li><Link to="/services/accommodation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Accommodation</Link></li>
                    <li><Link to="/services/test-preparation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Test Preparation</Link></li>
                  </ul>
                </div>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-600 hover:text-blue-600 font-medium">About Us</Link>
              </li>
              <li>
                <Link to="/info-centre" className="text-gray-600 hover:text-blue-600 font-medium">Info Centre</Link>
              </li>
              <li>
                <Link to="/fairs-events" className="text-gray-600 hover:text-blue-600 font-medium">Fairs & Events</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/student-login" className="hidden sm:block">
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              Student Login
            </Button>
          </Link>
          <Link to="/app">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MarketingHeader;