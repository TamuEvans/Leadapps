import React from 'react';
import MarketingHeader from '@/components/MarketingHeader';
import { Toaster } from '@/components/ui/toaster';
import logoImage from '../assets/logo.png';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 text-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Logo and social icons - 3 columns on md+ screens */}
            <div className="md:col-span-3 flex flex-col items-start">
              <img src={logoImage} alt="Leadapps Logo" className="h-10 mb-4" />
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
            
            {/* Navigation sections - 9 columns divided into 3 sections on md+ screens */}
            <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4 text-blue-600 text-xs">About</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">About Us</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Careers</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Partners</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Press</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-blue-600 text-xs">Services</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Study Abroad</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Visa Counseling</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Test Preparation</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Scholarships</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-blue-600 text-xs">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Blog</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Guides</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Events</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Webinars</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-blue-600 text-xs">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Terms</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Privacy</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Cookies</a></li>
                  <li><a href="#" className="hover:underline text-xs text-gray-600 hover:text-blue-600">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500">
            <p className="text-xs">© 2025 Leadapps. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default MarketingLayout;