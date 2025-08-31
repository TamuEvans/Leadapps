import React from 'react';
import { Toaster } from '@/components/ui/toaster';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex justify-center items-center">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default LoginLayout;