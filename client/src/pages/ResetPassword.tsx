import React, { useState, useEffect } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import LoginLayout from '@/layouts/LoginLayout';

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/reset-password/:token');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!params?.token) {
        setIsValidToken(false);
        return;
      }

      try {
        const response = await apiRequest('POST', '/api/auth/verify-reset-token', {
          token: params.token
        });
        
        setIsValidToken(response.ok);
      } catch (error) {
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [params?.token]);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!params?.token) {
      toast({
        title: "Error",
        description: "Invalid reset token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/reset-password', {
        token: params.token,
        password: data.password
      });
      
      if (response.ok) {
        toast({
          title: "Password Reset Successful!",
          description: "Your password has been updated. You can now sign in with your new password.",
        });
        setLocation('/student-login');
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!match) {
    return (
      <LoginLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or missing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Link href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                  Request a new password reset
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </LoginLayout>
    );
  }

  if (isValidToken === null) {
    return (
      <LoginLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
              <p className="text-center mt-4 text-gray-600">Verifying reset link...</p>
            </CardContent>
          </Card>
        </div>
      </LoginLayout>
    );
  }

  if (isValidToken === false) {
    return (
      <LoginLayout>
        <div className="flex items-center justify-center min-h-screen px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Expired Link</CardTitle>
              <CardDescription>
                This password reset link has expired or has already been used.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Link href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                  Request a new password reset
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </LoginLayout>
    );
  }

  return (
    <LoginLayout>
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link href="/student-login" className="text-blue-600 hover:underline font-medium">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </LoginLayout>
  );
}