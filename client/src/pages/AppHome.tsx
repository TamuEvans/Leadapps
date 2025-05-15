import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, User, Heart, School, BookOpen, Headphones,
  BookOpenText, CalendarDays, Clock, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AppHome() {
  const { user } = useAuth();
  // Quick links
  const quickLinks = [
    { 
      title: "Complete Your Profile", 
      description: "Update your educational background, test scores, and preferences", 
      icon: <User className="h-5 w-5" />,
      link: "/app/profile",
      cta: "Update Profile"
    },
    { 
      title: "Search Programs", 
      description: "Explore programs across top universities globally", 
      icon: <Search className="h-5 w-5" />,
      link: "/app/search",
      cta: "Search Now"
    },
    { 
      title: "View Your Wishlist", 
      description: "Review universities and programs you've saved", 
      icon: <Heart className="h-5 w-5" />,
      link: "/app/wishlist",
      cta: "View Wishlist"
    },
    { 
      title: "Manage Applications", 
      description: "Track your ongoing applications and tasks", 
      icon: <School className="h-5 w-5" />,
      link: "/app/applications",
      cta: "View Applications"
    },
    { 
      title: "Take Personality Quiz", 
      description: "Discover programs that match your interests and skills", 
      icon: <BookOpen className="h-5 w-5" />,
      link: "/app/personality-hub",
      cta: "Start Quiz"
    },
    { 
      title: "Book Counselling", 
      description: "Schedule a session with our education experts", 
      icon: <Headphones className="h-5 w-5" />,
      link: "/app/counselling",
      cta: "Book Now"
    }
  ];

  // Featured programs
  const featuredPrograms = [
    {
      university: "University of Toronto",
      program: "Computer Science",
      image: "/images/programs/toronto-cs.jpg"
    },
    {
      university: "London School of Economics",
      program: "Economics & Finance",
      image: "/images/programs/lse-econ.jpg"
    },
    {
      university: "University of Melbourne",
      program: "Business Administration",
      image: "/images/programs/melbourne-business.jpg"
    }
  ];
  
  // Suggested articles
  const suggestedArticles = [
    {
      title: "How to Secure Scholarships for International Students",
      summary: "Learn about the top scholarship opportunities for Caribbean students and how to successfully apply.",
      category: "Scholarships",
      readTime: "5 min read",
      date: "May 10, 2025"
    },
    {
      title: "Choosing the Right University: Key Factors to Consider",
      summary: "Discover the most important factors to consider when selecting a university abroad.",
      category: "University Selection",
      readTime: "7 min read",
      date: "May 8, 2025"
    },
    {
      title: "Navigating Student Visa Applications: A Complete Guide",
      summary: "A step-by-step guide to securing your student visa for studying in the US, UK, Canada, or Caribbean.",
      category: "Visa Information",
      readTime: "8 min read",
      date: "May 5, 2025"
    },
    {
      title: "Top Career Paths for Business Graduates in 2025",
      summary: "Explore the most promising career trajectories for business graduates in today's global economy.",
      category: "Career Insights",
      readTime: "6 min read",
      date: "May 1, 2025"
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex flex-col space-y-6">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">
            {user && user.firstName 
              ? `Welcome ${user.firstName} to your Leadapps`
              : 'Welcome to your Leadapps'}
          </h1>
          <p className="opacity-90 mb-4">
            Your journey to international education starts here. Complete your profile to get personalized recommendations.
          </p>
          <div className="flex space-x-4">
            <Button variant="secondary" asChild>
              <Link to="/app/profile">Complete Profile</Link>
            </Button>
            <Button variant="outline" className="bg-transparent hover:bg-white/10 text-white border-white" asChild>
              <Link to="/app/search">Explore Programs</Link>
            </Button>
          </div>
        </section>

        {/* Quick Links Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className="mr-2 bg-primary/10 p-2 rounded-full">
                      {link.icon}
                    </div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={link.link}>{link.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Programs */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Featured Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredPrograms.map((program, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="h-40 bg-gray-200">
                  {/* Replace with actual image later */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
                    <School className="h-10 w-10 text-gray-400" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">{program.program}</CardTitle>
                  <CardDescription>{program.university}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to={`/app/search?q=${program.program}`}>View Program</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Deadlines */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Fall 2025 Applications</h3>
                    <p className="text-sm text-gray-500">Most universities in US & Canada</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-amber-600">30 days left</span>
                    <p className="text-xs text-gray-500">December 15, 2025</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">UK Universities (Undergraduate)</h3>
                    <p className="text-sm text-gray-500">UCAS Application Deadline</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-amber-600">60 days left</span>
                    <p className="text-xs text-gray-500">January 15, 2025</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Spring 2025 Applications</h3>
                    <p className="text-sm text-gray-500">Australian Universities</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-emerald-600">90 days left</span>
                    <p className="text-xs text-gray-500">February 15, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/applications">View All Deadlines</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Suggested Articles */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Suggested Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedArticles.map((article, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {article.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{article.summary}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <div className="flex items-center justify-center">
                      <BookOpenText className="h-4 w-4 mr-2" />
                      Read Article
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button variant="ghost" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              View All Articles
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AppHome;