import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowRight } from "lucide-react";

const Articles = () => {
  const articles = [
    {
      title: "How to Write a Compelling Personal Statement",
      description: "Learn the key elements of a standout personal statement that will impress admissions committees.",
      category: "Application Tips",
      date: "May 15, 2025"
    },
    {
      title: "Scholarship Opportunities for Caribbean Students",
      description: "Discover scholarships specifically available for students from Caribbean nations pursuing higher education.",
      category: "Scholarships",
      date: "April 28, 2025"
    },
    {
      title: "Choosing the Right Program: Factors to Consider",
      description: "Important factors to consider when selecting an educational program that aligns with your goals.",
      category: "Program Selection",
      date: "April 10, 2025"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-20 blur-xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">📚 Educational Resources</h1>
          <p className="text-xl text-white/90">Stay informed with the latest insights and tips for your academic journey</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <Card key={index} className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <div className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full w-fit font-medium mb-3">{article.category}</div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">{article.title}</CardTitle>
              <CardDescription className="text-gray-500 text-sm mt-2">{article.date}</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <p className="text-gray-600 leading-relaxed">{article.description}</p>
            </CardContent>
            <CardFooter className="px-6 pb-6">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-full px-6">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-primary" />
            Featured Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition cursor-pointer">
              <div>
                <h3 className="text-sm font-medium">2025 University Application Guide</h3>
                <p className="text-xs text-gray-500">PDF Guide</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Download
              </Button>
            </li>
            <li className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition cursor-pointer">
              <div>
                <h3 className="text-sm font-medium">Visa Application Process</h3>
                <p className="text-xs text-gray-500">Video Tutorial</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Watch
              </Button>
            </li>
            <li className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50 transition cursor-pointer">
              <div>
                <h3 className="text-sm font-medium">Financial Aid Options Comparison</h3>
                <p className="text-xs text-gray-500">Interactive Tool</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                Explore
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Articles;
