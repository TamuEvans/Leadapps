import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Home, User, Search, Heart, FileText, 
  Brain, MessageCircle, Newspaper, ChevronRight, Menu,
  DollarSign, GraduationCap
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
    { path: "/app", label: "Home", icon: <Home className="w-5 h-5" size={20} /> },
    { path: "/app/profile", label: "Profile", icon: <User className="w-5 h-5" size={20} /> },
    { path: "/app/search", label: "Search", icon: <Search className="w-5 h-5" size={20} /> },
    { path: "/app/university-search", label: "Universities", icon: <GraduationCap className="w-5 h-5" size={20} /> },
    { path: "/app/wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" size={20} /> },
    { path: "/app/applications", label: "Applications", icon: <FileText className="w-5 h-5" size={20} /> },
    { path: "/app/personality-hub", label: "Personality Hub", icon: <Brain className="w-5 h-5" size={20} /> },
    { path: "/app/funding-hub", label: "Funding Hub", icon: <DollarSign className="w-5 h-5" size={20} /> },
    { path: "/app/counselling", label: "Counselling", icon: <MessageCircle className="w-5 h-5" size={20} /> },
    { path: "/app/articles", label: "Articles", icon: <Newspaper className="w-5 h-5" size={20} /> },
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
        "p-2 flex items-center h-12"
      )}>
        <div className="flex items-center justify-between h-8">
          <div className="flex items-center h-8 w-32 overflow-hidden relative">
            <img 
              src={leadappsLogo} 
              alt="Leadapps Logo" 
              className={cn(
                "h-8 absolute top-0 left-0 transition-opacity duration-300",
                expanded ? "opacity-100" : "opacity-0"
              )} 
            />
            <div 
              className={cn(
                "w-8 h-8 rounded-full logo-icon-bg flex items-center justify-center absolute top-0 left-0 transition-opacity duration-300",
                expanded ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="text-white font-bold text-lg">L</div>
            </div>
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
        "p-2"
      )}>
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>
                <div
                  className={cn(
                    "flex items-center rounded-md cursor-pointer h-10 transition-all duration-200",
                    expanded ? "px-4" : "px-2 justify-center",
                    !expanded && "justify-center", // Always center when collapsed
                    isActive(item.path) 
                      ? "bg-gradient-primary text-white font-medium" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                  onClick={() => setOpen(false)}
                  title={!expanded ? item.label : undefined}
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <span className={cn(
                      "flex items-center justify-center",
                      isActive(item.path) ? "text-white" : "text-gray-500"
                    )}>
                      {item.icon}
                    </span>
                  </div>
                  <span 
                    className={cn(
                      "ml-3 whitespace-nowrap overflow-hidden transition-all duration-300",
                      expanded ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                    )}
                  >
                    {item.label}
                  </span>
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
        "bg-white min-h-screen border-r border-gray-200 fixed z-30 top-0 left-0",
        "transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
