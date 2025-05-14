import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  LightbulbIcon, 
  InfoIcon, 
  X, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Sparkles
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HelpTip {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'tip' | 'action' | 'insight';
  location: string; // Location-based path matching
  element?: string; // Optional element ID for positioning
  duration?: number; // How long should it stay visible (ms)
  priority: number; // Higher = more important
  dismissible: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Define contextual help catalog
const helpTips: HelpTip[] = [
  // Profile completion tips
  {
    id: 'profile-welcome',
    title: 'Complete Your Profile',
    description: 'Start by filling out your basic information. A complete profile helps us provide better program recommendations.',
    type: 'action',
    location: '/app/profile',
    priority: 100,
    dismissible: true,
    action: {
      label: 'Start Now',
      onClick: () => {
        // Find the basic info section by class name or h2 content
        const basicInfoSection = 
          document.querySelector('.basic-info-section') || 
          Array.from(document.querySelectorAll('h2')).find(el => 
            el.textContent?.includes('Basic Information'))?.parentElement;
            
        if (basicInfoSection) {
          basicInfoSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback: scroll to top of profile content
          document.querySelector('.profile-content')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  },
  {
    id: 'education-history',
    title: 'Add Your Academic Background',
    description: 'Adding your school history and test scores greatly improves our ability to match you with suitable programs.',
    type: 'tip',
    location: '/app/profile',
    priority: 90,
    dismissible: true,
    action: {
      label: 'Go to Education Section',
      onClick: () => {
        // Find the education section by class name or heading content
        const educationSection = 
          document.querySelector('.education-section') || 
          Array.from(document.querySelectorAll('h2, h3')).find(el => 
            el.textContent?.includes('Education') || 
            el.textContent?.includes('School'))?.parentElement;
            
        if (educationSection) {
          educationSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  },
  {
    id: 'documents-upload',
    title: 'Upload Your Documents',
    description: 'Having your documents ready in advance makes the application process much faster when you are ready to apply.',
    type: 'info',
    location: '/app/profile',
    priority: 80,
    dismissible: true,
    action: {
      label: 'View Documents Section',
      onClick: () => {
        // Find the documents section by class name or heading content
        const documentsSection = 
          document.querySelector('.documents-section') || 
          Array.from(document.querySelectorAll('h2, h3')).find(el => 
            el.textContent?.includes('Document') || 
            el.textContent?.includes('Files'))?.parentElement;
            
        if (documentsSection) {
          documentsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  },
  
  // Search page tips
  {
    id: 'search-filters',
    title: 'Use Filters For Better Results',
    description: 'Narrow down your options by location, program type, and more to find the perfect educational opportunity.',
    type: 'tip',
    location: '/app/search',
    priority: 100,
    dismissible: true,
    action: {
      label: 'Show Filters',
      onClick: () => {
        // Show search filters
        const searchFilterButton = document.querySelector('button[aria-label="Filter"]') || 
                                 document.querySelector('button:has(.filter-icon)');
        if (searchFilterButton) {
          (searchFilterButton as HTMLElement).click();
        }
      }
    }
  },
  {
    id: 'university-search',
    title: 'Explore Universities',
    description: 'Click on a university to view details about their programs, facilities, and admissions requirements.',
    type: 'info',
    location: '/app/university-search',
    priority: 90,
    dismissible: true,
    action: {
      label: 'See Available Programs',
      onClick: () => {
        // Find the first university card and click it
        const firstUniversityCard = document.querySelector('.university-card');
        if (firstUniversityCard) {
          (firstUniversityCard as HTMLElement).click();
        } else {
          // Show search filters if no universities
          const searchFilterButton = document.querySelector('button[aria-label="Filter"]');
          if (searchFilterButton) {
            (searchFilterButton as HTMLElement).click();
          }
        }
      }
    }
  },
  
  // Application tips
  {
    id: 'application-start',
    title: 'Ready to Apply?',
    description: 'Make sure your profile is complete and necessary documents are uploaded before starting your application.',
    type: 'action',
    location: '/app/applications',
    priority: 100,
    dismissible: true
  },
  {
    id: 'application-details',
    title: 'Track Your Application',
    description: 'Monitor the status of your applications and check for any missing information or next steps.',
    type: 'info',
    location: '/app/application',
    priority: 90,
    dismissible: true
  },
  
  // Personality hub tips
  {
    id: 'personality-assessment',
    title: 'Discover Your Strengths',
    description: 'Take the personality assessment to discover programs that match your unique strengths and interests.',
    type: 'insight',
    location: '/app/personality-hub',
    priority: 100,
    dismissible: true,
    action: {
      label: 'Take Assessment',
      onClick: () => window.location.href = '/app/personality-assessment'
    }
  },
  
  // Funding tips
  {
    id: 'funding-options',
    title: 'Explore Funding Options',
    description: 'Discover scholarships, grants, and loans to help finance your studies.',
    type: 'insight',
    location: '/app/funding-hub',
    priority: 100,
    dismissible: true
  }
];

export const ContextualTips: React.FC = () => {
  const [location] = useLocation();
  const [activeTips, setActiveTips] = useState<HelpTip[]>([]);
  const [dismissedTipIds, setDismissedTipIds] = useState<string[]>(
    JSON.parse(localStorage.getItem('dismissedTips') || '[]')
  );
  const { toast } = useToast();
  
  // Save dismissed tips to localStorage
  useEffect(() => {
    localStorage.setItem('dismissedTips', JSON.stringify(dismissedTipIds));
  }, [dismissedTipIds]);
  
  // Find relevant tips for the current location
  useEffect(() => {
    const relevantTips = helpTips
      .filter(tip => {
        // Check if tip is for current location (including path params)
        const isForCurrentLocation = location.startsWith(tip.location);
        
        // Check if tip hasn't been dismissed
        const isNotDismissed = !dismissedTipIds.includes(tip.id);
        
        return isForCurrentLocation && isNotDismissed;
      })
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 2); // Only show the highest priority tips (max 2)
    
    setActiveTips(relevantTips);
    
    // Show welcome toast when navigating to a new section
    if (relevantTips.length > 0) {
      const mainTip = relevantTips[0];
      
      // Only show toast for high priority tips and on first load
      if (mainTip.priority > 90 && !sessionStorage.getItem(`seen-${mainTip.id}`)) {
        toast({
          title: `💡 ${mainTip.title}`,
          description: mainTip.description,
          duration: 5000,
        });
        
        // Mark as seen in this session
        sessionStorage.setItem(`seen-${mainTip.id}`, 'true');
      }
    }
  }, [location, toast]);
  
  const dismissTip = (tipId: string) => {
    setDismissedTipIds(prev => [...prev, tipId]);
    setActiveTips(prev => prev.filter(tip => tip.id !== tipId));
  };
  
  const resetTips = () => {
    localStorage.removeItem('dismissedTips');
    setDismissedTipIds([]);
    toast({
      title: "Help Bubbles Reset",
      description: "Contextual help bubbles will now appear as you navigate.",
    });
  };
  
  // Function to determine icon based on tip type
  const getTipIcon = (type: HelpTip['type']) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
      case 'tip':
        return <LightbulbIcon className="h-5 w-5 text-yellow-500" />;
      case 'action':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'insight':
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Function to determine background color based on tip type
  const getTipBackground = (type: HelpTip['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-100';
      case 'tip':
        return 'bg-yellow-50 border-yellow-100';
      case 'action':
        return 'bg-green-50 border-green-100';
      case 'insight':
        return 'bg-purple-50 border-purple-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };
  
  // If no active tips, don't render anything
  if (activeTips.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-3 max-w-xs">
      {activeTips.map((tip) => (
        <Card 
          key={tip.id}
          className={cn(
            "shadow-md border animate-slideInRight",
            getTipBackground(tip.type)
          )}
        >
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                {getTipIcon(tip.type)}
                <CardTitle className="text-base">{tip.title}</CardTitle>
              </div>
              
              {tip.dismissible && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full" 
                  onClick={() => dismissTip(tip.id)}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </Button>
              )}
            </div>
            
            <CardDescription className="font-normal text-sm mt-1">
              {tip.description}
            </CardDescription>
          </CardHeader>
          
          {tip.action && (
            <CardFooter className="p-3 pt-1">
              <Button 
                size="sm" 
                variant="outline" 
                className={cn(
                  "text-xs w-full",
                  tip.type === 'action' && "bg-green-500 hover:bg-green-600 text-white border-none",
                  tip.type === 'insight' && "bg-purple-500 hover:bg-purple-600 text-white border-none"
                )} 
                onClick={tip.action.onClick}
              >
                {tip.action.label}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
      
      {/* Help Tips Reset Button - only visible when bubbles are showing */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-full right-0 mt-2 text-xs text-gray-500 hover:text-gray-700" 
        onClick={resetTips}
      >
        Reset all help bubbles
      </Button>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideInRight {
            animation: slideInRight 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default ContextualTips;