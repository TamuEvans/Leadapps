import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Briefcase, 
  Globe,
  Target,
  BarChart3,
  ArrowRight,
  ArrowDown, 
  School, 
  Award, 
  BookOpen, 
  Plus, 
  Minus, 
  Code, 
  LineChart, 
  GraduationCap, 
  Stethoscope, 
  Scale, 
  BrainCircuit, 
  PencilRuler, 
  ChevronRight,
  Microscope,
  Leaf,
  Building2,
  Check,
  Camera,
  LayoutPanelTop,
  Plane,
  Languages,
  PersonStanding,
  Wine,
  Utensils,
  Music,
  FileDigit,
  Palette,
  Brain,
  DollarSign,
  MessageCircle,
  File,
  Clock
} from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { PopularDestinations } from '@/components/PopularDestinations';
import logoImage from '../assets/logo.png';
import studentImage1 from '@assets/2_1759452471484.png';
import studentImage2 from '@assets/3_1759452471486.png';
import studentImage3 from '@assets/4_1759452471486.png';

// University logos
import uccLogo from '../assets/logos/ucc.jpg';
import utechLogo from '../assets/logos/utech.jpg';
import humberLogo from '../assets/logos/humber.gif';
import saitLogo from '../assets/logos/sait.png';
import sguLogo from '../assets/logos/sgu.jpg';
import usfLogo from '../assets/logos/usf.png';
import uwiLogo from '../assets/logos/uwi.png';

// Define university logo array for easier mapping
const universityLogos = [
  { src: uwiLogo, alt: "University of West Indies", height: "h-16" },
  { src: uccLogo, alt: "University of the Commonwealth Caribbean", height: "h-16" },
  { src: utechLogo, alt: "University of Technology, Jamaica", height: "h-20" },
  { src: sguLogo, alt: "St. George's University", height: "h-6" },
  { src: humberLogo, alt: "Humber College", height: "h-16" },
  { src: saitLogo, alt: "SAIT", height: "h-16" },
  { src: usfLogo, alt: "University of South Florida", height: "h-16" },
];

