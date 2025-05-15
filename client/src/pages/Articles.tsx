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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Educational Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Card key={index} className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <div className="text-xs text-primary font-medium mb-1">{article.category}</div>
              <CardTitle className="text-lg font-semibold">{article.title}</CardTitle>
              <CardDescription className="text-gray-500 text-xs">{article.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">{article.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-primary p-0 hover:bg-transparent hover:text-primary/80">
                Read More <ArrowRight className="ml-1 h-4 w-4" />
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
