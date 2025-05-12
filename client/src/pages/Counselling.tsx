import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Video } from "lucide-react";

const Counselling = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Counselling Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-semibold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-primary" />
              Chat Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Connect with an education counselor via text chat to get quick answers to your questions.
            </p>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-semibold flex items-center">
              <Video className="h-5 w-5 mr-2 text-primary" />
              Video Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Schedule a face-to-face video session with an education advisor for in-depth guidance.
            </p>
            <Button className="w-full">Book Session</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Application Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Get expert feedback on your application materials before submitting to institutions.
            </p>
            <Button className="w-full">Request Review</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h2 className="text-lg font-medium text-gray-700 mb-2">No Upcoming Sessions</h2>
          <p className="max-w-md mx-auto">
            You haven't scheduled any counselling sessions yet. Book a session to get personalized guidance for your educational journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Counselling;
