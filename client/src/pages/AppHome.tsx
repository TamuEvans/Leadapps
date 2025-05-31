import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, User, Heart, School, BookOpen, Headphones,
  BookOpenText, CalendarDays, Clock, ExternalLink, 
  GraduationCap, Sparkles, Brain, DollarSign, Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ProgramRecommendations from '@/components/ProgramRecommendations';
import conestogaImg from '@assets/Conestoga.jpg';
import uwiImg from '@assets/UWI.webp';
import sguImg from '@assets/SGU-campus-web-845-x-500.jpg';

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
      title: "Get Expert Guidance", 
      description: "Book a session with our education counselors", 
      icon: <Headphones className="h-5 w-5" />,
      link: "/app/counselling",
      cta: "Book Session"
    },
  ];

  // Featured programs
  const featuredPrograms = [
    { program: 'Computer Science', university: 'Conestoga College' },
    { program: 'Business Administration', university: 'University of the West Indies' },
    { program: 'Medicine', university: 'St. George\'s University' },
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
        <section className="bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-3 flex items-center gap-2">
              🎉 {user && user.firstName 
                ? `Welcome ${user.firstName} to your Leadapps`
                : 'Welcome to your Leadapps'}
            </h1>
            <p className="opacity-95 mb-6 text-lg leading-relaxed">
              Your journey to international education starts here. Complete your profile to get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 backdrop-blur-sm rounded-2xl h-12 px-6" asChild>
                <Link to="/app/profile">✨ Complete Profile</Link>
              </Button>
              <Button className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-2xl h-12 px-6 shadow-lg" asChild>
                <Link to="/app/search">🔍 Explore Programs</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* AI Program Recommendations */}
        <section>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI-Powered Program Recommendations</h2>
            <div className="ml-3 flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 px-3 py-2 rounded-2xl text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Powered
            </div>
          </div>
          <ProgramRecommendations />
        </section>

        {/* Quick Links Section */}
        <section>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const gradients = [
                'from-purple-500 to-pink-500',
                'from-blue-500 to-cyan-500', 
                'from-green-500 to-emerald-500',
                'from-orange-500 to-red-500',
                'from-indigo-500 to-purple-500',
                'from-teal-500 to-blue-500'
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <Card key={index} className="hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-3xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center">
                      <div className={`mr-3 bg-gradient-to-r ${gradient} p-3 rounded-2xl text-white shadow-lg`}>
                        {link.icon}
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800">{link.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1">
                    <CardDescription className="text-gray-600 leading-relaxed">{link.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button className={`w-full bg-gradient-to-r ${gradient} hover:shadow-lg rounded-2xl h-11 font-medium text-white`} asChild>
                      <Link to={link.link}>{link.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Featured Programs */}
        <section>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">Featured Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPrograms.map((program, index) => {
              const programGradients = [
                'from-purple-400 to-pink-400',
                'from-blue-400 to-cyan-400',
                'from-green-400 to-emerald-400'
              ];
              const gradient = programGradients[index % programGradients.length];
              
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-3xl border-0 bg-white/90 backdrop-blur-sm">
                  <div className="h-40 relative overflow-hidden">
                    {program.university === 'Conestoga College' && (
                      <img 
                        src={conestogaImg} 
                        alt="Conestoga College campus"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {program.university === 'University of the West Indies' && (
                      <img 
                        src={uwiImg} 
                        alt="University of the West Indies campus"
                        className="w-full h-full object-cover object-top"
                      />
                    )}
                    {program.university === 'St. George\'s University' && (
                      <img 
                        src={sguImg} 
                        alt="St. Georges University campus"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <CardHeader className="pb-3 text-center">
                    <CardTitle className="text-lg font-bold text-gray-800">{program.program}</CardTitle>
                    <CardDescription className="text-gray-600 font-medium">{program.university}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className={`w-full bg-gradient-to-r ${gradient} hover:shadow-lg rounded-2xl h-11 font-medium text-white`} asChild>
                      <Link to={`/app/search?q=${program.program}`}>View Program</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Application Deadlines */}
        <section>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-6">Upcoming Deadlines</h2>
          <Card className="rounded-3xl border-0 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-2xl mr-4">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Fall 2025 Applications</h3>
                      <p className="text-sm text-gray-600">Most universities in US & Canada</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">30 days left</span>
                    <p className="text-xs text-gray-500">December 15, 2025</p>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-2xl mr-4">
                      <CalendarDays className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">UK Universities (Undergraduate)</h3>
                      <p className="text-sm text-gray-600">UCAS Application Deadline</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">60 days left</span>
                    <p className="text-xs text-gray-500">January 15, 2025</p>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-2xl mr-4">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Spring 2025 Applications</h3>
                      <p className="text-sm text-gray-600">Australian Universities</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">90 days left</span>
                    <p className="text-xs text-gray-500">February 15, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end p-6">
              <Button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl px-6" asChild>
                <Link to="/app/applications">View All Deadlines</Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Support Hubs Section */}
        <section className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Support Hubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personality Hub */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl text-white shadow-lg">
                      <Brain className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800">Personality Hub</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    Discover your strengths, interests, and ideal career paths with our personality assessment tools.
                  </p>
                  <div className="flex items-center text-xs mb-2">
                    <span className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Personality Assessment
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl h-11 font-medium shadow-lg" asChild>
                    <Link to="/app/personality-hub">Explore Hub</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Exam Prep Hub */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl text-white shadow-lg">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800">Exam Prep Hub</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    Access resources and preparation materials for standardized tests like CSEC, CAPE, BGCSE, SAT, and more.
                  </p>
                  <div className="flex items-center text-xs mb-2">
                    <span className="flex items-center bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Practice Tests & Guides
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl h-11 font-medium shadow-lg" asChild>
                    <Link to="/app/exam-prep-hub">Explore Hub</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Funding Hub */}
              <Card className="bg-white/80 backdrop-blur-sm rounded-3xl border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2"></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="mr-3 bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl text-white shadow-lg">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800">Funding Hub</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    Find scholarships, grants, and financial aid opportunities to fund your international education dreams.
                  </p>
                  <div className="flex items-center text-xs mb-2">
                    <span className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Scholarships & Grants
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl h-11 font-medium shadow-lg" asChild>
                    <Link to="/app/funding-hub">Explore Hub</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Suggested Articles */}
        <section>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-6">Suggested Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedArticles.map((article, index) => {
              const articleGradients = [
                'from-teal-400 to-blue-400',
                'from-green-400 to-teal-400',
                'from-blue-400 to-indigo-400',
                'from-purple-400 to-blue-400'
              ];
              const gradient = articleGradients[index % articleGradients.length];
              
              return (
                <Card key={index} className="overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-xl border border-gray-200 bg-white">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">{article.title}</CardTitle>
                      <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${gradient} text-white font-medium whitespace-nowrap ml-2`}>
                        {article.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">{article.summary}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>{article.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className={`w-full bg-gradient-to-r ${gradient} hover:shadow-lg rounded-2xl h-11 font-medium text-white`}>
                      <div className="flex items-center justify-center">
                        <BookOpenText className="h-4 w-4 mr-2" />
                        Read Article
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </div>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Button className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-2xl px-8 h-12 font-medium shadow-lg">
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