import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Wishlist = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
      
      <Card className="bg-white shadow-sm">
        <CardContent className="p-12 text-center text-gray-500">
          <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-medium text-gray-700 mb-2">Your Wishlist is Empty</h2>
          <p className="max-w-md mx-auto">
            Save programs and institutions you're interested in to your wishlist for easy access later.
            Use the search feature to discover programs and add them to your wishlist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wishlist;
