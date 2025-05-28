import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Home, User, GraduationCap, BookOpen, Users, MessageCircle, Bell, Settings } from "lucide-react";

interface MobileNavigationProps {
  unreadNotifications?: number;
  unreadMessages?: number;
}

export default function MobileNavigation({ unreadNotifications = 0, unreadMessages = 0 }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    {
      href: "/app",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      description: "Dashboard and overview"
    },
    {
      href: "/app/profile",
      label: "Profile",
      icon: <User className="h-5 w-5" />,
      description: "Personal information and settings"
    },
    {
      href: "/app/university-search",
      label: "University Search",
      icon: <GraduationCap className="h-5 w-5" />,
      description: "Find universities and programs"
    },
    {
      href: "/app/applications",
      label: "Applications",
      icon: <GraduationCap className="h-5 w-5" />,
      description: "University applications"
    },
    {
      href: "/app/personality-hub",
      label: "Personality Hub",
      icon: <Users className="h-5 w-5" />,
      description: "Career guidance and assessments"
    },
    {
      href: "/app/exam-prep-hub",
      label: "Exam Prep Hub",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Study materials and resources"
    },
    {
      href: "/app/funding-hub",
      label: "Funding Hub",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Scholarships and financial aid"
    },
    {
      href: "/app/counselling",
      label: "Counselling",
      icon: <Users className="h-5 w-5" />,
      description: "Connect with counselors"
    },
    {
      href: "/app/messages",
      label: "Messages",
      icon: <MessageCircle className="h-5 w-5" />,
      description: "Chat with counselors",
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      href: "/app/notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      description: "Updates and alerts",
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    },
    {
      href: "/app/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Account preferences"
    }
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Menu className="h-6 w-6" />
            {(unreadNotifications > 0 || unreadMessages > 0) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center">
                <div>
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <p className="text-sm text-gray-600">Quick access to all features</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = location === item.href || location.startsWith(item.href + '/');
                  
                  return (
                    <Link key={item.href} href={item.href} onClick={closeSheet}>
                      <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                          : 'hover:bg-gray-100'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-blue-200' : 'bg-gray-100'
                        }`}>
                          {item.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{item.label}</h3>
                            {item.badge && (
                              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="text-center">
                <p className="text-xs text-gray-500">LeadApps Student Portal</p>
                <p className="text-xs text-gray-400 mt-1">Version 2.0.1</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}