import React from "react";
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
      <main className="flex-1 md:ml-60 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center px-4 py-3">
            <div className="flex items-center space-x-1 text-sm">
              {isSubPage && (
                <div 
                  className="text-primary hover:underline flex items-center cursor-pointer"
                  onClick={() => window.location.href = "/"}
                >
                  <ArrowLeft className="w-3 h-3 mr-1" /> Home
                </div>
              )}
              {isSubPage && (
                <>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-700">{getPageTitle()}</span>
                </>
              )}
              {!isSubPage && <span className="text-gray-700">{getPageTitle()}</span>}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
