import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Target, Clock } from 'lucide-react';

export default function ProgressTracking() {
  const subjects = [
    { name: 'English A', progress: 85, score: 78, timeSpent: '12.5 hrs' },
    { name: 'Mathematics', progress: 70, score: 82, timeSpent: '18.2 hrs' },
    { name: 'Biology', progress: 60, score: 75, timeSpent: '8.7 hrs' },
    { name: 'Chemistry', progress: 45, score: 68, timeSpent: '6.3 hrs' },
  ];

  const recentActivity = [
    { action: 'Completed Practice Test', subject: 'English A', score: 85, time: '2 hours ago' },
    { action: 'Read Study Material', subject: 'Mathematics', score: null, time: '5 hours ago' },
    { action: 'Joined Study Group', subject: 'Biology', score: null, time: '1 day ago' },
    { action: 'Completed Quiz', subject: 'Chemistry', score: 72, time: '2 days ago' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Progress Tracking</h1>
        <p className="text-muted-foreground">
          Monitor your study progress and performance across all subjects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">65%</div>
            <Progress value={65} className="mb-2" />
            <p className="text-sm text-muted-foreground">4 of 6 subjects in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">76%</div>
            <p className="text-sm text-green-600">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">45.7</div>
            <p className="text-sm text-muted-foreground">Hours this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Your progress across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{subject.score}%</Badge>
                      <span className="text-sm text-muted-foreground">{subject.timeSpent}</span>
                    </div>
                  </div>
                  <Progress value={subject.progress} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest study activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.subject}</p>
                  </div>
                  <div className="text-right">
                    {activity.score && (
                      <Badge variant="secondary" className="mb-1">
                        {activity.score}%
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Study Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Daily Goal</h3>
              <Progress value={75} className="mb-2" />
              <p className="text-sm text-muted-foreground">1.5 / 2 hours completed</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Weekly Goal</h3>
              <Progress value={60} className="mb-2" />
              <p className="text-sm text-muted-foreground">9 / 15 hours completed</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Monthly Goal</h3>
              <Progress value={45} className="mb-2" />
              <p className="text-sm text-muted-foreground">27 / 60 hours completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}