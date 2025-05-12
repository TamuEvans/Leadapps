import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Filter
} from 'lucide-react';
import MarketingLayout from '@/layouts/MarketingLayout';

export default function FairsEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("All Regions");

  // Event categories
  const eventCategories = [
    "All Events",
    "Education Fairs",
    "Webinars",
    "Open Days",
    "Workshops"
  ];

  // Region filters
  const regions = [
    "All Regions",
    "Caribbean",
    "North America",
    "Europe",
    "Asia",
    "Africa",
    "Online"
  ];

  // Events data
  const events = [
    {
      title: "Caribbean International Education Fair",
      category: "Education Fairs",
      description: "Meet representatives from over 50 universities across the US, UK, Canada, and Europe. Get information on programs, admissions, and scholarships.",
      image: "https://source.unsplash.com/random/300x200/?education,fair",
      date: "May 15-16, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "Kingston, Jamaica",
      region: "Caribbean",
      format: "In-person"
    },
    {
      title: "Study in the UK: Admissions Webinar",
      category: "Webinars",
      description: "Join admissions experts for insights on applying to UK universities, including UCAS application tips and scholarship opportunities.",
      image: "https://source.unsplash.com/random/300x200/?webinar,online",
      date: "May 22, 2025",
      time: "6:00 PM - 7:30 PM (EST)",
      location: "Virtual Event",
      region: "Online",
      format: "Online"
    },
    {
      title: "University of Toronto Open Day",
      category: "Open Days",
      description: "Experience campus life at UofT. Tour facilities, meet professors and current students, and learn about application requirements.",
      image: "https://source.unsplash.com/random/300x200/?toronto,university",
      date: "May 25, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "Toronto, Canada",
      region: "North America",
      format: "In-person"
    },
    {
      title: "Essay Writing Workshop for University Applications",
      category: "Workshops",
      description: "Learn effective techniques for writing compelling personal statements and essays that stand out to admissions committees.",
      image: "https://source.unsplash.com/random/300x200/?writing,workshop",
      date: "June 05, 2025",
      time: "2:00 PM - 4:30 PM",
      location: "Kingston, Jamaica",
      region: "Caribbean",
      format: "In-person"
    },
    {
      title: "Study in Canada: Immigration and Visa Workshop",
      category: "Workshops",
      description: "Essential information about student visas, work permits, and potential pathways to permanent residency in Canada.",
      image: "https://source.unsplash.com/random/300x200/?canada,visa",
      date: "June 10, 2025",
      time: "5:00 PM - 7:00 PM",
      location: "Virtual Event",
      region: "Online",
      format: "Online"
    },
    {
      title: "European Universities Fair",
      category: "Education Fairs",
      description: "Explore study opportunities in Germany, France, Netherlands, and other European countries with representatives from top institutions.",
      image: "https://source.unsplash.com/random/300x200/?europe,university",
      date: "June 18-19, 2025",
      time: "11:00 AM - 6:00 PM",
      location: "Port of Spain, Trinidad",
      region: "Caribbean",
      format: "In-person"
    },
    {
      title: "Medical School Admissions Webinar",
      category: "Webinars",
      description: "Expert advice on applying to medical schools worldwide, including preparation for entrance exams and interview strategies.",
      image: "https://source.unsplash.com/random/300x200/?medical,school",
      date: "June 25, 2025",
      time: "7:00 PM - 8:30 PM (EST)",
      location: "Virtual Event",
      region: "Online",
      format: "Online"
    },
    {
      title: "US Universities Virtual Fair",
      category: "Education Fairs",
      description: "Connect with admissions officers from top US universities and colleges to discuss programs, scholarships, and campus life.",
      image: "https://source.unsplash.com/random/300x200/?usa,university",
      date: "July 02, 2025",
      time: "10:00 AM - 4:00 PM (EST)",
      location: "Virtual Event",
      region: "Online",
      format: "Online"
    },
    {
      title: "Scholarship Application Workshop",
      category: "Workshops",
      description: "Learn how to find and apply for scholarships, with tips on creating compelling applications and securing recommendation letters.",
      image: "https://source.unsplash.com/random/300x200/?scholarship,money",
      date: "July 12, 2025",
      time: "1:00 PM - 4:00 PM",
      location: "Bridgetown, Barbados",
      region: "Caribbean",
      format: "In-person"
    },
    {
      title: "Australian Universities Open Day",
      category: "Open Days",
      description: "Virtual tours and information sessions with representatives from top Australian universities discussing programs and admissions.",
      image: "https://source.unsplash.com/random/300x200/?australia,university",
      date: "July 20, 2025",
      time: "6:00 PM - 9:00 PM (EST)",
      location: "Virtual Event",
      region: "Online",
      format: "Online"
    },
  ];

  // Filter events based on active tab, region filter, and search term
  const filterEvents = (category, region, searchTerm) => {
    return events.filter(event => 
      (category === "All Events" || event.category === category) && 
      (region === "All Regions" || event.region === region) &&
      (searchTerm === "" || 
       event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="w-full pt-24 pb-12 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 modern-heading">Education Fairs & Events</h1>
          <p className="text-lg text-gray-700 max-w-3xl mb-8">
            Connect with universities, attend informative sessions, and get expert guidance at our upcoming events, both in-person and virtual.
          </p>
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search for events by name, location, or description..." 
                className="pl-10 pr-4 py-6 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Upcoming Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                    {event.format}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">{event.category}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {event.location}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Register Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Filters */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold">All Events</h2>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <select 
                className="bg-white border border-gray-300 rounded-md text-sm p-2"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                {regions.map((region, index) => (
                  <option key={index} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="All Events" className="w-full">
            <TabsList className="w-full flex overflow-x-auto pb-2 mb-6 space-x-2 justify-start">
              {eventCategories.map((category, index) => (
                <TabsTrigger key={index} value={category} className="px-4 py-2 whitespace-nowrap">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {eventCategories.map((category, index) => (
              <TabsContent key={index} value={category} className="mt-0">
                {filterEvents(category, filterRegion, searchTerm).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filterEvents(category, filterRegion, searchTerm).map((event, eventIndex) => (
                      <Card key={eventIndex} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-48 overflow-hidden relative">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                            {event.format}
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">{event.category}</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                          <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-blue-600" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                              {event.location}
                            </div>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Register Now</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600">No events found matching your criteria.</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterRegion("All Regions");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Host an Event */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Partner With Us</h2>
              <p className="text-gray-700 mb-4">
                Interested in hosting an education fair or event with Leadapps? Our events bring together students, institutions, and industry experts for meaningful connections and valuable insights.
              </p>
              <p className="text-gray-700 mb-6">
                We offer comprehensive event planning services, including venue selection, marketing, participant registration, and post-event follow-up.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                Submit Proposal
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-50 p-6">
                <div className="text-blue-600 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">University Showcases</h3>
                <p className="text-sm text-gray-600">Highlight your programs and connect with prospective students.</p>
              </Card>
              <Card className="bg-gray-50 p-6">
                <div className="text-blue-600 mb-2">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Workshops</h3>
                <p className="text-sm text-gray-600">Share expertise on admissions, scholarships, and student success.</p>
              </Card>
              <Card className="bg-gray-50 p-6">
                <div className="text-blue-600 mb-2">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Country Info Sessions</h3>
                <p className="text-sm text-gray-600">Provide insights about studying in specific countries or regions.</p>
              </Card>
              <Card className="bg-gray-50 p-6">
                <div className="text-blue-600 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Virtual Events</h3>
                <p className="text-sm text-gray-600">Reach a global audience with our specialized virtual event platform.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Never Miss an Event</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our events newsletter to get updates on upcoming fairs, webinars, and workshops.
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
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}