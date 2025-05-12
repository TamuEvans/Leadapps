import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { 
  Home, User, Search, Heart, FileText, 
  Brain, MessageCircle, Newspaper 
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Sidebar = () => {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [open, setOpen] = useState(false);

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

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#1E40AF"/>
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="#3B82F6"/>
          </svg>
          <span className="text-primary font-semibold text-xl ml-2">leadapps</span>
        </div>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-600 rounded-md",
                    location === item.path 
                      ? "bg-primary bg-opacity-10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span className={cn("w-5", location === item.path ? "text-primary" : "text-gray-500")}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.label}</span>
                </a>
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
    <aside className="bg-white w-60 min-h-screen border-r border-gray-200 fixed">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
