import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { UserRound, GraduationCap, Users, Globe } from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';

export default function AboutUs() {

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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4 text-lg">
              The journey to higher education is one of life's most critical decisions, yet the path is often fragmented, complex, and filled with administrative hurdles.
            </p>
            <p className="text-gray-700 mb-4 text-lg">
              Leadapps was founded on a simple premise: a student's future shouldn't be limited by a complicated application process.
            </p>
            <p className="text-gray-700 mb-4 text-lg">
              We provide a smart, centralized platform that streamlines the entire journey, from initial discovery to final submission. By bringing students, their families, and educational institutions together in one seamless ecosystem, we replace confusion with clarity and anxiety with confidence.
            </p>
            <p className="text-gray-700 text-lg">
              Our mission is to ensure that talent and ambition are what define a student's success, not their ability to navigate a complex system. We are here to clear the path.
            </p>
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