import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Home, User, Search, Heart, FileText, 
  Brain, MessageCircle, Newspaper, ChevronRight, Menu,
  DollarSign, GraduationCap, Sparkles, BookOpen, Users, UserPlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import leadappsLogo from "../assets/leadapps-logo.png";
import leadappsIcon from "../assets/leadapps-icon.png";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();
  
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

  // Main navigation items (search and apply related)
  const mainNavigationItems = [
    { path: "/app", label: "Home", icon: <Home className="w-5 h-5" size={20} /> },
    { path: "/app/profile", label: "Profile", icon: <User className="w-5 h-5" size={20} /> },
    { path: "/app/search", label: "Search", icon: <Search className="w-5 h-5" size={20} /> },
    { path: "/app/university-search", label: "Universities", icon: <GraduationCap className="w-5 h-5" size={20} /> },
    { path: "/app/wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" size={20} /> },
    { path: "/app/applications", label: "Applications", icon: <FileText className="w-5 h-5" size={20} /> },
    { path: "/app/counselling", label: "Counselling", icon: <MessageCircle className="w-5 h-5" size={20} /> },
    { path: "/app/articles", label: "Articles", icon: <Newspaper className="w-5 h-5" size={20} /> },
  ];

  // Agent-specific main navigation (replaces student Applications with agent Applications)
  const agentMainNavigationItems = [
    { path: "/app", label: "Home", icon: <Home className="w-5 h-5" size={20} /> },
    { path: "/app/profile", label: "Profile", icon: <User className="w-5 h-5" size={20} /> },
    { path: "/app/search", label: "Search", icon: <Search className="w-5 h-5" size={20} /> },
    { path: "/app/university-search", label: "Universities", icon: <GraduationCap className="w-5 h-5" size={20} /> },
    { path: "/app/wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" size={20} /> },
    { path: "/app/agent/applications", label: "All Applications", icon: <FileText className="w-5 h-5" size={20} /> },
    { path: "/app/counselling", label: "Counselling", icon: <MessageCircle className="w-5 h-5" size={20} /> },
    { path: "/app/articles", label: "Articles", icon: <Newspaper className="w-5 h-5" size={20} /> },
  ];

  // Support hub navigation items
  const hubNavigationItems = [
    { path: "/app/personality-hub", label: "Personality Hub", icon: <Brain className="w-5 h-5" size={20} /> },
    { path: "/app/exam-prep-hub", label: "Exam Prep Hub", icon: <BookOpen className="w-5 h-5" size={20} /> },
    { path: "/app/funding-hub", label: "Funding Hub", icon: <DollarSign className="w-5 h-5" size={20} /> },
  ];

  // Agent navigation items (only for agents)
  const agentNavigationItems = [
    { path: "/app/agent", label: "Agent Dashboard", icon: <Home className="w-5 h-5" size={20} /> },
    { path: "/app/agent/students", label: "Students", icon: <Users className="w-5 h-5" size={20} /> },
    { path: "/app/agent/invite", label: "Invite Student", icon: <UserPlus className="w-5 h-5" size={20} /> },
  ];

  // Keep track of whether the sidebar was manually toggled
  const [manuallyCollapsed, setManuallyCollapsed] = useState(false);
  
  const handleMouseEnter = () => {
    if (!isMobile && !manuallyCollapsed) {
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !manuallyCollapsed) {
      setExpanded(false);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
    setManuallyCollapsed(true); // Set manual collapse when user clicks the button
  };
  
  const isActive = (path: string) => {
    return location === path || (path !== "/app" && location.startsWith(path));
  };

  const renderNavItem = (item: { path: string; label: string; icon: JSX.Element }) => (
    <li key={item.path}>
      <Link to={item.path}>
        <div
          className={cn(
            "flex items-center rounded-md cursor-pointer h-10 transition-all duration-200",
            expanded ? "px-4" : "px-2 justify-center",
            !expanded && "justify-center", // Always center when collapsed
            isActive(item.path) 
              ? "bg-blue-700 text-white font-medium" 
              : expanded
                ? "hover:bg-blue-700/70 text-white/90"
                : "text-white/90 hover:bg-blue-800"
          )}
          onClick={() => setOpen(false)}
          title={!expanded ? item.label : undefined}
        >
          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
            <span className={cn(
              "flex items-center justify-center",
              isActive(item.path) ? "text-white" : expanded ? "text-white/90" : "text-white"
            )}>
              {item.icon}
            </span>
          </div>
          <span 
            className={cn(
              "ml-3 whitespace-nowrap overflow-hidden transition-all duration-300",
              expanded ? "opacity-100 max-w-[200px] text-white" : "opacity-0 max-w-0"
            )}
          >
            {item.label}
          </span>
        </div>
      </Link>
    </li>
  );

  const SidebarContent = () => (
    <>
      <div className={cn(
        "border-b border-gray-200 transition-all duration-200 ease-in-out",
        "flex items-center h-16",
        expanded ? "p-3 bg-white" : "p-3 bg-white justify-center"
      )}>
        <div className={cn(
          "flex items-center h-10",
          expanded ? "justify-between w-full" : "justify-center w-10"
        )}>
          <div className="flex items-center h-10 w-40 overflow-hidden relative">
            <img 
              src={leadappsLogo} 
              alt="Leadapps Logo" 
              className={cn(
                "h-10 absolute top-0 left-0 transition-opacity duration-300",
                expanded ? "opacity-100" : "opacity-0"
              )} 
            />
            <img 
              src={leadappsIcon} 
              alt="Leadapps Icon" 
              className={cn(
                "w-10 h-10 absolute top-0 left-0 transition-opacity duration-300",
                expanded ? "opacity-0" : "opacity-100"
              )}
            />
          </div>
          {!isMobile && expanded && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-6 w-6 text-gray-600 hover:bg-gray-100"
              onClick={toggleExpanded}
            >
              <ChevronRight className="h-4 w-4 transition-transform duration-200 rotate-180" />
            </Button>
          )}
        </div>
      </div>
      
      <nav className={cn(
        "transition-all duration-200 ease-in-out",
        "p-2"
      )}>
        {/* Agent navigation (only for agents) */}
        {user?.role === "agent" && (
          <>
            <ul className="space-y-1">
              {agentNavigationItems.map(renderNavItem)}
            </ul>
            
            <div className={expanded ? "px-3 my-3" : "px-2 my-3"}>
              <Separator className="bg-white/30" />
            </div>

            {/* Student tools for agents to manage students */}
            <ul className="space-y-1">
              {agentMainNavigationItems.map(renderNavItem)}
            </ul>
            
            <div className={expanded ? "px-3 my-3" : "px-2 my-3"}>
              <Separator className="bg-white/30" />
            </div>
            
            <ul className="space-y-1">
              {hubNavigationItems.map(renderNavItem)}
            </ul>
          </>
        )}

        {/* Main navigation group (only for students) */}
        {user?.role !== "agent" && (
          <>
            <ul className="space-y-1">
              {mainNavigationItems.map(renderNavItem)}
            </ul>
            
            {/* Separator between main nav and hubs */}
            <div className={expanded ? "px-3 my-3" : "px-2 my-3"}>
              <Separator className="bg-white/30" />
            </div>
            
            {/* Hub navigation group */}
            <ul className="space-y-1">
              {hubNavigationItems.map(renderNavItem)}
            </ul>
          </>
        )}
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
              <Button variant="outline" size="icon" className="fixed top-4 left-4 bg-white z-40">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-blue-900 border-r-blue-900" style={{ borderRight: "1px solid #1e3a8a" }}>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        
        {/* No bottom navigation - only hamburger menu at top */}
      </>
    );
  }

  // Desktop sidebar implementation (fixed)
  return (
    <aside 
      className={cn(
        "min-h-screen fixed z-30 top-0 left-0 border-r border-gray-200",
        "transition-all duration-300 ease-in-out",
        expanded ? "w-64 bg-blue-900" : "w-16 bg-blue-900"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
