import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'wouter';
import { Clock, FileText, Award } from 'lucide-react';

export default function PracticeTests() {
  const { subject } = useParams();

  const tests = [
    {
      id: 1,
      title: 'English A Paper 1 - Reading Comprehension',
      description: 'Practice test covering reading comprehension and language use',
      duration: 90,
      questions: 45,
      difficulty: 'Intermediate',
      attempts: 3,
    },
    {
      id: 2,
      title: 'English A Paper 2 - Literary Analysis',
      description: 'Essay questions on poetry and prose analysis',
      duration: 150,
      questions: 4,
      difficulty: 'Advanced',
      attempts: 1,
    },
    {
      id: 3,
      title: 'Mock Exam - Full Paper',
      description: 'Complete practice exam under timed conditions',
      duration: 180,
      questions: 50,
      difficulty: 'Advanced',
      attempts: 0,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Practice Tests - {subject?.charAt(0).toUpperCase() + subject?.slice(1)}
        </h1>
        <p className="text-muted-foreground">
          Test your knowledge with our comprehensive practice exams
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {tests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {test.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {test.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{test.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {test.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {test.attempts} attempts
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {test.attempts > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Best score: {Math.floor(Math.random() * 30) + 70}%
                        </p>
                      )}
                    </div>
                    <Button>
                      {test.attempts > 0 ? 'Retake Test' : 'Start Test'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Read all instructions carefully before starting</li>
                <li>• Manage your time effectively during the test</li>
                <li>• Review your answers before submitting</li>
                <li>• Take notes of areas you need to improve</li>
                <li>• Practice regularly for better results</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tests Completed</span>
                  <span className="font-semibold">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Score</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Time Spent</span>
                  <span className="font-semibold">6.5 hrs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}