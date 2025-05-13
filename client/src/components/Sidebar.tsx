import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Home, User, Search, Heart, FileText, 
  Brain, MessageCircle, Newspaper, ChevronRight, Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import leadappsLogo from "../assets/leadapps-logo.png";

const Sidebar = () => {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  
  // Set expanded to false initially on desktop after a short delay
  useEffect(() => {
    if (!isMobile) {
      const timer = setTimeout(() => {
        setExpanded(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);
  
  // Dispatch event when expanded state changes so MainLayout can respond
  useEffect(() => {
    const event = new CustomEvent('sidebarStateChange', { 
      detail: { expanded } 
    });
    window.dispatchEvent(event);
  }, [expanded]);

  const navigationItems = [
    { path: "/app", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/app/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { path: "/app/search", label: "Search", icon: <Search className="w-5 h-5" /> },
    { path: "/app/wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
    { path: "/app/applications", label: "Applications", icon: <FileText className="w-5 h-5" /> },
    { path: "/app/personality-hub", label: "My Personality Hub", icon: <Brain className="w-5 h-5" /> },
    { path: "/app/counselling", label: "Counselling", icon: <MessageCircle className="w-5 h-5" /> },
    { path: "/app/articles", label: "Articles", icon: <Newspaper className="w-5 h-5" /> },
  ];

  const handleMouseEnter = () => {
    if (!isMobile) {
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setExpanded(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const isActive = (path: string) => {
    return location === path || (path !== "/app" && location.startsWith(path));
  };

  const SidebarContent = () => (
    <>
      <div className={cn(
        "border-b border-gray-200 transition-all duration-200 ease-in-out",
        expanded ? "p-4" : "p-2"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {expanded ? (
              <img src={leadappsLogo} alt="Leadapps Logo" className="h-8" />
            ) : (
              <div className="w-8 h-8 rounded-full logo-icon-bg flex items-center justify-center">
                <div className="text-white font-bold text-lg">L</div>
              </div>
            )}
          </div>
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-6 w-6"
              onClick={toggleExpanded}
            >
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform duration-200",
                expanded ? "rotate-180" : "rotate-0"
              )} />
            </Button>
          )}
        </div>
      </div>
      
      <nav className={cn(
        "transition-all duration-200 ease-in-out",
        expanded ? "p-2" : "p-1"
      )}>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <div
                  className={cn(
                    "flex items-center rounded-md cursor-pointer transition-all duration-200",
                    expanded ? "px-4 py-2" : "px-2 py-2 justify-center",
                    isActive(item.path) 
                      ? "bg-gradient-primary text-white font-medium" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                  onClick={() => setOpen(false)}
                  title={!expanded ? item.label : undefined}
                >
                  <span className={cn(
                    "w-5",
                    isActive(item.path) ? "text-white" : "text-gray-500"
                  )}>
                    {item.icon}
                  </span>
                  {expanded && (
                    <span className="ml-3 transition-opacity duration-200">{item.label}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );

  // Mobile sidebar implementation (slide-out)
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 p-4 z-20">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
  }

  // Desktop sidebar implementation (fixed)
  return (
    <aside 
      className={cn(
        "bg-white min-h-screen border-r border-gray-200 fixed transition-all duration-300 ease-in-out z-30 top-0 left-0",
        expanded ? "w-60" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
