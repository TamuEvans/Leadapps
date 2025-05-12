import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useLocation, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Listen for sidebar expanded state changes for proper content positioning
  // We're using a custom event for communication between components
  useEffect(() => {
    // Initial state - collapsed after short delay on desktop
    if (!isMobile) {
      const timer = setTimeout(() => {
        setSidebarExpanded(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Setup event listener for sidebar state changes
    const handleSidebarChange = (event: any) => {
      if (event.detail && typeof event.detail.expanded === 'boolean') {
        setSidebarExpanded(event.detail.expanded);
      }
    };

    window.addEventListener('sidebarStateChange', handleSidebarChange);
    
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarChange);
    };
  }, [isMobile]);

  // Get the page title based on current location path
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Home";
      case "/profile":
        return "Student Profile";
      case "/search":
        return "Search";
      case "/wishlist":
        return "Wishlist";
      case "/applications":
        return "Applications";
      case "/personality-hub":
        return "My Personality Hub";
      case "/counselling":
        return "Counselling";
      case "/articles":
        return "Articles";
      default:
        return "Not Found";
    }
  };

  // Check if this is a subpage (not the home page)
  const isSubPage = location !== "/";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isMobile ? "" : (sidebarExpanded ? "md:ml-60" : "md:ml-16")
        }`}
      >
        <div className="relative">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center space-x-1 text-sm">
                {isSubPage && (
                  <div 
                    className="text-primary hover:underline flex items-center cursor-pointer mr-1"
                    onClick={() => window.location.href = "/"}
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" /> Home
                  </div>
                )}
                {isSubPage && (
                  <>
                    <span className="text-gray-500 mx-1">/</span>
                    <span className="text-gray-700">{getPageTitle()}</span>
                  </>
                )}
                {!isSubPage && <span className="text-gray-700">{getPageTitle()}</span>}
              </div>
            </div>
          </header>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
