import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Mail, FileText, TrendingUp, Clock } from 'lucide-react';

export default function AgentDashboard() {
  const { data: user } = useQuery<any>({
    queryKey: ['/api/auth/me'],
  });

  const { data: students } = useQuery<any[]>({
    queryKey: ['/api/agent/students'],
  });

  const { data: invitations } = useQuery<any[]>({
    queryKey: ['/api/agent/invitations'],
  });

  const totalStudents = students?.length || 0;
  const pendingInvitations = invitations?.filter(inv => inv.status === 'pending').length || 0;
  const activeApplications = students?.reduce((acc, student) => acc + (student.applicationsCount || 0), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Agent Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}! Manage your students and track their progress.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-students">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Students under your management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-applications">{activeApplications}</div>
            <p className="text-xs text-muted-foreground">Applications in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-invitations">{pendingInvitations}</div>
            <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-month-stats">+{students?.filter(s => {
              const createdAt = new Date(s.assignedAt);
              const now = new Date();
              return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
            }).length || 0}</div>
            <p className="text-xs text-muted-foreground">New students this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <UserPlus className="h-8 w-8 mb-2 text-blue-600" />
            <CardTitle>Invite Student</CardTitle>
            <CardDescription>Send an invitation to a new student</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/agent/invite">
              <Button className="w-full" data-testid="button-invite-student">
                Send Invitation
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Users className="h-8 w-8 mb-2 text-green-600" />
            <CardTitle>Manage Students</CardTitle>
            <CardDescription>View and manage all your students</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/agent/students">
              <Button className="w-full" variant="outline" data-testid="button-manage-students">
                View All Students
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <FileText className="h-8 w-8 mb-2 text-purple-600" />
            <CardTitle>Bulk Import</CardTitle>
            <CardDescription>Import multiple students at once</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/agent/import">
              <Button className="w-full" variant="outline" data-testid="button-bulk-import">
                Import Students
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your students</CardDescription>
        </CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <div className="space-y-4">
              {students.slice(0, 5).map((student, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0" data-testid={`activity-student-${index}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{student.firstName} {student.lastName}</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No students yet. Start by inviting your first student!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
