import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { SiFacebook } from 'react-icons/si';

interface SocialLoginButtonsProps {
  variant?: 'login' | 'signup';
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  variant = 'login'
}) => {
  const googleText = variant === 'login' ? 'Continue with Google' : 'Sign up with Google';
  const facebookText = variant === 'login' ? 'Continue with Facebook' : 'Sign up with Facebook';
  
  return (
    <div className="flex flex-col space-y-3">
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={() => window.location.href = '/api/auth/google'}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        {googleText}
      </Button>
      <Button 
        variant="outline" 
        className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5]" 
        onClick={() => window.location.href = '/api/auth/facebook'}
      >
        <SiFacebook className="mr-2 h-5 w-5 text-white" />
        {facebookText}
      </Button>
    </div>
  );
};

export const SocialLoginCompactButtons: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" onClick={() => window.location.href = '/api/auth/google'}>
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>
      <Button 
        variant="outline" 
        className="bg-[#1877F2] text-white hover:bg-[#166FE5]" 
        onClick={() => window.location.href = '/api/auth/facebook'}
      >
        <SiFacebook className="mr-2 h-5 w-5 text-white" />
        Facebook
      </Button>
    </div>
  );
};