import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Search, Briefcase, Globe, School, Award, BookOpen } from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { PopularDestinations } from '@/components/PopularDestinations';
import logoImage from '../assets/logo.png';
import backgroundVideo from '../assets/background-video.mp4';

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
  // Video reference for optimization
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Optimize video playback
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.playsInline = true;
      
      // Play once then pause
      const handleVideoEnd = () => {
        videoElement.pause();
      };
      
      videoElement.addEventListener('ended', handleVideoEnd);
      
      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, []);

  // Popular programs data
  const popularPrograms = [
    { name: 'Business Administration', students: '12,450+', image: 'https://source.unsplash.com/random/300x200/?business' },
    { name: 'Computer Science', students: '9,870+', image: 'https://source.unsplash.com/random/300x200/?computer' },
    { name: 'Digital Marketing', students: '7,345+', image: 'https://source.unsplash.com/random/300x200/?marketing' },
    { name: 'MBA', students: '6,890+', image: 'https://source.unsplash.com/random/300x200/?mba' },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: 'Katrina',
      country: 'Philippines',
      text: 'Leadapps connected me with my dream university in the UK. The counselors guided me through every step!',
      image: 'https://source.unsplash.com/random/100x100/?woman,portrait',
    },
    {
      name: 'Jonathan',
      country: 'Nigeria', 
      text: 'The platform made applying to multiple universities so simple. I saved countless hours and got into my top choice!',
      image: 'https://source.unsplash.com/random/100x100/?man,portrait',
    },
    {
      name: 'Praneeth',
      country: 'India',
      text: 'From visa guidance to scholarship applications, Leadapps was with me at every stage. Truly grateful!',
      image: 'https://source.unsplash.com/random/100x100/?indian,man',
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

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full h-screen bg-black relative overflow-hidden flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 z-10"></div>
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            muted 
            playsInline
            poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col h-full">
          <div className="flex flex-col items-start text-left ml-0 md:ml-4 lg:ml-8 max-w-xl mt-32 md:mt-40">
            <div className="space-y-3 mb-3">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white modern-heading drop-shadow-lg">
                study made simple.
              </h1>
              <p className="text-white text-sm md:text-base font-medium drop-shadow-md max-w-md">
                Discover, apply, and enroll in universities worldwide. Get personalized guidance from our expert counselors.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link to="/app">
                  <Button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs md:text-sm font-medium border border-white/20 shadow-md">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" className="py-2 text-xs md:text-sm font-medium bg-white/50 border-gray-400 text-gray-800">Learn More</Button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 mx-auto">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 max-w-5xl mx-auto px-5 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                <div className="lg:col-span-3 text-center lg:text-left">
                  <h2 className="text-lg font-bold text-gray-900">Find Your Program</h2>
                  <p className="text-xs text-gray-800 hidden lg:block">10,000+ programs worldwide</p>
                </div>
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                  <div className="md:col-span-2">
                    <Input placeholder="Program" className="bg-white/80 border-gray-300 h-10 text-sm w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <Input placeholder="Country/Region" className="bg-white/80 border-gray-300 h-10 text-sm w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <Input placeholder="Study Level" className="bg-white/80 border-gray-300 h-10 text-sm w-full" />
                  </div>
                  <div className="md:col-span-1">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium h-10 text-sm">
                      <Search className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Search</span>
                    </Button>
                  </div>
                </div>
              </div>
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
          <div className="grid grid-cols-2 md:grid-cols-6 gap-5 max-w-6xl mx-auto">
            {[
              { image: "/images/students/student1.png", title: "Career Guidance" },
              { image: "/images/students/student2.png", title: "Programme Search" },
              { image: "/images/students/student3.png", title: "Streamlined Application System" },
              { image: "/images/students/student4.png", title: "Personalized Guidance" },
              { image: "/images/students/student5.png", title: "Loan/Scholarship Support" },
              { image: "/images/students/student6.png", title: "Other", extraScale: true }
            ].map((service, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-full relative" style={{ paddingTop: '110%' }}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className={`absolute inset-0 w-full h-full object-cover rounded-xl transform ${service.extraScale ? 'scale-125' : 'scale-110'}`} 
                  />
                </div>
                <p className="text-center font-medium text-gray-800 text-sm mt-3">{service.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <PopularDestinations />

      {/* Popular Programs Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Popular Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {popularPrograms.map((program, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${program.image})` }}></div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">{program.name}</h3>
                  <p className="text-sm text-gray-600">{program.students} Students</p>
                </div>
              </div>
            ))}
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
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
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
        <div className="container mx-auto px-4 md:px-6">
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
        <div className="container mx-auto px-4 md:px-6">
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
        <div className="container mx-auto px-4 md:px-6">
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
    </MarketingLayout>
  );
}