import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Home, User, Search, Heart, FileText, 
  Brain, MessageCircle, Newspaper, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

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
      detail: { expanded: expanded } 
    });
    window.dispatchEvent(event);
  }, [expanded]);

  const navigationItems = [
    { path: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { path: "/search", label: "Search", icon: <Search className="w-5 h-5" /> },
    { path: "/wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
    { path: "/applications", label: "Applications", icon: <FileText className="w-5 h-5" /> },
    { path: "/personality-hub", label: "My Personality Hub", icon: <Brain className="w-5 h-5" /> },
    { path: "/counselling", label: "Counselling", icon: <MessageCircle className="w-5 h-5" /> },
    { path: "/articles", label: "Articles", icon: <Newspaper className="w-5 h-5" /> },
  ];

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true);
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false);
      setExpanded(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const SidebarContent = () => (
    <>
      <div className={cn(
        "border-b border-gray-200 transition-all duration-200 ease-in-out",
        expanded ? "p-4" : "p-2"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#1E40AF"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#3B82F6"/>
            </svg>
            {expanded && (
              <span className="text-primary font-semibold text-xl ml-2 transition-opacity duration-200">
                leadapps
              </span>
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
              <div
                className={cn(
                  "flex items-center rounded-md cursor-pointer transition-all duration-200",
                  expanded ? "px-4 py-2" : "px-2 py-2 justify-center",
                  location === item.path 
                    ? "bg-primary bg-opacity-10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-600"
                )}
                onClick={() => {
                  setOpen(false);
                  window.location.href = item.path;
                }}
                title={!expanded ? item.label : undefined}
              >
                <span className={cn(
                  expanded ? "w-5" : "w-5",
                  location === item.path ? "text-primary" : "text-gray-500"
                )}>
                  {item.icon}
                </span>
                {expanded && (
                  <span className="ml-3 transition-opacity duration-200">{item.label}</span>
                )}
              </div>
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
        "bg-white min-h-screen border-r border-gray-200 fixed transition-all duration-300 ease-in-out z-10",
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
