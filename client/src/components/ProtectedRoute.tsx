import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  testMode?: boolean; // For development/testing
}

export function ProtectedRoute({ children, testMode = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  // Set to true initially in development
  const [bypassProtection] = useState(testMode || process.env.NODE_ENV === 'development');

  useEffect(() => {
    // Only redirect if not in bypass mode
    if (!isLoading && !isAuthenticated && !bypassProtection) {
      setLocation('/student-login');
    }
  }, [isAuthenticated, isLoading, setLocation, bypassProtection]);

  if (isLoading && !bypassProtection) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  // Allow access in bypass mode
  if (bypassProtection) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}