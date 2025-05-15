import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { SiFacebook, SiApple } from 'react-icons/si';

interface SocialLoginButtonsProps {
  variant?: 'login' | 'signup';
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  variant = 'login'
}) => {
  const googleText = variant === 'login' ? 'Continue with Google' : 'Sign up with Google';
  const facebookText = variant === 'login' ? 'Continue with Facebook' : 'Sign up with Facebook';
  const appleText = variant === 'login' ? 'Continue with Apple' : 'Sign up with Apple';
  
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
      <Button 
        variant="outline" 
        className="w-full bg-black text-white hover:bg-gray-800" 
        onClick={() => window.location.href = '/api/auth/apple'}
      >
        <SiApple className="mr-2 h-5 w-5 text-white" />
        {appleText}
      </Button>
    </div>
  );
};

export const SocialLoginCompactButtons: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <Button variant="outline" onClick={() => window.location.href = '/api/auth/google'} className="w-full">
        <FcGoogle className="mr-2 h-5 w-5" />
        Google
      </Button>
      <Button 
        variant="outline" 
        className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5]" 
        onClick={() => window.location.href = '/api/auth/facebook'}
      >
        <SiFacebook className="mr-2 h-5 w-5 text-white" />
        Facebook
      </Button>
      <Button 
        variant="outline" 
        className="w-full bg-black text-white hover:bg-gray-800" 
        onClick={() => window.location.href = '/api/auth/apple'}
      >
        <SiApple className="mr-2 h-5 w-5 text-white" />
        Apple
      </Button>
    </div>
  );
};