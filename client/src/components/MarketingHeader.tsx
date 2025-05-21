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
      
      {/* Bottom Navigation for smallest screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-1 flex justify-around z-30 md:hidden">
        {mobileNavLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            <div className="p-2 flex flex-col items-center text-gray-600 hover:text-blue-600">
              <link.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{link.label}</span>
            </div>
          </Link>
        ))}
        <button 
          onClick={toggleMobileMenu} 
          className="p-2 flex flex-col items-center text-gray-600 hover:text-blue-600"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <img src={logoImage} alt="Leadapps Logo" className="h-8 w-auto" />
                </Link>
                <button 
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={toggleMobileMenu}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              <nav className="space-y-2">
                {/* Study submenu */}
                <div className="mb-3">
                  <button 
                    className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                    onClick={() => toggleMobileSubMenu('study')}
                  >
                    <span>Study</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileSubMenu === 'study' ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`mt-1 ml-4 pl-2 border-l border-gray-200 space-y-1 ${mobileSubMenu === 'study' ? 'block' : 'hidden'}`}>
                    <Link to="/study/caribbean" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Caribbean
                    </Link>
                    <Link to="/study/us" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      US
                    </Link>
                    <Link to="/study/uk" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      UK
                    </Link>
                    <Link to="/study/canada" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Canada
                    </Link>
                  </div>
                </div>
                
                {/* Support Services submenu */}
                <div className="mb-3">
                  <button 
                    className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                    onClick={() => toggleMobileSubMenu('services')}
                  >
                    <span>Support Services</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileSubMenu === 'services' ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`mt-1 ml-4 pl-2 border-l border-gray-200 space-y-1 ${mobileSubMenu === 'services' ? 'block' : 'hidden'}`}>
                    <Link to="/services/counselling" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Study Counselling
                    </Link>
                    <Link to="/services/personality-hub" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Personality Hub
                    </Link>
                    <Link to="/services/exam-prep-hub" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Exam Prep Hub
                    </Link>
                    <Link to="/services/funding-hub" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Funding Hub
                    </Link>
                  </div>
                </div>
                
                {/* Programs submenu */}
                <div className="mb-3">
                  <button 
                    className="flex items-center justify-between w-full p-3 text-left text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                    onClick={() => toggleMobileSubMenu('programs')}
                  >
                    <span>Programs</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileSubMenu === 'programs' ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`mt-1 ml-4 pl-2 border-l border-gray-200 space-y-1 ${mobileSubMenu === 'programs' ? 'block' : 'hidden'}`}>
                    <Link to="/programs/undergraduate" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Undergraduate
                    </Link>
                    <Link to="/programs/graduate" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Graduate
                    </Link>
                    <Link to="/programs/professional" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Professional
                    </Link>
                    <Link to="/programs/certificates" className="block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded" onClick={() => setMobileMenuOpen(false)}>
                      Certificates
                    </Link>
                  </div>
                </div>
                
                {/* Other links */}
                <Link to="/about-us" className="block p-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
                <Link to="/info-centre" className="block p-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Articles
                </Link>
                <Link to="/fairs-events" className="block p-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Events
                </Link>
                <Link to="/resources" className="block p-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Resources
                </Link>
                <Link to="/contact" className="block p-3 text-gray-700 hover:bg-gray-100 rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Contact Us
                </Link>
              </nav>
            </div>
            
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-2">
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
    </header>
  );
};

export default MarketingHeader;