import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialLoginButtons, SocialLoginCompactButtons } from '@/components/SocialLoginButtons';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Search, Briefcase, Globe, School, Award, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import heroImage1 from '@assets/2_1760900651382.png';
import heroImage2 from '@assets/3_1760900651382.png';
import heroImage3 from '@assets/4_1760900651383.png';

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

export default function Home() {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to app profile
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/app/profile');
    }
  }, [isAuthenticated, setLocation]);

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
      
      setLocation('/app/profile');
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
      
      setLocation('/app/profile');
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

  // Popular destinations data
  const popularDestinations = [
    { name: 'United Kingdom', flag: '🇬🇧', universities: 129 },
    { name: 'Australia', flag: '🇦🇺', universities: 43 },
    { name: 'Canada', flag: '🇨🇦', universities: 96 },
    { name: 'United States', flag: '🇺🇸', universities: 215 },
    { name: 'New Zealand', flag: '🇳🇿', universities: 17 },
  ];

  // Popular programs data
  const popularPrograms = [
    { name: 'Business Administration', students: '12,450+' },
    { name: 'Computer Science', students: '9,870+' },
    { name: 'Digital Marketing', students: '7,345+' },
    { name: 'MBA', students: '6,890+' },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Katrina',
      country: 'Philippines',
      text: 'Leapapps connected me with my dream university in the UK. The counselors guided me through every step!',
      image: '/images/testimonial-1.jpg',
    },
    {
      name: 'Jonathan',
      country: 'Nigeria', 
      text: 'The platform made applying to multiple universities so simple. I saved countless hours and got into my top choice!',
      image: '/images/testimonial-2.jpg',
    },
    {
      name: 'Praneeth',
      country: 'India',
      text: 'From visa guidance to scholarship applications, Leapapps was with me at every stage. Truly grateful!',
      image: '/images/testimonial-3.jpg',
    },
  ];

  // FAQ items
  const faqItems = [
    { question: 'How do I apply to universities through Leapapps?', answer: 'Create an account, complete your profile, search for universities, and apply directly through our platform.' },
    { question: 'What documents do I need for my application?', answer: 'Typically, you\'ll need academic transcripts, language test scores, a personal statement, and recommendation letters.' },
    { question: 'How can I book a counseling session?', answer: 'Navigate to the Counseling section, choose a counselor, and select an available time slot.' },
    { question: 'Are there any application fees?', answer: 'Application fees vary by university. You can view all fees before submitting your application.' },
    { question: 'Can Leapapps help with my visa application?', answer: 'Yes, we provide comprehensive visa guidance and resources to help you prepare your application.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-32 bg-gradient-to-br from-purple-100 via-blue-50 via-cyan-50 to-green-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <div className="absolute right-[-10%] top-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-20 blur-3xl"></div>
          <div className="absolute right-[20%] top-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-pink-400 to-red-600 opacity-20 blur-3xl"></div>
          <div className="absolute right-[10%] top-[40%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-20 blur-3xl"></div>
          <div className="absolute right-[30%] top-[30%] w-[30%] h-[30%] rounded-full bg-gradient-to-br from-green-400 to-cyan-600 opacity-20 blur-3xl"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-16 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  🎓 study made simple.
                </h1>
                <p className="max-w-[600px] text-gray-700 md:text-xl leading-relaxed">
                  Discover, apply, and enroll in universities worldwide. Get personalized guidance from our expert counselors.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="px-10 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl text-lg font-medium shadow-xl transform hover:scale-105 transition-all duration-300">
                  Get Started ✨
                </Button>
                <Button className="px-10 py-4 bg-white/80 hover:bg-white text-gray-700 border-2 border-gray-200 rounded-2xl text-lg font-medium backdrop-blur-sm">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="flex flex-col space-y-6 bg-white/80 p-8 rounded-3xl shadow-2xl backdrop-blur-sm border border-white/50">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-2xl p-1">
                  <TabsTrigger value="login" className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Login</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="pt-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="📧 Email" {...field} className="h-12 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm" />
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
                              <Input type="password" placeholder="🔒 Password" {...field} className="h-12 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-right">
                        <Link to="/forgot-password">
                          <span className="text-sm text-blue-600 hover:underline cursor-pointer">Forgot password?</span>
                        </Link>
                      </div>
                      <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl font-medium shadow-lg" disabled={isLoginLoading}>
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
                <TabsContent value="register" className="pt-4">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="👤 First Name" {...field} className="h-12 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm" />
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
                                <Input placeholder="👤 Last Name" {...field} className="h-12 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm" />
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
                              <Input placeholder="📧 Email" {...field} className="h-12 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm" />
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
                              <Input type="password" placeholder="🔒 Password" {...field} className="h-12 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm" />
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
                              <Input type="password" placeholder="🔒 Confirm Password" {...field} className="h-12 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-medium shadow-lg" disabled={isRegisterLoading}>
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
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => window.location.href = '/api/auth/google'}>
                          Google
                        </Button>
                        <Button variant="outline" className="bg-[#1877F2] text-white hover:bg-[#166FE5]" onClick={() => window.location.href = '/api/auth/facebook'}>
                          Facebook
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Why Study Abroad Section */}
      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Why Study Through Leapapps?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Find Your Dream Program", description: "Browse thousands of programs across top universities worldwide", image: heroImage1 },
              { title: "Get Expert Guidance", description: "Connect with experienced counselors who specialize in international education", image: heroImage2 },
              { title: "Seamless Applications", description: "Apply to multiple universities with a single application form", image: heroImage3 }
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="w-full aspect-square relative bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain absolute inset-0"
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="w-full py-12 bg-blue-900 text-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: <Search className="h-6 w-6" />, title: "Program Search" },
              { icon: <Briefcase className="h-6 w-6" />, title: "Career Guidance" },
              { icon: <Globe className="h-6 w-6" />, title: "Visa Support" },
              { icon: <School className="h-6 w-6" />, title: "University Admission" },
              { icon: <Award className="h-6 w-6" />, title: "Scholarship Assistance" }
            ].map((service, index) => (
              <Card key={index} className="bg-blue-800 text-white border-none">
                <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                  <div className="bg-blue-700 rounded-full p-3 mb-3">
                    {service.icon}
                  </div>
                  <p className="text-center font-medium">{service.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularDestinations.map((destination, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{destination.flag}</div>
                  <h3 className="font-medium text-lg">{destination.name}</h3>
                  <p className="text-sm text-gray-600">{destination.universities} Universities</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Programs Section */}
      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {popularPrograms.map((program, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg">{program.name}</h3>
                  <p className="text-sm text-gray-600">{program.students} Students</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Apply Section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Search & Apply</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <Input placeholder="Search programs, universities, or destinations" className="flex-grow" />
              <Button className="bg-gradient-primary">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">What they say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.country}</p>
                    </div>
                  </div>
                  <p className="italic text-gray-700">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Information Center Section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Information Centre</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Application Process", image: "https://source.unsplash.com/random/300x200/?application", description: "Step-by-step guide to applying to universities abroad" },
              { title: "Visa Requirements", image: "https://source.unsplash.com/random/300x200/?visa", description: "Country-specific visa information for international students" },
              { title: "Scholarship Guide", image: "https://source.unsplash.com/random/300x200/?scholarship", description: "Comprehensive list of scholarships available for international students" }
            ].map((item, index) => (
              <Card key={index}>
                <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" />
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src="https://source.unsplash.com/random/600x400/?campus" alt="Beautiful campus" className="rounded-lg shadow-lg w-full" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">We Solve Your Problems!</h2>
              <div className="space-y-4">
                {[
                  { title: "Personalized Guidance", description: "Get tailored advice from experienced counselors" },
                  { title: "Simplified Process", description: "Navigate admissions with our easy-to-use platform" },
                  { title: "Timely Updates", description: "Stay informed about application status and deadlines" },
                  { title: "Ongoing Support", description: "From application to arrival, we're with you every step" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="bg-blue-100 rounded-full p-1 flex items-center justify-center">
                      <div className="bg-blue-600 rounded-full w-4 h-4"></div>
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Questions?</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <span className="text-blue-600">{index + 1}.</span> {item.question}
                  </h3>
                  <p className="text-gray-600 mt-2">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h3 className="font-bold mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Partners</a></li>
                <li><a href="#" className="hover:underline">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Study Abroad</a></li>
                <li><a href="#" className="hover:underline">Visa Counseling</a></li>
                <li><a href="#" className="hover:underline">Test Preparation</a></li>
                <li><a href="#" className="hover:underline">Scholarships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Guides</a></li>
                <li><a href="#" className="hover:underline">Events</a></li>
                <li><a href="#" className="hover:underline">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Terms</a></li>
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Cookies</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 Leapapps. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}