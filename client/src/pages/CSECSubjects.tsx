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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6">
          <Link to="/app/exam-prep-hub">
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl px-6 py-3 font-medium shadow-lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exam Hub
            </Button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              📚 CSEC Subjects
            </h1>
            <p className="text-gray-600 text-lg">Choose your CSEC subject to access study materials and practice tests</p>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {csecSubjects.map((subject, index) => {
            const IconComponent = subject.icon;
            const gradients = [
              'from-blue-50 to-cyan-50 border-blue-200',
              'from-green-50 to-emerald-50 border-green-200', 
              'from-purple-50 to-pink-50 border-purple-200',
              'from-orange-50 to-red-50 border-orange-200',
              'from-yellow-50 to-orange-50 border-yellow-200',
              'from-pink-50 to-rose-50 border-pink-200',
              'from-indigo-50 to-blue-50 border-indigo-200',
              'from-teal-50 to-cyan-50 border-teal-200',
              'from-violet-50 to-purple-50 border-violet-200',
              'from-emerald-50 to-green-50 border-emerald-200'
            ];
            const iconColors = [
              'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500',
              'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-violet-500', 'bg-emerald-500'
            ];
            return (
              <Card key={subject.id} className={`bg-gradient-to-br ${gradients[index % gradients.length]} border-2 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                <CardHeader className="pb-4 text-center">
                  <div className="flex flex-col items-center gap-4 mb-3">
                    <div className={`${iconColors[index % iconColors.length]} p-4 rounded-full shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800">{subject.name}</CardTitle>
                      <Badge className={`${getDifficultyColor(subject.difficulty)} mt-2 px-3 py-1 rounded-full font-medium`}>
                        {subject.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{subject.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Topics */}
                  <div>
                    <h4 className="font-bold text-sm mb-3 text-gray-700">Key Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.topics.slice(0, 4).map((topic, topicIndex) => (
                        <Badge key={topicIndex} className="bg-white/60 text-gray-700 border border-gray-300 hover:bg-white/80 transition-colors px-3 py-1 rounded-full text-xs font-medium">
                          {topic}
                        </Badge>
                      ))}
                      {subject.topics.length > 4 && (
                        <Badge className="bg-gray-200 text-gray-600 border border-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                          +{subject.topics.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-800">{subject.studyMaterials}</div>
                      <div className="text-xs text-gray-600">Study Materials</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-800">{subject.practiceTests}</div>
                      <div className="text-xs text-gray-600">Practice Tests</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${iconColors[index % iconColors.length]} hover:opacity-90 text-white rounded-2xl h-12 font-medium shadow-lg transform hover:scale-105 transition-all duration-200`}
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