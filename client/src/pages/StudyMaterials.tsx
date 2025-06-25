import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'wouter';
import { Download, Eye, BookOpen } from 'lucide-react';

export default function StudyMaterials() {
  const { subject } = useParams();

  const materials = [
    {
      id: 1,
      title: 'English A Comprehensive Guide',
      description: 'Complete study guide covering all topics in the English A syllabus',
      type: 'PDF',
      difficulty: 'Intermediate',
      downloads: 1250,
    },
    {
      id: 2,
      title: 'Poetry Analysis Techniques',
      description: 'Learn how to analyze poetry effectively for Paper 2',
      type: 'Video',
      difficulty: 'Advanced',
      downloads: 890,
    },
    {
      id: 3,
      title: 'Essay Writing Framework',
      description: 'Step-by-step guide to writing high-scoring essays',
      type: 'PDF',
      difficulty: 'Basic',
      downloads: 2100,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Study Materials - {subject?.charAt(0).toUpperCase() + subject?.slice(1)}
        </h1>
        <p className="text-muted-foreground">
          High-quality study resources to help you excel in your CSEC exams
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {materials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {material.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {material.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{material.type}</Badge>
                      <Badge variant="secondary">{material.difficulty}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {material.downloads} downloads
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Review materials regularly, not just before exams</li>
                <li>• Practice past papers to understand exam format</li>
                <li>• Join study groups for collaborative learning</li>
                <li>• Create your own notes and summaries</li>
                <li>• Ask questions when you don't understand</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}