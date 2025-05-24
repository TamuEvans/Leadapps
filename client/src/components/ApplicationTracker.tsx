import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, CheckCircle, AlertTriangle, XCircle, FileText, Send, GraduationCap } from "lucide-react";

interface Application {
  id: number;
  universityName: string;
  programName: string;
  status: 'draft' | 'submitted' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected' | 'waitlisted';
  submissionDate?: string;
  deadline: string;
  lastUpdated: string;
  documentsRequired: number;
  documentsSubmitted: number;
  applicationFee: number;
  feePaid: boolean;
}

export default function ApplicationTracker() {
  const { data: applications = [] } = useQuery({
    queryKey: ['/api/applications'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'waitlisted': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'submitted': return <Send className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      case 'interview_scheduled': return <Calendar className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'waitlisted': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCompletionPercentage = (app: Application) => {
    let completed = 0;
    let total = 4; // Status, Documents, Fee, Submission

    if (app.status !== 'draft') completed++;
    if (app.documentsSubmitted >= app.documentsRequired) completed++;
    if (app.feePaid) completed++;
    if (app.submissionDate) completed++;

    return Math.round((completed / total) * 100);
  };

  const activeApplications = applications.filter((app: Application) => 
    !['accepted', 'rejected'].includes(app.status)
  );

  const completedApplications = applications.filter((app: Application) => 
    ['accepted', 'rejected'].includes(app.status)
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeApplications.length}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter((app: Application) => app.status === 'accepted').length}
                </p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter((app: Application) => app.status === 'interview_scheduled').length}
                </p>
                <p className="text-sm text-gray-600">Interviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Applications */}
      {activeApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeApplications.map((app: Application) => {
              const daysUntilDeadline = getDaysUntilDeadline(app.deadline);
              const completionPercentage = getCompletionPercentage(app);
              
              return (
                <div key={app.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{app.universityName}</h4>
                        <Badge className={getStatusColor(app.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                            {formatStatus(app.status)}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{app.programName}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        daysUntilDeadline <= 7 ? 'text-red-600' : 
                        daysUntilDeadline <= 30 ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Deadline passed'}
                      </div>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(app.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Application Progress</span>
                      <span className="font-medium">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        app.documentsSubmitted >= app.documentsRequired ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-gray-600">
                        Documents: {app.documentsSubmitted}/{app.documentsRequired}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        app.feePaid ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-gray-600">
                        Fee: {app.feePaid ? 'Paid' : `$${app.applicationFee}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        app.submissionDate ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-gray-600">
                        {app.submissionDate ? 'Submitted' : 'Draft'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">
                        Updated {new Date(app.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    {app.status === 'draft' && (
                      <Button size="sm">Continue Application</Button>
                    )}
                    {app.status === 'interview_scheduled' && (
                      <Button size="sm" variant="outline">Schedule Interview</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Completed Applications */}
      {completedApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedApplications.map((app: Application) => (
              <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    app.status === 'accepted' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {getStatusIcon(app.status)}
                  </div>
                  <div>
                    <h4 className="font-medium">{app.universityName}</h4>
                    <p className="text-sm text-gray-600">{app.programName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(app.status)}>
                    {formatStatus(app.status)}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(app.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {applications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Applications Yet</h3>
            <p className="text-gray-600 mb-4">
              Start your university application journey by creating your first application.
            </p>
            <Button>Start New Application</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}