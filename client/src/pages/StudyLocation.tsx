import React from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import MarketingLayout from '@/layouts/MarketingLayout';

export default function StudyLocation() {
  // Get the current location from the URL
  const [, params] = useRoute('/study/:location');
  const location = params?.location;

  // Page content based on location
  const getLocationTitle = () => {
    switch (location) {
      case 'caribbean':
        return 'Study in the Caribbean';
      case 'us':
        return 'Study in the United States';
      case 'uk':
        return 'Study in the United Kingdom';
      case 'canada':
        return 'Study in Canada';
      case 'undergraduate':
        return 'Undergraduate Programs';
      case 'masters':
        return 'Master\'s Programs';
      case 'phd':
        return 'PhD Programs';
      default:
        return 'Study Abroad';
    }
  };

  const getLocationDescription = () => {
    switch (location) {
      case 'caribbean':
        return 'Discover world-class education opportunities in the Caribbean. From medical schools to business programs, the Caribbean offers quality education with unique cultural experiences.';
      case 'us':
        return 'The United States hosts some of the world\'s top universities and offers diverse programs across all fields of study. Experience American campus life and build a global network.';
      case 'uk':
        return 'The United Kingdom has a long tradition of academic excellence. With internationally recognized qualifications, studying in the UK can enhance your career prospects worldwide.';
      case 'canada':
        return 'Canada offers a safe, multicultural environment with affordable, high-quality education. Canadian degrees are recognized worldwide, and work opportunities are available for students.';
      case 'undergraduate':
        return 'Begin your academic journey with undergraduate programs that provide a solid foundation for your career. Choose from a wide range of disciplines and institutions worldwide.';
      case 'masters':
        return 'Advance your expertise with a master\'s degree that can help you specialize in your field or pivot to a new career path. Explore programs designed for working professionals and recent graduates.';
      case 'phd':
        return 'Contribute to your field through rigorous research and advanced study. PhD programs develop independent research skills and expertise to become a leader in your discipline.';
      default:
        return 'Explore study opportunities around the world. Our comprehensive database helps you find the perfect program tailored to your academic and career goals.';
    }
  };

  // Location-specific featured programs
  const getFeaturedPrograms = () => {
    switch (location) {
      case 'caribbean':
        return [
          { title: 'Medical Sciences', institution: 'University of the West Indies', location: 'Jamaica' },
          { title: 'Marine Biology', institution: 'University of Trinidad and Tobago', location: 'Trinidad & Tobago' },
          { title: 'Hospitality Management', institution: 'University of Technology', location: 'Jamaica' },
        ];
      case 'us':
        return [
          { title: 'Computer Science', institution: 'Stanford University', location: 'California' },
          { title: 'Business Administration', institution: 'Harvard University', location: 'Massachusetts' },
          { title: 'Engineering', institution: 'MIT', location: 'Massachusetts' },
        ];
      case 'uk':
        return [
          { title: 'Law', institution: 'University of Oxford', location: 'Oxford' },
          { title: 'Economics', institution: 'London School of Economics', location: 'London' },
          { title: 'International Relations', institution: 'King\'s College London', location: 'London' },
        ];
      case 'canada':
        return [
          { title: 'Environmental Science', institution: 'University of British Columbia', location: 'Vancouver' },
          { title: 'Finance', institution: 'University of Toronto', location: 'Toronto' },
          { title: 'Computer Engineering', institution: 'McGill University', location: 'Montreal' },
        ];
      case 'undergraduate':
        return [
          { title: 'Psychology', institution: 'University of Manchester', location: 'UK' },
          { title: 'Business', institution: 'University of Melbourne', location: 'Australia' },
          { title: 'Biology', institution: 'University of Auckland', location: 'New Zealand' },
        ];
      case 'masters':
        return [
          { title: 'Data Science', institution: 'University of Amsterdam', location: 'Netherlands' },
          { title: 'International Business', institution: 'HEC Paris', location: 'France' },
          { title: 'Public Health', institution: 'Karolinska Institute', location: 'Sweden' },
        ];
      case 'phd':
        return [
          { title: 'Artificial Intelligence', institution: 'ETH Zurich', location: 'Switzerland' },
          { title: 'Cancer Research', institution: 'University of Tokyo', location: 'Japan' },
          { title: 'Sustainable Development', institution: 'Technical University of Denmark', location: 'Denmark' },
        ];
      default:
        return [
          { title: 'International Business', institution: 'INSEAD', location: 'France' },
          { title: 'Medicine', institution: 'Heidelberg University', location: 'Germany' },
          { title: 'Architecture', institution: 'Delft University of Technology', location: 'Netherlands' },
        ];
    }
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full pt-24 pb-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 modern-heading">{getLocationTitle()}</h1>
          <p className="text-lg text-gray-700 max-w-3xl mb-8">{getLocationDescription()}</p>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Explore Programs
          </Button>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getFeaturedPrograms().map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{program.title}</h3>
                  <p className="text-gray-600 mb-1">{program.institution}</p>
                  <p className="text-gray-500 text-sm mb-4">{program.location}</p>
                  <Button variant="outline" className="w-full">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Search Programs", description: "Browse our database to find programs that match your interests and qualifications." },
              { step: 2, title: "Prepare Documents", description: "Gather transcripts, test scores, personal statements, and recommendation letters." },
              { step: 3, title: "Submit Applications", description: "Complete and submit applications through our platform to multiple institutions." },
              { step: 4, title: "Track Progress", description: "Monitor application status and receive notifications about deadlines and requirements." }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mb-4 text-blue-600 font-bold border-2 border-blue-600">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Information */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Visa Information</h2>
          <div className="bg-blue-50 p-8 rounded-lg">
            <p className="text-gray-700 mb-4">
              Studying abroad requires a student visa for most countries. Our experts can guide you through the visa application process for your chosen destination.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              Get Visa Guidance
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our counselors can help you navigate the application process and find the perfect program for your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Schedule Consultation
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Browse All Programs
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}