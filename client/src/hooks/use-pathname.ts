import { useState, useEffect } from 'react';

/**
 * A simple hook to get the current pathname from window.location
 * and update it when navigation occurs
 */
export function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname);
  
  useEffect(() => {
    // Track navigation events to update the pathname
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };
    
    // Listen for popstate event (browser navigation)
    window.addEventListener('popstate', handleLocationChange);
    
    // Create a MutationObserver to detect changes to the URL without page reload
    // This handles programmatic navigation in SPA environments
    const observer = new MutationObserver(() => {
      if (pathname !== window.location.pathname) {
        setPathname(window.location.pathname);
      }
    });
    
    // Observe the document's title as a proxy for navigation events
    observer.observe(document.querySelector('title') || document.body, {
      subtree: true, 
      childList: true
    });
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      observer.disconnect();
    };
  }, [pathname]);
  
  return pathname;
}

export default usePathname;