export default function Marketing() {
  // Auth status
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // State for cycling student images
  const studentImages = [studentImage1, studentImage2, studentImage3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Cycle through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % studentImages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [studentImages.length]);
  
  // State for search form inputs
  const [programSearch, setProgramSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [studyLevelSearch, setStudyLevelSearch] = useState('');
  
  // No longer need displayedPrograms state as we're showing all programs
  
  // Function to handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string with search parameters
    const queryParams = new URLSearchParams();
    if (programSearch) queryParams.append('program', programSearch);
    if (countrySearch) queryParams.append('country', countrySearch);
    if (studyLevelSearch) queryParams.append('level', studyLevelSearch);
    
    // Check authentication status
    if (isAuthenticated) {
      // If user is logged in, redirect to search page
      setLocation(`/app/search?${queryParams.toString()}`);
    } else {
      // If user is not logged in, redirect to login page with return URL
      // Store search parameters in localStorage to use after login
      localStorage.setItem('searchParams', queryParams.toString());
      setLocation('/student-login?returnUrl=' + encodeURIComponent(`/app/search?${queryParams.toString()}`));
    }
  };
  

  // Popular programs data with icons
  const popularPrograms = [
    { name: 'Business Administration', icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
    { name: 'Computer Science', icon: Code, color: 'bg-purple-50 text-purple-600' },
    { name: 'Digital Marketing', icon: LineChart, color: 'bg-green-50 text-green-600' },
    { name: 'Medicine', icon: Stethoscope, color: 'bg-red-50 text-red-600' },
    { name: 'Law', icon: Scale, color: 'bg-amber-50 text-amber-600' },
    { name: 'Psychology', icon: BrainCircuit, color: 'bg-indigo-50 text-indigo-600' },
    { name: 'MBA', icon: BarChart3, color: 'bg-cyan-50 text-cyan-600' },
    { name: 'Engineering', icon: PencilRuler, color: 'bg-orange-50 text-orange-600' },
    { name: 'Education', icon: School, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Data Science', icon: GraduationCap, color: 'bg-rose-50 text-rose-600' },
    { name: 'Nursing', icon: Award, color: 'bg-teal-50 text-teal-600' },
    { name: 'Accounting', icon: BookOpen, color: 'bg-sky-50 text-sky-600' },
    { name: 'Biology', icon: Microscope, color: 'bg-lime-50 text-lime-600' },
    { name: 'Environmental Science', icon: Leaf, color: 'bg-green-50 text-green-600' },
    { name: 'Architecture', icon: Building2, color: 'bg-gray-50 text-gray-600' },
    { name: 'Media Studies', icon: Camera, color: 'bg-fuchsia-50 text-fuchsia-600' },
    { name: 'Computer Engineering', icon: LayoutPanelTop, color: 'bg-violet-50 text-violet-600' },
    { name: 'Tourism', icon: Plane, color: 'bg-blue-50 text-blue-600' },
    { name: 'Languages', icon: Languages, color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Sport Science', icon: PersonStanding, color: 'bg-orange-50 text-orange-600' },
    { name: 'Hospitality', icon: Wine, color: 'bg-pink-50 text-pink-600' },
    { name: 'Culinary Arts', icon: Utensils, color: 'bg-red-50 text-red-600' },
    { name: 'Music', icon: Music, color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Finance', icon: FileDigit, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Fine Arts', icon: Palette, color: 'bg-purple-50 text-purple-600' },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Katrina',
      country: 'Jamaica',
      text: 'Leadapps connected me with my dream university in the UK. The counselors guided me through every step!',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
    },
    {
      name: 'Jonathan',
      country: 'Trinidad & Tobago', 
      text: 'The platform made applying to multiple universities so simple. I saved countless hours and got into my top choice!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
    },
    {
      name: 'Aaliyah',
      country: 'Barbados',
      text: 'From visa guidance to scholarship applications, Leadapps was with me at every stage. Truly grateful!',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80',
    },
  ];

  // FAQ items
  const faqItems = [
    { question: 'How do I apply to universities through Leadapps?', answer: 'Create an account, complete your profile, search for universities, and apply directly through our platform.' },
    { question: 'What documents do I need for my application?', answer: 'Typically, you\'ll need academic transcripts, language test scores, a personal statement, and recommendation letters.' },
    { question: 'How can I book a counseling session?', answer: 'Navigate to the Counseling section, choose a counselor, and select an available time slot.' },
    { question: 'Are there any application fees?', answer: 'Application fees vary by university. You can view all fees before submitting your application.' },
    { question: 'Can Leadapps help with my visa application?', answer: 'Yes, we provide comprehensive visa guidance and resources to help you prepare your application.' },
  ];
  
  // State for managing which FAQ items are expanded
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  
  // Toggle FAQ expansion
  const toggleFaq = (index: number) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full h-screen relative overflow-hidden flex items-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        {/* Subtle Pattern Background */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 1px, transparent 1px),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 140px 140px, 80px 80px',
            backgroundPosition: '0 0, 50px 50px, 25px 25px'
          }}
        ></div>
        
        {/* Circle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, rgba(255,255,255,0.4) 18px, transparent 19px),
              radial-gradient(circle at center, rgba(255,255,255,0.3) 12px, transparent 13px),
              radial-gradient(circle at center, rgba(255,255,255,0.2) 24px, transparent 25px)
            `,
            backgroundSize: '120px 120px, 180px 180px, 240px 240px',
            backgroundPosition: '0 0, 60px 60px, 120px 120px'
          }}
        ></div>

        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col h-full">
          <div className="flex flex-col lg:flex-row justify-center items-center h-full">
            {/* Left Content */}
            <div className="flex flex-col items-start text-left lg:w-1/2 max-w-xl">
              <div className="space-y-6 mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white modern-heading drop-shadow-lg">
                  study made simple.
                </h1>
                <p className="text-white text-base sm:text-lg md:text-xl font-medium drop-shadow-md max-w-2xl">
                  Discover, apply and enroll in universities locally and internationally. Get personalized guidance from our expert counselors.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/app">
                    <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-sm md:text-base font-medium border border-white/20 shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                  <Button variant="outline" className="px-6 py-3 text-sm md:text-base font-medium bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300">Learn More</Button>
                </div>
              </div>
            </div>

            {/* Right Side - Cycling Student Image */}
            <div className="lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
              <div className="relative w-full max-w-lg h-[24rem] sm:h-[28rem] lg:h-[32rem] flex items-center justify-center">
                {studentImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
                      currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Student ${index + 1}`}
                      className="w-full h-auto max-w-md object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 mx-auto">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 max-w-5xl mx-auto px-5 py-4">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                  <div className="lg:col-span-3 text-center lg:text-left">
                    <h2 className="text-lg font-bold text-gray-900">Find Your Programme</h2>
                    <p className="text-xs text-gray-800 hidden lg:block">10,000+ programmes worldwide</p>
                  </div>
                  <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                    <div className="md:col-span-2">
                      <Input 
                        placeholder="Programme" 
                        value={programSearch}
                        onChange={(e) => setProgramSearch(e.target.value)}
                        className="bg-white/80 border-gray-300 h-10 text-sm w-full" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input 
                        placeholder="Country/Region" 
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="bg-white/80 border-gray-300 h-10 text-sm w-full" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input 
                        placeholder="Study Level" 
                        value={studyLevelSearch}
                        onChange={(e) => setStudyLevelSearch(e.target.value)}
                        className="bg-white/80 border-gray-300 h-10 text-sm w-full" 
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium h-10 text-sm"
                      >
                        <Search className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Search</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Logos Section (From your mockup) */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-10 made-tommy-gradient">
            REVOLUTIONIZING TERTIARY EDUCATION ACCESS FOR <span className="whitespace-nowrap">CARIBBEAN STUDENTS</span>
          </h2>
          
          <div className="logo-marquee">
            <div className="logo-track">
              {/* First set of logos */}
              {universityLogos.map((logo, index) => (
                <div key={`logo-1-${index}`} className="logo-item">
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className={`${logo.height} object-contain`} 
                  />
                </div>
              ))}
              
              {/* Duplicate set of logos for continuous scrolling */}
              {universityLogos.map((logo, index) => (
                <div key={`logo-2-${index}`} className="logo-item">
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className={`${logo.height} object-contain`} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Simply one platform</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto">
            {[
              { image: "/images/students/student1.png", title: "Career Guidance" },
              { image: "/images/students/student2.png", title: "Programme Search" },
              { image: "/images/students/student3.png", title: "Streamlined Application System" },
              { image: "/images/students/student4.png", title: "Personalized Guidance" },
              { image: "/images/students/student5.png", title: "Loan/Scholarship Support" },
              { image: "/images/students/student6.png", title: "Other", extraScale: true }
            ].map((service, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div className="w-full relative overflow-hidden rounded-xl" style={{ paddingTop: '110%' }}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className={`absolute inset-0 w-full h-full object-cover transform ${service.extraScale ? 'scale-125 group-hover:scale-[1.3]' : 'scale-110 group-hover:scale-[1.15]'} transition-transform duration-300`} 
                  />
                </div>
                <p className="text-center font-medium text-gray-800 text-xs sm:text-sm mt-2 sm:mt-3">{service.title}</p>
              </div>
            ))}
          </div>
          
          {/* Process Map */}
          <div className="mt-16 max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-center mb-6">Your Journey With Us</h3>
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-1/2 top-12 bottom-12 w-1 -ml-0.5 bg-gradient-to-b from-purple-400 via-blue-500 to-green-400"></div>
              
              {/* Process Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
                {/* Step 1: Personality Hub */}
                <div className="md:col-start-1 flex items-center justify-center md:justify-end">
                  <div className="bg-purple-100 rounded-xl p-4 md:p-5 shadow-md w-full md:w-4/5 hover:shadow-2xl hover:scale-105 hover:bg-purple-200 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3 group-hover:animate-pulse group-hover:bg-purple-600 transition-colors">
                        <Brain className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="font-bold text-purple-700 group-hover:text-purple-800">Personality Hub</h4>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 group-hover:text-gray-800">Discover your strengths and ideal career path through our personality assessment tools.</p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
                
                {/* Step 2: Exam Prep Hub */}
                <div className="hidden md:block"></div>
                <div className="md:col-start-2 flex items-center justify-center md:justify-start">
                  <div className="bg-blue-100 rounded-xl p-4 md:p-5 shadow-md w-full md:w-4/5 hover:shadow-2xl hover:scale-105 hover:bg-blue-200 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 group-hover:animate-bounce group-hover:bg-blue-600 transition-colors">
                        <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="font-bold text-blue-700 group-hover:text-blue-800">Exam Prep Hub</h4>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 group-hover:text-gray-800">Prepare for your exams with our resources and join study groups with like-minded students.</p>
                  </div>
                </div>
                
                {/* Step 3: University Search */}
                <div className="md:col-start-1 flex items-center justify-center md:justify-end">
                  <div className="bg-indigo-100 rounded-xl p-4 md:p-5 shadow-md w-full md:w-4/5 hover:shadow-2xl hover:scale-105 hover:bg-indigo-200 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3 group-hover:animate-spin group-hover:bg-indigo-600 transition-colors">
                        <Globe className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="font-bold text-indigo-700 group-hover:text-indigo-800">University Search</h4>
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 group-hover:text-gray-800">Find your perfect university match based on your personality and academic strengths.</p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
                
                {/* Step 4: Funding Hub */}
                <div className="hidden md:block"></div>
                <div className="md:col-start-2 flex items-center justify-center md:justify-start">
                  <div className="bg-green-100 rounded-xl p-4 md:p-5 shadow-md w-full md:w-4/5 hover:shadow-2xl hover:scale-105 hover:bg-green-200 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 group-hover:animate-pulse group-hover:bg-green-600 transition-colors">
                        <DollarSign className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="font-bold text-green-700 group-hover:text-green-800">Funding Hub</h4>
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-800">Explore scholarship opportunities and financial aid options to support your education journey.</p>
                  </div>
                </div>
                
                {/* Step 5: Application Process */}
                <div className="md:col-start-1 flex items-center justify-end">
                  <div className="bg-amber-100 rounded-xl p-5 shadow-md w-full md:w-4/5 hover:shadow-2xl hover:scale-105 hover:bg-amber-200 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white mr-3 group-hover:animate-bounce group-hover:bg-amber-600 transition-colors">
                        <FileDigit className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="font-bold text-amber-700 group-hover:text-amber-800">Application Process</h4>
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-800">Submit your applications with guidance every step of the way from our expert counselors.</p>
                  </div>
                </div>
                <div className="hidden md:block"></div>
                
                {/* Step 6: Student Success */}
                <div className="hidden md:block"></div>
                <div className="md:col-start-2 flex items-center justify-start">
                  <div className="bg-rose-100 rounded-xl p-5 shadow-md w-full md:w-4/5 hover:shadow-2xl hover:scale-105 hover:bg-rose-200 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white mr-3 group-hover:animate-pulse group-hover:bg-rose-600 transition-colors">
                        <GraduationCap className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="font-bold text-rose-700 group-hover:text-rose-800">Student Success</h4>
                    </div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-800">Begin your educational journey with ongoing support from our community and resources.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <PopularDestinations />

      {/* Popular Programs Section */}
      <section className="w-full py-8 sm:py-10 lg:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 lg:mb-8">Popular Programs</h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            {popularPrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`${program.color} h-auto py-2 sm:py-3 px-3 sm:px-4 border-2 border-opacity-50 hover:opacity-90 transition-all group text-xs sm:text-sm`}
                  onClick={() => {
                    // Build query string
                    const queryParams = new URLSearchParams();
                    queryParams.append('program', program.name);
                    
                    // Check authentication status
                    if (isAuthenticated) {
                      // If user is logged in, redirect to search page
                      setLocation(`/app/search?${queryParams.toString()}`);
                    } else {
                      // If user is not logged in, redirect to login page with return URL
                      localStorage.setItem('searchParams', queryParams.toString());
                      setLocation('/student-login?returnUrl=' + encodeURIComponent(`/app/search?${queryParams.toString()}`));
                    }
                  }}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="font-medium">{program.name}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="mt-10 flex justify-center">
            <Button 
              variant="default"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 flex items-center"
              onClick={() => {
                // Always redirect to the search page in the app
                if (isAuthenticated) {
                  setLocation('/app/search');
                } else {
                  setLocation('/student-login?returnUrl=' + encodeURIComponent('/app/search'));
                }
              }}
            >
              View More <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Support Services Section */}
      <section className="w-full py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Support Services</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base">
              Our comprehensive support services are designed to help you navigate every step of your educational journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Study Counselling */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Study Counselling</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Connect with expert counselors who specialize in guiding students through the application process.</p>
              <Button variant="outline" className="mt-auto text-blue-600 border-blue-200 hover:bg-blue-50 text-sm">
                Learn More <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Personality Hub */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personality Hub</h3>
              <p className="text-gray-600 text-sm mb-4">Discover your strengths, interests, and ideal career paths with our personality assessment tools.</p>
              <Button variant="outline" className="mt-auto text-purple-600 border-purple-200 hover:bg-purple-50">
                Learn More <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Exam Prep Hub */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exam Prep Hub</h3>
              <p className="text-gray-600 text-sm mb-4">Access resources and preparation materials for standardized tests like CSEC, CAPE, BGCSE, SAT, and more.</p>
              <Button variant="outline" className="mt-auto text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                Learn More <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Funding Hub */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Funding Hub</h3>
              <p className="text-gray-600 text-sm mb-4">Find scholarships, financial aid opportunities, and funding resources tailored to your academic profile.</p>
              <Button variant="outline" className="mt-auto text-green-600 border-green-200 hover:bg-green-50">
                Learn More <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Apply Section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Search & Apply</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-2">
              <Input placeholder="Search programs, universities, or destinations" className="flex-grow" />
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-8 sm:py-10 lg:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 lg:mb-8">What they say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">{testimonial.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{testimonial.country}</p>
                    </div>
                  </div>
                  <p className="italic text-gray-700 text-sm sm:text-base">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Information Center Section */}
      <section className="w-full py-8 sm:py-10 lg:py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 lg:mb-8">Information Centre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { 
                title: "UK University Application Guide 2025", 
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80", 
                description: "A comprehensive step-by-step guide to applying to UK universities, including UCAS applications, personal statements, and entry requirements.",
                readTime: "12 min read",
                date: "April 15, 2025"
              },
              { 
                title: "From Jamaica to Canada: A Student's Journey", 
                image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80", 
                description: "Michelle shares her experience moving from Kingston to the University of Toronto, including challenges faced and advice for fellow Caribbean students.",
                readTime: "8 min read",
                date: "April 10, 2025"
              },
              { 
                title: "Top Scholarships for International Students 2025", 
                image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80", 
                description: "A comprehensive list of scholarships available to international students, including eligibility criteria and application deadlines.",
                readTime: "14 min read",
                date: "April 05, 2025"
              }
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="mr-3 sm:mr-4">{item.readTime}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{item.description}</p>
                  <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 text-sm">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-8 sm:py-10 lg:py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" alt="Beautiful university campus" className="rounded-lg shadow-lg w-full" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">We Solve Your Problems!</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { title: "Personalized Guidance", description: "Get tailored advice from experienced counselors" },
                  { title: "Simplified Process", description: "Navigate admissions with our easy-to-use platform" },
                  { title: "Timely Updates", description: "Stay informed about application status and deadlines" },
                  { title: "Ongoing Support", description: "From application to arrival, we're with you every step" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-blue-100 rounded-full p-1 flex items-center justify-center mt-0.5">
                      <div className="bg-blue-600 rounded-full w-3 h-3 sm:w-4 sm:h-4"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">{item.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Lead Ecosystem Section */}
      <section className="w-full py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Complete Lead Ecosystem Integration</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              LeadApps seamlessly connects with the entire Lead platform ecosystem to provide comprehensive student lifecycle management and optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* LeadGen Card */}
            <Card className="relative overflow-hidden border-4 border-purple-500 shadow-lg bg-white flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <img src="/assets/leadgen-logo.png" alt="LeadGen Logo" className="h-16 w-48 object-contain mx-auto mb-4" />
                  <p className="text-purple-600 font-medium">AI Marketing Platform</p>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-center">
                  AI lead generation and marketing platform that nurtures prospects through intelligent automation and personalized campaigns
                </p>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">AI Lead Generation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Automated Marketing Campaigns</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Prospect Nurturing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Conversion Optimization</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a 
                    href="https://leadgen-tamuevans.replit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Visit Website
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* LeadApps Card */}
            <Card className="relative overflow-hidden border-4 border-blue-500 shadow-lg bg-white flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <img src="/assets/leadapps-logo.png" alt="LeadApps Logo" className="h-16 w-48 object-contain mx-auto mb-4" />
                  <p className="text-blue-600 font-medium">Student Success Platform</p>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-center">
                  University search and application platform with AI support and guidance to help students find and apply to the right institutions
                </p>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">AI-Powered University Matching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Application Management</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Student Guidance & Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Document Processing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LeadEnroll Card */}
            <Card className="relative overflow-hidden border-4 border-green-500 shadow-lg bg-white flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <img src="/assets/leadenroll-logo.png" alt="LeadEnroll Logo" className="h-24 w-60 object-contain" />
                  </div>
                  <p className="text-green-600 font-medium">AI Enrollment Platform</p>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-center">
                  AI-powered enrollment platform for universities to automate admissions, optimize student placement, and enhance institutional growth
                </p>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">AI Admissions Automation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Smart Student Placement</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Enrollment Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Institutional Growth</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a 
                    href="https://leadenroll.replit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Visit Website
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Integration Flow */}
          <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 lg:mb-8">Seamless Integration Flow</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm sm:text-base">Lead Generation</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">Attract prospects</p>
                </div>
              </div>
              
              <div className="hidden md:block">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
              <div className="md:hidden">
                <ArrowDown className="h-6 w-6 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold">Student Journey</h4>
                  <p className="text-gray-600 text-sm">Guide applications</p>
                </div>
              </div>
              
              <div className="hidden md:block">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
              <div className="md:hidden">
                <ArrowDown className="h-6 w-6 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold">Enrollment Success</h4>
                  <p className="text-gray-600 text-sm">Track outcomes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-8 sm:py-10 lg:py-12 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 lg:mb-8">Questions?</h2>
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden border border-gray-100">
                <div 
                  className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base pr-2">
                    <span className="text-blue-600">{index + 1}.</span> {item.question}
                  </h3>
                  <button className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-all duration-200 flex-shrink-0">
                    {expandedFaqs.includes(index) ? <Minus size={15} /> : <Plus size={15} />}
                  </button>
                </div>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out" 
                  style={{ 
                    maxHeight: expandedFaqs.includes(index) ? '200px' : '0',
                    opacity: expandedFaqs.includes(index) ? 1 : 0,
                    padding: expandedFaqs.includes(index) ? '0 12px 12px 12px' : '0 12px'
                  }}
                >
                  <p className="text-gray-600 text-sm sm:text-base">{item.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}