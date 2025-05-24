import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Target, Clock, Users, GraduationCap, BookOpen, Award, Calendar, BarChart3 } from "lucide-react";
import { useState } from "react";

interface AnalyticsData {
  overview: {
    totalStudents: number;
    activeApplications: number;
    completedExams: number;
    avgScore: number;
    studyHours: number;
    counselingSessions: number;
  };
  trends: {
    period: string;
    studentsGrowth: number;
    applicationsGrowth: number;
    engagementGrowth: number;
  };
  examPerformance: {
    examType: string;
    subject: string;
    avgScore: number;
    attempts: number;
    passRate: number;
  }[];
  applicationSuccess: {
    university: string;
    acceptanceRate: number;
    totalApplications: number;
    avgProcessingTime: number;
  }[];
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("overview");

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/dashboard', timeRange],
  });

  const { data: studentProgress } = useQuery({
    queryKey: ['/api/analytics/student-progress', timeRange],
  });

  const { data: platformUsage } = useQuery({
    queryKey: ['/api/analytics/platform-usage', timeRange],
  });

  // Mock data for demonstration
  const mockAnalytics: AnalyticsData = {
    overview: {
      totalStudents: 2847,
      activeApplications: 156,
      completedExams: 1289,
      avgScore: 78.5,
      studyHours: 12450,
      counselingSessions: 342
    },
    trends: {
      period: "Last 30 days",
      studentsGrowth: 12.5,
      applicationsGrowth: 8.3,
      engagementGrowth: 15.7
    },
    examPerformance: [
      { examType: "CSEC", subject: "Mathematics", avgScore: 82.3, attempts: 245, passRate: 76.8 },
      { examType: "CAPE", subject: "Biology", avgScore: 79.1, attempts: 189, passRate: 72.5 },
      { examType: "SAT", subject: "Math", avgScore: 1420, attempts: 98, passRate: 84.7 },
      { examType: "IELTS", subject: "Overall", avgScore: 7.2, attempts: 156, passRate: 89.1 }
    ],
    applicationSuccess: [
      { university: "University of the West Indies", acceptanceRate: 68.5, totalApplications: 89, avgProcessingTime: 21 },
      { university: "University of Toronto", acceptanceRate: 45.2, totalApplications: 67, avgProcessingTime: 45 },
      { university: "Florida International University", acceptanceRate: 72.1, totalApplications: 43, avgProcessingTime: 28 },
      { university: "University of Manchester", acceptanceRate: 41.8, totalApplications: 34, avgProcessingTime: 52 }
    ]
  };

  const data = analytics || mockAnalytics;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into student performance and platform usage</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold">{formatNumber(data.overview.totalStudents)}</p>
                <div className={`flex items-center gap-1 text-sm mt-1 ${getGrowthColor(data.trends.studentsGrowth)}`}>
                  {getGrowthIcon(data.trends.studentsGrowth)}
                  <span>{Math.abs(data.trends.studentsGrowth)}% vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Applications</p>
                <p className="text-3xl font-bold">{data.overview.activeApplications}</p>
                <div className={`flex items-center gap-1 text-sm mt-1 ${getGrowthColor(data.trends.applicationsGrowth)}`}>
                  {getGrowthIcon(data.trends.applicationsGrowth)}
                  <span>{Math.abs(data.trends.applicationsGrowth)}% vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Exams</p>
                <p className="text-3xl font-bold">{formatNumber(data.overview.completedExams)}</p>
                <div className="flex items-center gap-1 text-sm mt-1 text-blue-600">
                  <Target className="h-4 w-4" />
                  <span>Avg Score: {data.overview.avgScore}%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Hours</p>
                <p className="text-3xl font-bold">{formatNumber(data.overview.studyHours)}</p>
                <div className="flex items-center gap-1 text-sm mt-1 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>This month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Counseling Sessions</p>
                <p className="text-3xl font-bold">{data.overview.counselingSessions}</p>
                <div className={`flex items-center gap-1 text-sm mt-1 ${getGrowthColor(data.trends.engagementGrowth)}`}>
                  {getGrowthIcon(data.trends.engagementGrowth)}
                  <span>{Math.abs(data.trends.engagementGrowth)}% engagement</span>
                </div>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Platform Engagement</p>
                <p className="text-3xl font-bold">89.2%</p>
                <div className="flex items-center gap-1 text-sm mt-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>High engagement</span>
                </div>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exams">Exam Performance</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Student Registrations</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-24 h-2" />
                      <span className="text-sm font-medium">+{data.trends.studentsGrowth}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Application Submissions</span>
                    <div className="flex items-center gap-2">
                      <Progress value={60} className="w-24 h-2" />
                      <span className="text-sm font-medium">+{data.trends.applicationsGrowth}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Platform Engagement</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-24 h-2" />
                      <span className="text-sm font-medium">+{data.trends.engagementGrowth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Strong Performance</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Students show consistent improvement in exam scores with 78.5% average
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">High Engagement</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Counseling sessions increased by 15.7%, showing strong student support utilization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.examPerformance.map((exam, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{exam.examType}</Badge>
                        <span className="font-medium">{exam.subject}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{exam.attempts} attempts</span>
                        <span>{exam.passRate}% pass rate</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{exam.avgScore}{exam.examType === 'SAT' ? '' : '%'}</p>
                      <p className="text-sm text-gray-600">Avg Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>University Application Success Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.applicationSuccess.map((uni, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{uni.university}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{uni.totalApplications} applications</span>
                        <span>{uni.avgProcessingTime} days avg processing</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={uni.acceptanceRate} className="w-20 h-2" />
                        <span className="text-sm font-medium">{uni.acceptanceRate}%</span>
                      </div>
                      <p className="text-xs text-gray-600">Acceptance Rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-4xl font-bold text-blue-600">1,847</p>
                  <p className="text-gray-600 mt-2">Average daily users</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">+12% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exam Prep Hub</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-16 h-2" />
                      <span className="text-sm">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Application Tracker</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-16 h-2" />
                      <span className="text-sm">78%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Counseling System</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-16 h-2" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Messaging</span>
                    <div className="flex items-center gap-2">
                      <Progress value={84} className="w-16 h-2" />
                      <span className="text-sm">84%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}