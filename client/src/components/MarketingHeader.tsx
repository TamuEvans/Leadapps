import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  ChevronRight, 
  School, 
  BookOpen, 
  Globe, 
  FileText, 
  CalendarRange, 
  Landmark,
  GraduationCap
} from 'lucide-react';
import logoImage from '../assets/logo.png';

const MarketingHeader = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState<string | null>(null);
  
  const handleMouseEnter = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };
  
  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleMobileSubMenu = (menu: string) => {
    setMobileSubMenu(mobileSubMenu === menu ? null : menu);
  };
  
  // Array of main navigation links for the bottom mobile navigation
  const mobileNavLinks = [
    { label: 'Study', path: '/study/caribbean', icon: GraduationCap },
    { label: 'Services', path: '/services/counselling', icon: Landmark },
    { label: 'About', path: '/about-us', icon: Globe },
    { label: 'Articles', path: '/info-centre', icon: FileText },
    { label: 'Events', path: '/fairs-events', icon: CalendarRange },
  ];
  
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 fixed w-full z-50 top-0 left-0">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center flex-shrink-0 mr-4">
            <img src={logoImage} alt="Leadapps Logo" className="h-10 w-auto" />
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="ml-2 md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
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
                <Link to="/services/counselling" className="flex items-center text-gray-600 hover:text-blue-600 text-xs font-medium">
                  Support Services <ChevronDown className="ml-1 h-3 w-3" />
                </Link>
                <div 
                  className={`absolute left-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${activeDropdown === 'services' ? 'block' : 'hidden'}`}
                >
                  <div className="py-3 px-1">
                    <div className="mb-2"><Link to="/services/counselling" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Study Counselling</Link></div>
                    <div className="mb-2"><Link to="/services/personality-hub" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Personality Hub</Link></div>
                    <div className="mb-2"><Link to="/services/exam-prep-hub" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Exam Prep Hub</Link></div>
                    <div className="mb-2"><Link to="/services/funding-hub" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded">Funding Hub</Link></div>
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
      

      
      {/* Mobile Navigation Menu - Completely rebuilt for clarity */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
                <img src={logoImage} alt="Leadapps Logo" className="h-8 w-auto" />
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-blue-700 rounded-md"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  
                  {/* Study Destinations */}
                  <div className="border rounded-lg">
                    <button 
                      onClick={() => toggleMobileSubMenu('study')}
                      className="w-full flex items-center justify-between p-4 bg-blue-50 font-medium text-gray-800"
                    >
                      <span>Study Destinations</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubMenu === 'study' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {mobileSubMenu === 'study' && (
                      <div className="border-t bg-white">
                        <Link 
                          to="/study/caribbean" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50 border-b"
                        >
                          Caribbean
                        </Link>
                        <Link 
                          to="/study/us" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50 border-b"
                        >
                          United States
                        </Link>
                        <Link 
                          to="/study/uk" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50 border-b"
                        >
                          United Kingdom
                        </Link>
                        <Link 
                          to="/study/canada" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50"
                        >
                          Canada
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Support Services */}
                  <div className="border rounded-lg">
                    <button 
                      onClick={() => toggleMobileSubMenu('services')}
                      className="w-full flex items-center justify-between p-4 bg-green-50 font-medium text-gray-800"
                    >
                      <span>Support Services</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubMenu === 'services' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {mobileSubMenu === 'services' && (
                      <div className="border-t bg-white">
                        <Link 
                          to="/services/counselling" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50 border-b"
                        >
                          Study Counselling
                        </Link>
                        <Link 
                          to="/services/personality-hub" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50 border-b"
                        >
                          Personality Hub
                        </Link>
                        <Link 
                          to="/services/exam-prep-hub" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50 border-b"
                        >
                          Exam Prep Hub
                        </Link>
                        <Link 
                          to="/services/funding-hub" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block p-3 text-gray-700 hover:bg-gray-50"
                        >
                          Funding Hub
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  {/* Direct Links */}
                  <Link 
                    to="/about-us" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-4 bg-yellow-50 border rounded-lg font-medium text-gray-800 hover:bg-yellow-100"
                  >
                    About Us
                  </Link>
                  
                  <Link 
                    to="/info-centre" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-4 bg-purple-50 border rounded-lg font-medium text-gray-800 hover:bg-purple-100"
                  >
                    Articles
                  </Link>
                  
                  <Link 
                    to="/fairs-events" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-4 bg-orange-50 border rounded-lg font-medium text-gray-800 hover:bg-orange-100"
                  >
                    Events
                  </Link>
                  
                </div>
              </div>
              
              {/* Footer Buttons */}
              <div className="p-4 border-t bg-gray-50">
                <div className="space-y-2">
                  <Link to="/student-login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                      Student Login
                    </Button>
                  </Link>
                  <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingHeader;