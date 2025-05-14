import React, { useState, useEffect } from 'react';
import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { BookOpen, Star } from 'lucide-react';

// Import custom tour styles
import '@/styles/tour.css';

// Define the tour steps for different pages
const tourSteps = {
  // Main dashboard steps
  '/app': [
    {
      element: '#dashboard-overview',
      intro: 'Welcome to your student dashboard! This is where you can see your progress at a glance.',
      position: 'right',
    },
    {
      element: '.sidebar',
      intro: 'Use the sidebar to navigate to different sections of the app.',
      position: 'right',
    },
    {
      element: '#profile-completion',
      intro: 'Keep track of your profile completion. A complete profile helps us provide better recommendations.',
      position: 'bottom',
    },
    {
      element: '#ai-guide-button',
      intro: 'Need help? Click here to chat with our AI assistant at any time.',
      position: 'left',
    },
  ],
  
  // Profile page steps
  '/app/profile': [
    {
      element: '#personal-info',
      intro: 'Start by completing your personal information to help us understand your background.',
      position: 'right',
    },
    {
      element: '#educational-background',
      intro: 'Add your educational history to help match you with suitable programs.',
      position: 'bottom',
    },
    {
      element: '#documents-section',
      intro: 'Upload important documents here for faster application processing later.',
      position: 'left',
    },
    {
      element: '#profile-completion-bar',
      intro: 'Your profile completion percentage increases as you add more information!',
      position: 'top',
    },
  ],
  
  // Search page steps
  '/app/search': [
    {
      element: '#search-bar',
      intro: 'Search for specific universities or programs here.',
      position: 'bottom',
    },
    {
      element: '#filter-button',
      intro: 'Use filters to narrow down your options by location, program type, and more.',
      position: 'right',
    },
    {
      element: '#search-results',
      intro: 'Browse through universities and programs that match your criteria.',
      position: 'top',
    },
  ],
  
  // University search page steps
  '/app/university-search': [
    {
      element: '#university-filters',
      intro: 'Filter universities by location, ranking, or specific features.',
      position: 'right',
    },
    {
      element: '.university-card',
      intro: 'Click on a university to view detailed information and available programs.',
      position: 'bottom',
    },
  ],
  
  // Applications page steps
  '/app/applications': [
    {
      element: '#applications-list',
      intro: 'Track all your applications in one place.',
      position: 'right',
    },
    {
      element: '#new-application-button',
      intro: 'Start a new application by clicking here.',
      position: 'bottom',
    },
    {
      element: '.application-status',
      intro: 'Monitor the status of each application throughout the process.',
      position: 'left',
    },
  ],
};

interface InteractiveTourProps {
  enabled?: boolean;
}

const InteractiveTour: React.FC<InteractiveTourProps> = ({ enabled = false }) => {
  const [location] = useLocation();
  const [stepsEnabled, setStepsEnabled] = useState(enabled);
  const [initialStep, setInitialStep] = useState(0);
  const [currentSteps, setCurrentSteps] = useState<any[]>([]);
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [tourCompleted, setTourCompleted] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('tourCompleted');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Get the base path for determining which tour to show
  const getBasePath = (path: string) => {
    // Extract the base path (e.g., '/app/profile' from '/app/profile/123')
    const pathSegments = path.split('/');
    if (pathSegments.length >= 3) {
      return `/${pathSegments[1]}/${pathSegments[2]}`;
    }
    if (pathSegments.length >= 2) {
      return `/${pathSegments[1]}`;
    }
    return path;
  };
  
  // Update steps when location changes
  useEffect(() => {
    const basePath = getBasePath(location);
    const steps = tourSteps[basePath as keyof typeof tourSteps] || [];
    
    // If this is a user's first visit to this page and we have steps for it
    const isFirstVisit = !tourCompleted[basePath];
    
    if (steps.length > 0 && isFirstVisit) {
      setCurrentSteps(steps);
      setInitialStep(0);
      
      // Wait a moment for the page to load before showing the tour
      const timer = setTimeout(() => {
        setStepsEnabled(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setStepsEnabled(false);
    }
  }, [location, tourCompleted]);
  
  // Mark tour as completed for current page
  const handleTourComplete = () => {
    const basePath = getBasePath(location);
    const updatedTourCompleted = { ...tourCompleted, [basePath]: true };
    setTourCompleted(updatedTourCompleted);
    localStorage.setItem('tourCompleted', JSON.stringify(updatedTourCompleted));
    setStepsEnabled(false);
  };
  
  const startTour = () => {
    setStepsEnabled(true);
    setInitialStep(0);
  };
  
  const resetAllTours = () => {
    localStorage.removeItem('tourCompleted');
    setTourCompleted({});
    setStepsEnabled(true);
  };

  // Options for the intro.js tour
  const tourOptions = {
    nextLabel: 'Next',
    prevLabel: 'Back',
    skipLabel: 'Skip',
    doneLabel: 'Done',
    hidePrev: false,
    hideNext: false,
    tooltipClass: 'customTooltip',
    highlightClass: 'customHighlight',
    exitOnEsc: true,
    exitOnOverlayClick: false,
    showStepNumbers: false,
    keyboardNavigation: true,
    showButtons: true,
    showBullets: true,
    showProgress: true,
    scrollToElement: true,
    overlayOpacity: 0.7,
    disableInteraction: false,
  };

  return (
    <>
      <Steps
        enabled={stepsEnabled}
        steps={currentSteps}
        initialStep={initialStep}
        onExit={() => setStepsEnabled(false)}
        onComplete={handleTourComplete}
        options={tourOptions}
      />
      
      <Hints enabled={hintsEnabled} hints={[]} />
      
      {/* Tour restart button - Fixed at top right of screen */}
      <div className="fixed top-20 right-4 z-10 flex gap-2">
        <Button 
          onClick={startTour} 
          variant="outline" 
          size="sm" 
          className="bg-white/90 shadow-sm flex items-center gap-1 text-xs"
        >
          <BookOpen className="h-3.5 w-3.5 mr-1" />
          Tour
        </Button>
        
        <Button 
          onClick={resetAllTours} 
          variant="outline" 
          size="sm" 
          className="bg-white/90 shadow-sm flex items-center gap-1 text-xs"
        >
          <Star className="h-3.5 w-3.5 mr-1" />
          Reset Tours
        </Button>
      </div>
    </>
  );
};

export default InteractiveTour;