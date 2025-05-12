import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Applications = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
      
      <Card className="bg-white shadow-sm">
        <CardContent className="p-12 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-medium text-gray-700 mb-2">No Applications Yet</h2>
          <p className="max-w-md mx-auto">
            You haven't submitted any applications yet. Complete your profile and search for programs to begin your application process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Applications;
