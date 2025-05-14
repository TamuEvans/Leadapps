import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { SiFacebook } from 'react-icons/si';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import LoginLayout from '@/layouts/LoginLayout';
import { SocialLoginCompactButtons } from '@/components/SocialLoginButtons';

// Login schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function StudentLogin() {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [returnUrl, setReturnUrl] = useState('/app/profile');

  // Parse return URL from query parameters and check authentication
  useEffect(() => {
    // Parse return URL from query parameters
    const params = new URLSearchParams(window.location.search);
    const returnUrlParam = params.get('returnUrl');
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }
    
    // If already authenticated, redirect to return URL or default profile
    if (isAuthenticated) {
      setLocation(returnUrl);
    }
  }, [isAuthenticated, setLocation, location, returnUrl]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoginLoading(true);
    try {
      await apiRequest('POST', '/api/auth/login', data);
      
      // Redirect to the return URL if set, otherwise to profile
      setLocation(returnUrl);
    } catch (error) {
      let message = 'Login failed';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle register form submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsRegisterLoading(true);
    try {
      await apiRequest('POST', '/api/auth/register', data);
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
      });
      
      // Redirect to the return URL if set, otherwise to profile
      setLocation(returnUrl);
    } catch (error) {
      let message = 'Registration failed';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <LoginLayout>
      <div className="container mx-auto px-4 py-16 mt-2"> {/* Reduced py-24 to py-16 to bring portal text closer to nav */}
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Student Portal</h1>
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="pt-2">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-right">
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600" disabled={isLoginLoading}>
                        {isLoginLoading ? 'Logging in...' : 'Login'}
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      <SocialLoginCompactButtons />
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="register" className="pt-2">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="First Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Last Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="password" placeholder="Confirm Password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600" disabled={isRegisterLoading}>
                        {isRegisterLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      <SocialLoginCompactButtons />
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </LoginLayout>
  );
}