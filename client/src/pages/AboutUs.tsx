import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { UserRound, GraduationCap, Users, Globe } from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';

export default function AboutUs() {
  // Team members data
  const teamMembers = [
    { 
      name: "Dr. Sarah Johnson", 
      role: "Founder & CEO",
      bio: "With over 15 years of experience in international education, Dr. Johnson founded Leadapps to help students navigate the complex world of global higher education.",
      image: "https://randomuser.me/api/portraits/women/21.jpg"
    },
    { 
      name: "Michael Wong", 
      role: "Head of Student Services",
      bio: "Michael brings 10 years of university admissions experience to help students find the perfect academic fit for their career goals.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    { 
      name: "Aisha Rahman", 
      role: "Director of Global Partnerships",
      bio: "Aisha has built relationships with over 500 institutions worldwide to create opportunities for students from diverse backgrounds.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    { 
      name: "Carlos Mendez", 
      role: "Chief Technology Officer",
      bio: "Carlos leads our technology initiatives, creating innovative solutions that make the application process seamless for students worldwide.",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    },
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full pt-24 pb-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 modern-heading">About Leadapps</h1>
          <p className="text-lg text-gray-700 max-w-3xl mb-8">
            We're on a mission to transform access to global education opportunities for students from emerging markets, making quality education accessible to all through technology and expert guidance.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2018, Leadapps began with a simple idea: to democratize access to international education for students from emerging markets. Our founder, Dr. Sarah Johnson, observed the challenges facing talented students who lacked the resources and guidance to navigate complex application processes.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a small consultancy has grown into a comprehensive platform that has helped over 15,000 students from 45 countries achieve their educational dreams. We combine cutting-edge technology with personalized counseling to create a seamless experience.
              </p>
              <p className="text-gray-700">
                Today, we're proud partners with over 600 institutions worldwide, continuing to expand our reach and impact in making quality education accessible to all, regardless of geographic or economic background.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">15K+</div>
                <p className="text-gray-700">Students Served</p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">600+</div>
                <p className="text-gray-700">Partner Institutions</p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">45+</div>
                <p className="text-gray-700">Countries</p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <div className="text-blue-600 text-4xl font-bold mb-2">92%</div>
                <p className="text-gray-700">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                icon: <UserRound className="h-8 w-8 text-blue-600" />, 
                title: "Student-Centered", 
                description: "We put students' needs and goals first in everything we do, providing personalized guidance throughout their educational journey." 
              },
              { 
                icon: <GraduationCap className="h-8 w-8 text-blue-600" />, 
                title: "Educational Excellence", 
                description: "We're committed to connecting students with quality educational opportunities that match their academic potential." 
              },
              { 
                icon: <Users className="h-8 w-8 text-blue-600" />, 
                title: "Inclusivity", 
                description: "We believe in equal access to education for all, regardless of geographic, economic, or social background." 
              },
              { 
                icon: <Globe className="h-8 w-8 text-blue-600" />, 
                title: "Global Perspective", 
                description: "We embrace cultural diversity and foster international understanding through educational exchange." 
              },
            ].map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 bg-blue-50 p-4 rounded-full">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg text-center mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm text-center mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm text-center">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Our University Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="flex justify-center">
                <div className="h-16 w-28 bg-white rounded-lg flex items-center justify-center text-sm text-gray-500 shadow-sm">
                  University {index + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              View All Partners
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Global Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with us to start your international education journey. Our team is ready to help you achieve your dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Us
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}