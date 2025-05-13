import React from 'react';
import MarketingHeader from '@/components/MarketingHeader';
import { Toaster } from '@/components/ui/toaster';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      <main className="flex-grow">
        {children}
      </main>
      {/* No footer for login pages */}
      <Toaster />
    </div>
  );
};

export default LoginLayout;