import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, FileText, Lightbulb, Clock } from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';

export default function InfoCentre() {
  const [searchTerm, setSearchTerm] = useState("");

  // Resource categories
  const resourceCategories = [
    "All",
    "Application Guides",
    "Visa Information",
    "Destination Guides",
    "Student Stories",
    "Scholarship Resources"
  ];

  // Resources
  const resources = [
    {
      title: "Complete Guide to UK University Applications",
      category: "Application Guides",
      description: "Learn how to navigate the UK's UCAS system, prepare personal statements, and meet deadlines for top university admission.",
      image: "https://source.unsplash.com/random/300x200/?uk,university",
      readTime: "12 min read",
      date: "May 02, 2025"
    },
    {
      title: "US Student Visa Guide: F-1 vs. J-1",
      category: "Visa Information",
      description: "Understand the differences between F-1 and J-1 visas, eligibility requirements, and application processes for studying in the United States.",
      image: "https://source.unsplash.com/random/300x200/?visa,passport",
      readTime: "9 min read",
      date: "April 25, 2025"
    },
    {
      title: "Student Life in Toronto: A Comprehensive Guide",
      category: "Destination Guides",
      description: "Everything you need to know about living in Toronto as an international student, from housing to transportation to cultural experiences.",
      image: "https://source.unsplash.com/random/300x200/?toronto,canada",
      readTime: "15 min read",
      date: "April 18, 2025"
    },
    {
      title: "From Jamaica to Oxford: My Academic Journey",
      category: "Student Stories",
      description: "Michelle shares her experience moving from Kingston to Oxford University, including challenges faced and advice for fellow Caribbean students.",
      image: "https://source.unsplash.com/random/300x200/?oxford,university",
      readTime: "8 min read",
      date: "April 10, 2025"
    },
    {
      title: "Top Scholarships for International Students 2025",
      category: "Scholarship Resources",
      description: "A comprehensive list of scholarships available to international students, including eligibility criteria and application deadlines.",
      image: "https://source.unsplash.com/random/300x200/?scholarship,award",
      readTime: "14 min read",
      date: "April 05, 2025"
    },
    {
      title: "How to Write a Winning Statement of Purpose",
      category: "Application Guides",
      description: "Expert tips on crafting a compelling statement of purpose that showcases your qualifications and passion to admissions committees.",
      image: "https://source.unsplash.com/random/300x200/?writing,document",
      readTime: "11 min read",
      date: "March 28, 2025"
    },
    {
      title: "Canadian Student Visa: Step-by-Step Guide",
      category: "Visa Information",
      description: "Navigate the Canadian study permit application process with this comprehensive guide covering requirements, documentation, and timelines.",
      image: "https://source.unsplash.com/random/300x200/?canada,flag",
      readTime: "10 min read",
      date: "March 22, 2025"
    },
    {
      title: "Living in London on a Student Budget",
      category: "Destination Guides",
      description: "Practical advice for managing finances while studying in London, including affordable housing options, transportation, and entertainment.",
      image: "https://source.unsplash.com/random/300x200/?london,city",
      readTime: "13 min read",
      date: "March 15, 2025"
    },
    {
      title: "Engineering in Germany: My Experience as a Nigerian Student",
      category: "Student Stories",
      description: "Oluwaseun shares his journey studying mechanical engineering in Germany, including language learning, cultural adaptation, and career opportunities.",
      image: "https://source.unsplash.com/random/300x200/?germany,engineering",
      readTime: "9 min read",
      date: "March 08, 2025"
    },
    {
      title: "Fulbright Scholarship: Application Tips and Strategies",
      category: "Scholarship Resources",
      description: "Increase your chances of securing a prestigious Fulbright Scholarship with expert advice from previous recipients and selection committee members.",
      image: "https://source.unsplash.com/random/300x200/?scholarship,certificate",
      readTime: "16 min read",
      date: "March 01, 2025"
    },
  ];

  // Filter resources based on active tab and search term
  const filterResources = (category, searchTerm) => {
    return resources.filter(resource => 
      (category === "All" || resource.category === category) && 
      (searchTerm === "" || 
       resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full pt-24 pb-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 modern-heading">Information Centre</h1>
          <p className="text-lg text-gray-700 max-w-3xl mb-8">
            Access our comprehensive collection of resources to guide you through every step of your international education journey.
          </p>
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search for guides, articles, and resources..." 
                className="pl-10 pr-4 py-6 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.slice(0, 3).map((resource, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">{resource.category}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> {resource.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <Button variant="outline" className="w-full">Read Article</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="w-full flex overflow-x-auto pb-2 mb-6 space-x-2 justify-start">
              {resourceCategories.map((category, index) => (
                <TabsTrigger key={index} value={category} className="px-4 py-2 whitespace-nowrap">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {resourceCategories.map((category, index) => (
              <TabsContent key={index} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filterResources(category, searchTerm).map((resource, resIndex) => (
                    <Card key={resIndex} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 overflow-hidden">
                        <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">{resource.category}</span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> {resource.readTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                        <Button variant="outline" className="w-full">Read Article</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Resource Types */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Essential Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-blue-600" />,
                title: "Country Guides",
                description: "Comprehensive guides to studying in popular destinations including visa requirements, costs, and cultural insights."
              },
              {
                icon: <FileText className="h-8 w-8 text-blue-600" />,
                title: "Application Checklists",
                description: "Step-by-step checklists for university applications, ensuring you complete all required documents on time."
              },
              {
                icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
                title: "Student Success Tips",
                description: "Advice from successful international students on adapting to a new academic environment and thriving."
              },
              {
                icon: <Search className="h-8 w-8 text-blue-600" />,
                title: "Scholarship Database",
                description: "Searchable database of scholarships and financial aid options for international students."
              },
            ].map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-blue-50 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                    {resource.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    Explore Resources →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Informed</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest resources, application deadlines, and scholarship opportunities.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-white text-blue-600 hover:bg-white/90 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-sm mt-3 text-white/70">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}