import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Heart, 
  DollarSign, 
  MapPin, 
  Clock, 
  GraduationCap,
  Building,
  FormInput,
  X,
  Share2,
  Copy,
  Mail,
  MessageSquare
} from "lucide-react";
import { Link } from "wouter";

// Import university logos
import uwiLogo from "@assets/UWI_crest_and_word_300px_185577544cf12bf3bfc1910be478ef69.png";
import uccLogo from "@assets/NEW_UCC_logo.jpg";
import utechLogo from "@assets/utech_web.jpg";
import sguLogo from "@assets/sgu-logo-grenada-horizontal-color_orig.jpg";
import usfLogo from "@assets/usf-logo_orig.png";

// Sample programme data (same as Search.tsx)
const mockResults = [
  {
    id: 1,
    programName: "MSc Business Analytics",
    institution: "University of the West Indies, Cave Hill Campus",
    location: "Bridgetown, Barbados",
    level: "Master's",
    duration: "1 Year Full-time",
    mode: "On-Campus",
    tuition: "Approx. $15,000 USD/year",
    applicationFee: "$50 USD",
    description: "This programme provides students with advanced analytical skills and knowledge to address complex business problems using data-driven approaches. Core modules include data mining, statistical analysis, and decision modeling.",
    logo: uwiLogo
  },
  {
    id: 2,
    programName: "Associate Degree in Computer Science",
    institution: "University of the Commonwealth Caribbean",
    location: "Kingston, Jamaica",
    level: "Associate's",
    duration: "2 Years",
    mode: "Full-time/Part-time",
    tuition: "Approx. $3,000 USD/year (Local)",
    applicationFee: "$30 USD",
    description: "Learn foundational skills in programming, databases, web development, and computer systems. This programme prepares students for entry-level IT positions or transfer to bachelor's degree programmes.",
    logo: uccLogo
  },
  {
    id: 3,
    programName: "Bachelor of Science in Civil Engineering",
    institution: "University of Technology, Jamaica",
    location: "Kingston, Jamaica",
    level: "Bachelor's",
    duration: "4 Years",
    mode: "Full-time",
    tuition: "Approx. $5,000 USD/year",
    applicationFee: "$40 USD",
    description: "This programme covers structural engineering, transportation systems, environmental engineering, and construction management. Accredited by the Jamaica Institution of Engineers.",
    logo: utechLogo
  },
  {
    id: 4,
    programName: "Doctor of Medicine (MD)",
    institution: "St. George's University",
    location: "St. George's, Grenada",
    level: "Doctorate",
    duration: "4 Years",
    mode: "On-Campus",
    tuition: "Approx. $65,000 USD/year",
    applicationFee: "$250 USD",
    description: "The Doctor of Medicine programme at SGU provides a comprehensive medical education with clinical training opportunities in the US, UK, and Caribbean. SGU graduates practice in more than 50 countries around the world.",
    logo: sguLogo
  },
  {
    id: 5,
    programName: "Master of Science in Cybersecurity",
    institution: "University of South Florida",
    location: "Tampa, Florida, USA",
    level: "Master's",
    duration: "2 Years",
    mode: "Online/On-Campus",
    tuition: "Approx. $30,000 USD total",
    applicationFee: "$85 USD",
    description: "This programme prepares students to develop, implement and manage secure computer systems and defend networks from cybersecurity threats through advanced coursework in cryptography, secure software, penetration testing, and security governance.",
    logo: usfLogo
  }
];

const Wishlist = () => {
  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('programFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  // Toast state for copy notification
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  // Show toast notification
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);
  
  // Get favorite programs based on IDs
  const favoriteProgrammes = mockResults.filter(program => favorites.includes(program.id));
  
  // Remove from wishlist function
  const removeFromWishlist = (programId: number) => {
    const newFavorites = favorites.filter(id => id !== programId);
    setFavorites(newFavorites);
    localStorage.setItem('programFavorites', JSON.stringify(newFavorites));
  };
  
  // Share programme via different methods
  const shareProgramme = (program: any, method: string) => {
    // Generate a description for sharing
    const shareText = `Check out this programme: ${program.programName} at ${program.institution} in ${program.location}. Tuition: ${program.tuition}`;
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(shareText)
          .then(() => {
            // Show success message
            setCopySuccess('Copied to clipboard!');
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
            setCopySuccess('Failed to copy to clipboard!');
          });
        break;
      case 'email':
        const emailSubject = `Check out this programme: ${program.programName}`;
        const emailBody = encodeURIComponent(shareText);
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
        setCopySuccess('Email client opened!');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
        setCopySuccess('WhatsApp opened!');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText)}`);
        setCopySuccess('SMS opened!');
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
        <Link href="/app/search">
          <Button variant="outline" className="text-sm">
            Explore More Programmes
          </Button>
        </Link>
      </div>
      
      {favorites.length === 0 ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-12 text-center text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">Your Wishlist is Empty</h2>
            <p className="max-w-md mx-auto">
              Save programmes and institutions you're interested in to your wishlist for easy access later.
              Use the search feature to discover programmes and add them to your wishlist.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {favoriteProgrammes.map(program => (
            <Card key={program.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="flex-shrink-0 bg-white rounded-md p-3 border border-gray-100 shadow-sm hidden md:block">
                    <img src={program.logo} alt={program.institution} className="w-24 h-20 object-contain" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{program.programName}</h3>
                        <p className="text-gray-600 mb-2">{program.institution}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            <span>{program.location}</span>
                          </div>
                          <div className="flex items-center">
                            <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            <span>{program.level}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            <span>Mode: {program.mode}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWishlist(program.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <DollarSign className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span>Tuition: {program.tuition}</span>
                      </div>
                      <div className="flex items-center">
                        <FormInput className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span>Application Fee: {program.applicationFee}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">{program.description}</p>
                    
                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <Button variant="outline">View Details</Button>
                      <Button variant="default" className="bg-primary hover:bg-primary/90">Apply Now</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
