import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const MarketingHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
              <span className="text-white font-semibold text-sm">L</span>
            </div>
            <span className="text-lg font-semibold text-blue-600">leadapps</span>
          </Link>
          
          <nav className="hidden md:flex ml-12">
            <ul className="flex space-x-10">
              <li className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 font-medium">
                  Study <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                  <ul className="py-2">
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Undergraduate</a></li>
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Masters</a></li>
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PhD</a></li>
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Diploma/Certificate</a></li>
                  </ul>
                </div>
              </li>
              <li className="relative group">
                <button className="flex items-center text-gray-600 hover:text-blue-600 font-medium">
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block">
                  <ul className="py-2">
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Application Assistance</a></li>
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Visa Guidance</a></li>
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Accommodation</a></li>
                    <li><a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Test Preparation</a></li>
                  </ul>
                </div>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Contact</a>
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