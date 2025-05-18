import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useLocation, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { UserMenu } from "@/components/UserMenu";
import AIGuideButton from "@/components/AIGuideButton";
import ContextualTips from "@/components/ContextualTips";
import UserProgress from "@/components/UserProgress";

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
    console.log("Current location:", location);
    switch (location) {
      case "/app":
        return "Home";
      case "/app/profile":
        return "Student Profile";
      case "/app/search":
        return "Search";
      case "/app/wishlist":
        return "Wishlist";
      case "/app/applications":
        return "Applications";
      case "/app/personality-hub":
        return "My Personality Hub";
      case "/app/counselling":
        return "Counselling";
      case "/app/articles":
        return "Articles";
      default:
        if (location.startsWith("/app/profile")) return "Student Profile";
        if (location.startsWith("/app/search")) return "Search";
        if (location.startsWith("/app/wishlist")) return "Wishlist";
        if (location.startsWith("/app/applications")) return "Applications";
        if (location.startsWith("/app/personality-hub")) return "My Personality Hub";
        if (location.startsWith("/app/counselling")) return "Counselling";
        if (location.startsWith("/app/articles")) return "Articles";
        return "Not Found";
    }
  };

  // Check if this is a subpage (not the home page)
  const isSubPage = location !== "/app";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isMobile ? "" : (sidebarExpanded ? "md:ml-60" : "md:ml-16")
        }`}
      >
        <div className="relative">
          <header className="bg-white sticky top-0 z-20 shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {isSubPage && (
                    <Link 
                      to="/app" 
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg p-1.5 flex items-center mr-3 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  )}
                  <div className="flex items-center">
                    {!isSubPage ? (
                      <h1 className="text-slate-800 font-medium text-base border-l-4 border-primary pl-2">{getPageTitle()}</h1>
                    ) : (
                      <>
                        <h1 className="text-slate-800 font-medium text-base border-l-4 border-primary pl-2">{getPageTitle()}</h1>
                      </>
                    )}
                  </div>
                </div>
                {/* User Menu */}
                <UserMenu />
              </div>
            </div>
          </header>
        </div>
        <div className="p-4 md:p-6">
          {/* Main content without sidebar layout */}
          {children}
          
          {/* UserProgress - compact floating widget at the bottom right only on home page */}
          {location === "/app" && (
            <div className="fixed bottom-20 right-5 z-30 w-60 hidden md:block">
              <UserProgress />
            </div>
          )}
        </div>
        
        {/* Interactive Elements */}
        <AIGuideButton />
        <ContextualTips />
      </main>
    </div>
  );
};

export default MainLayout;
