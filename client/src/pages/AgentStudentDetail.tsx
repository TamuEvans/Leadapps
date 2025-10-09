import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  ArrowLeft,
  Save,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Briefcase,
  Award,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentStudentDetail() {
  const [, params] = useRoute("/app/agent/students/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const studentId = params?.id ? parseInt(params.id) : null;

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("active");
  const [notesChanged, setNotesChanged] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);

  const { data: student, isLoading: studentLoading } = useQuery<any>({
    queryKey: ["/api/agent/students", studentId],
    enabled: !!studentId,
  });

  const { data: profile } = useQuery<any>({
    queryKey: [`/api/profile/${studentId}`],
    enabled: !!studentId,
  });

  const { data: applications } = useQuery<any>({
    queryKey: [`/api/applications/student/${studentId}`],
    enabled: !!studentId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { notes?: string; status?: string }) => {
      const res = await fetch(`/api/agent/students/${studentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/students"] });
      toast({
        title: "Updated successfully",
        description: "Student information has been updated.",
      });
      setNotesChanged(false);
      setStatusChanged(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating student",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/agent/students/${studentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/students"] });
      toast({
        title: "Student removed",
        description: "The student has been removed from your portfolio.",
      });
      setLocation("/app/agent/students");
    },
    onError: (error: any) => {
      toast({
        title: "Error removing student",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const updates: { notes?: string; status?: string } = {};
    if (notesChanged) updates.notes = notes;
    if (statusChanged) updates.status = status;
    
    if (Object.keys(updates).length > 0) {
      updateMutation.mutate(updates);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  if (studentLoading) {
    return (
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (!student) {
    return (
        <div className="container mx-auto py-8 px-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">Student not found</p>
          <Link href="/app/agent/students">
            <Button className="mt-4">Back to Students</Button>
          </Link>
        </div>
    );
  }

  return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-6">
          <Link href="/app/agent/students">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{student.email}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(student.status)}>
              {student.status}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="applications" data-testid="tab-applications">Applications</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile ? (
                    <>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                        <p className="font-medium">
                          {profile.dateOfBirth
                            ? new Date(profile.dateOfBirth).toLocaleDateString()
                            : "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Country</p>
                        <p className="font-medium">{profile.country || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium">{profile.phoneNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Profile Completion</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${profile.completionPercentage || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {profile.completionPercentage || 0}%
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Profile not yet created
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Agent Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes || student.notes || ""}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setNotesChanged(true);
                    }}
                    placeholder="Add notes about this student..."
                    rows={6}
                    data-testid="textarea-notes"
                  />
                  {notesChanged && (
                    <Button
                      onClick={handleSave}
                      className="mt-3 w-full"
                      disabled={updateMutation.isPending}
                      data-testid="button-save-notes"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Notes
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Track student's university applications</CardDescription>
              </CardHeader>
              <CardContent>
                {applications && (applications as any[]).length > 0 ? (
                  <div className="space-y-3">
                    {(applications as any[]).map((app: any) => (
                      <div
                        key={app.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                        data-testid={`application-${app.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{app.programName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {app.universityName}
                            </p>
                          </div>
                          <Badge>{app.status}</Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Submitted {new Date(app.submittedAt || app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                    No applications yet
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Status</CardTitle>
                <CardDescription>Manage the student's status in your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={status || student.status}
                    onValueChange={(value) => {
                      setStatus(value);
                      setStatusChanged(true);
                    }}
                  >
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {statusChanged && (
                  <Button
                    onClick={handleSave}
                    className="w-full"
                    disabled={updateMutation.isPending}
                    data-testid="button-save-status"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Status
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription>Remove this student from your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" data-testid="button-remove-student">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Student
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {student.firstName} {student.lastName} from your
                        portfolio. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => removeMutation.mutate()}
                        className="bg-red-600 hover:bg-red-700"
                        data-testid="button-confirm-remove"
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
