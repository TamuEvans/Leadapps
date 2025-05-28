import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, Microscope, Globe, Languages, Music, Palette, Wrench, Heart, Users, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CSECSubjects() {
  const csecSubjects = [
    {
      id: 'english',
      name: 'English A & B',
      icon: BookOpen,
      description: 'Language skills, comprehension, writing, literature analysis',
      topics: ['Reading Comprehension', 'Grammar & Writing', 'Literary Analysis', 'Poetry', 'Prose', 'Drama'],
      studyMaterials: 45,
      practiceTests: 12,
      difficulty: 'Core',
      link: '/app/csec-english'
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      description: 'Algebra, geometry, trigonometry, calculus, statistics',
      topics: ['Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Calculus', 'Number Theory'],
      studyMaterials: 38,
      practiceTests: 15,
      difficulty: 'Core',
      link: '/app/csec-mathematics'
    },
    {
      id: 'biology',
      name: 'Biology',
      icon: Microscope,
      description: 'Life processes, genetics, ecology, human biology',
      topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Biology', 'Plant Biology', 'Evolution'],
      studyMaterials: 32,
      practiceTests: 10,
      difficulty: 'Science',
      link: '/app/csec-biology'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: Microscope,
      description: 'Atomic structure, chemical reactions, organic chemistry',
      topics: ['Atomic Structure', 'Chemical Bonding', 'Organic Chemistry', 'Acids & Bases', 'Metals', 'Analysis'],
      studyMaterials: 29,
      practiceTests: 8,
      difficulty: 'Science',
      link: '/app/csec-chemistry'
    },
    {
      id: 'physics',
      name: 'Physics',
      icon: Microscope,
      description: 'Mechanics, electricity, waves, thermodynamics',
      topics: ['Mechanics', 'Electricity', 'Waves', 'Thermodynamics', 'Optics', 'Modern Physics'],
      studyMaterials: 26,
      practiceTests: 9,
      difficulty: 'Science',
      link: '/app/csec-physics'
    },
    {
      id: 'social-studies',
      name: 'Social Studies',
      icon: Globe,
      description: 'Caribbean history, geography, civics, economics',
      topics: ['Caribbean History', 'Geography', 'Civics', 'Economics', 'Culture', 'Government'],
      studyMaterials: 34,
      practiceTests: 11,
      difficulty: 'Core',
      link: '/app/csec-social-studies'
    },
    {
      id: 'spanish',
      name: 'Spanish',
      icon: Languages,
      description: 'Language skills, grammar, conversation, culture',
      topics: ['Grammar', 'Vocabulary', 'Conversation', 'Reading', 'Writing', 'Culture'],
      studyMaterials: 22,
      practiceTests: 7,
      difficulty: 'Language',
      link: '/app/csec-spanish'
    },
    {
      id: 'french',
      name: 'French',
      icon: Languages,
      description: 'Language skills, grammar, conversation, culture',
      topics: ['Grammar', 'Vocabulary', 'Conversation', 'Reading', 'Writing', 'Culture'],
      studyMaterials: 20,
      practiceTests: 6,
      difficulty: 'Language',
      link: '/app/csec-french'
    },
    {
      id: 'integrated-science',
      name: 'Integrated Science',
      icon: Microscope,
      description: 'Basic concepts from biology, chemistry, and physics',
      topics: ['Living Things', 'Matter & Energy', 'Earth & Environment', 'Technology', 'Health', 'Resources'],
      studyMaterials: 28,
      practiceTests: 8,
      difficulty: 'Science',
      link: '/app/csec-integrated-science'
    },
    {
      id: 'principles-business',
      name: 'Principles of Business',
      icon: Users,
      description: 'Business concepts, entrepreneurship, economics',
      topics: ['Business Fundamentals', 'Marketing', 'Finance', 'Management', 'Economics', 'Entrepreneurship'],
      studyMaterials: 25,
      practiceTests: 7,
      difficulty: 'Business',
      link: '/app/csec-principles-business'
    },
    {
      id: 'information-technology',
      name: 'Information Technology',
      icon: Wrench,
      description: 'Computer systems, programming, digital literacy',
      topics: ['Computer Systems', 'Programming', 'Networks', 'Databases', 'Web Development', 'Digital Ethics'],
      studyMaterials: 31,
      practiceTests: 9,
      difficulty: 'Technical',
      link: '/app/csec-information-technology'
    },
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      description: 'Music theory, performance, composition, history',
      topics: ['Music Theory', 'Performance', 'Composition', 'Music History', 'Caribbean Music', 'Analysis'],
      studyMaterials: 18,
      practiceTests: 5,
      difficulty: 'Arts',
      link: '/app/csec-music'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Core': return 'bg-blue-100 text-blue-800';
      case 'Science': return 'bg-green-100 text-green-800';
      case 'Language': return 'bg-purple-100 text-purple-800';
      case 'Business': return 'bg-orange-100 text-orange-800';
      case 'Technical': return 'bg-gray-100 text-gray-800';
      case 'Arts': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/app/exam-prep-hub">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exam Hub
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CSEC Subjects</h1>
            <p className="text-gray-600 mt-2">Choose your CSEC subject to access study materials and practice tests</p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {csecSubjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                    </div>
                    <Badge className={getDifficultyColor(subject.difficulty)}>
                      {subject.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{subject.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Topics */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Topics:</h4>
                    <div className="flex flex-wrap gap-1">
                      {subject.topics.slice(0, 4).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {subject.topics.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{subject.topics.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{subject.studyMaterials} study materials</span>
                    <span>{subject.practiceTests} practice tests</span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = subject.link}
                  >
                    Study {subject.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}