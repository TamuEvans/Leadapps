import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Search Programs</h1>
      
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">Find the perfect educational program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search programs, schools, courses..."
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Caribbean</Button>
              <Button variant="outline" size="sm">Bachelor's</Button>
              <Button variant="outline" size="sm">Computer Science</Button>
              <Button variant="outline" size="sm">Fall 2023</Button>
              <Button variant="outline" size="sm">Scholarships</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="p-12 text-center text-gray-500">
        <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h2 className="text-lg font-medium text-gray-700 mb-2">Search for Programs</h2>
        <p className="max-w-md mx-auto">
          Use the search box above to find educational programs that match your interests and qualifications.
        </p>
      </div>
    </div>
  );
};

export default Search;
