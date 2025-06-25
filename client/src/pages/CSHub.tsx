import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { BookOpen, Users, BarChart3, FileText } from 'lucide-react';

export default function CSHub() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">CSEC Study Hub</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive study resources for Caribbean Secondary Education Certificate
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Materials
            </CardTitle>
            <CardDescription>
              Access comprehensive study notes and materials for all CSEC subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app/cs-hub/study/english">
              <Button className="w-full">Browse Materials</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Practice Tests
            </CardTitle>
            <CardDescription>
              Take practice exams and mock tests to prepare for your CSEC exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app/cs-hub/practice/english">
              <Button className="w-full">Start Practice</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Study Groups
            </CardTitle>
            <CardDescription>
              Join study groups and collaborate with other students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app/cs-hub/groups">
              <Button className="w-full">Join Groups</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progress Tracking
            </CardTitle>
            <CardDescription>
              Monitor your study progress and performance analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app/cs-hub/progress">
              <Button className="w-full">View Progress</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Popular Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['English A', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Social Studies'].map((subject) => (
            <Card key={subject} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-semibold">{subject}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Study materials and practice tests available
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}