import React from 'react';
import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import MarketingLayout from '@/layouts/MarketingLayout';
import { CheckCircle2, Calendar, Clock, Award } from 'lucide-react';

export default function ServicePage() {
  // Get the current service from the URL
  const [, params] = useRoute('/services/:service');
  const service = params?.service;

  // Service content based on type
  const getServiceTitle = () => {
    switch (service) {
      case 'application-assistance':
        return 'Application Assistance';
      case 'visa-guidance':
        return 'Visa Guidance';
      case 'accommodation':
        return 'Accommodation Services';
      case 'test-preparation':
        return 'Test Preparation';
      default:
        return 'Our Services';
    }
  };

  const getServiceDescription = () => {
    switch (service) {
      case 'application-assistance':
        return 'Our comprehensive application assistance helps you navigate the complex process of applying to international universities. From choosing the right programs to submitting polished applications, our experts guide you every step of the way.';
      case 'visa-guidance':
        return 'Securing a student visa can be challenging. Our visa guidance service provides detailed information about requirements, document preparation, and interview coaching to maximize your chances of approval.';
      case 'accommodation':
        return 'Finding suitable accommodation in a new country can be daunting. We help you explore on-campus housing, private rentals, and student residences to find the perfect place that meets your needs and budget.';
      case 'test-preparation':
        return 'Achieve your target scores with our specialized test preparation services. We offer comprehensive courses and resources for IELTS, TOEFL, SAT, GRE, GMAT, and other standardized tests required for international admissions.';
      default:
        return 'We offer a range of services designed to support your educational journey from application to arrival. Explore our specialized services tailored to meet your needs as an international student.';
    }
  };

  // Service-specific benefits
  const getServiceBenefits = () => {
    switch (service) {
      case 'application-assistance':
        return [
          'Personalized program selection based on your profile and goals',
          'Essay and personal statement review and feedback',
          'Document preparation and submission assistance',
          'Application fee waiver guidance where applicable',
          'Direct communication with admission offices',
        ];
      case 'visa-guidance':
        return [
          'Country-specific visa requirement guidance',
          'Documentation checklist and preparation',
          'Visa application form review',
          'Mock visa interview preparation',
          'Financial documentation assistance',
        ];
      case 'accommodation':
        return [
          'Comprehensive housing options assessment',
          'Virtual tours of available accommodations',
          'Contract review and negotiation assistance',
          'Roommate matching services',
          'Guidance on neighborhoods and transportation',
        ];
      case 'test-preparation':
        return [
          'Diagnostic assessment to identify strengths and weaknesses',
          'Customized study plans based on your target score',
          'Practice tests with detailed feedback',
          'One-on-one tutoring with expert instructors',
          'Proven strategies for each test section',
        ];
      default:
        return [
          'Personalized guidance from experienced counselors',
          'Comprehensive support throughout your educational journey',
          'Access to exclusive resources and partnerships',
          'Regular progress tracking and updates',
          'Post-admission support services',
        ];
    }
  };

  // Service packages
  const getServicePackages = () => {
    switch (service) {
      case 'application-assistance':
        return [
          { 
            name: 'Basic',
            price: '$199',
            features: [
              'Application to 3 institutions',
              'Essay review (one round)',
              'Document checklist',
              'Email support',
            ]
          },
          { 
            name: 'Premium',
            price: '$399',
            features: [
              'Application to 5 institutions',
              'Essay review (unlimited rounds)',
              'Document preparation assistance',
              'Priority email and phone support',
              'Application fee credits ($100)',
            ]
          },
          { 
            name: 'Elite',
            price: '$699',
            features: [
              'Application to 8 institutions',
              'Essay writing assistance',
              'Complete document management',
              '24/7 dedicated counselor',
              'Application fee credits ($200)',
              'Scholarship application assistance',
            ]
          },
        ];
      case 'visa-guidance':
        return [
          { 
            name: 'Essential',
            price: '$149',
            features: [
              'Visa requirement guide',
              'Document checklist',
              'Basic application review',
              'Email support',
            ]
          },
          { 
            name: 'Advanced',
            price: '$299',
            features: [
              'Comprehensive documentation help',
              'Application form completion',
              'One mock interview session',
              'Priority email and phone support',
            ]
          },
          { 
            name: 'Comprehensive',
            price: '$499',
            features: [
              'End-to-end application management',
              'Document translation services',
              'Three mock interview sessions',
              'Dedicated visa counselor',
              'Appeal assistance if needed',
            ]
          },
        ];
      case 'accommodation':
        return [
          { 
            name: 'Basic Search',
            price: '$99',
            features: [
              'Housing options report',
              'Budget assessment',
              'Safety guidelines',
              'Email support',
            ]
          },
          { 
            name: 'Guided Search',
            price: '$249',
            features: [
              'Personalized housing recommendations',
              'Virtual property tours',
              'Lease review',
              'Priority email and phone support',
            ]
          },
          { 
            name: 'Full Service',
            price: '$499',
            features: [
              'All Guided Search features',
              'Property reservation assistance',
              'Utility setup guidance',
              'Roommate matching',
              'Arrival coordination',
            ]
          },
        ];
      case 'test-preparation':
        return [
          { 
            name: 'Self-Study',
            price: '$149',
            features: [
              'Study materials access',
              'Practice tests (3)',
              'Basic score analysis',
              'Forum access',
            ]
          },
          { 
            name: 'Guided Study',
            price: '$349',
            features: [
              'All Self-Study materials',
              'Personalized study plan',
              'Weekly group classes (8 sessions)',
              'Practice tests (10)',
              'Email support',
            ]
          },
          { 
            name: 'Intensive Prep',
            price: '$699',
            features: [
              'All Guided Study features',
              'One-on-one tutoring (10 hours)',
              'Unlimited practice tests',
              'Score improvement guarantee',
              '24/7 tutor access',
            ]
          },
        ];
      default:
        return [
          { 
            name: 'Basic',
            price: '$199',
            features: [
              'Initial consultation',
              'Basic guidance',
              'Email support',
              'Resource access',
            ]
          },
          { 
            name: 'Standard',
            price: '$399',
            features: [
              'Comprehensive consultation',
              'Personalized planning',
              'Priority support',
              'Regular progress reviews',
              'Extended resource access',
            ]
          },
          { 
            name: 'Premium',
            price: '$699',
            features: [
              'All Standard features',
              'Dedicated counselor',
              '24/7 support access',
              'End-to-end assistance',
              'Post-service follow-up',
              'Premium resources',
            ]
          },
        ];
    }
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full pt-24 pb-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 modern-heading">{getServiceTitle()}</h1>
          <p className="text-lg text-gray-700 max-w-3xl mb-8">{getServiceDescription()}</p>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Book a Consultation
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">How We Help You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              {getServiceBenefits().map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Why Choose Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Years of Experience</p>
                    <p className="text-gray-600 text-sm">Our team has helped thousands of students achieve their educational goals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Timely Support</p>
                    <p className="text-gray-600 text-sm">We're available when you need us, with quick response times to your questions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Proven Results</p>
                    <p className="text-gray-600 text-sm">Our success rate speaks for itself, with high acceptance rates for our clients.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The application assistance service saved me so much time and stress. My counselor helped me highlight my strengths and apply to universities I hadn't even considered.",
                name: "Keisha M.",
                location: "Jamaica",
                university: "University of Toronto"
              },
              {
                quote: "I was overwhelmed by the visa process until I used Leadapps' visa guidance service. Everything was explained clearly, and I got my visa approved on the first try!",
                name: "Marcus T.",
                location: "Barbados",
                university: "University of Manchester"
              },
              {
                quote: "The test preparation service was comprehensive and the strategies they taught me were invaluable. I improved my IELTS score by 1.5 points!",
                name: "Aaliyah R.",
                location: "Trinidad & Tobago",
                university: "University of Melbourne"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <p className="italic text-gray-700 mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location} • {testimonial.university}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team is ready to help you achieve your educational goals. Schedule a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Book a Consultation
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}