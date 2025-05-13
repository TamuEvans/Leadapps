import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  ChevronLeft, 
  Upload, 
  Loader,
  Paperclip
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Define document interfaces
interface ApplicationDocument {
  id: number;
  applicationId: number;
  documentType: string;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
  status: string;
}

interface ProfileDocument {
  id: number;
  profileId: number;
  type: string;
  fileUrl: string;
  fileName: string;
  uploadDate: string;
}

// Combined document type for the component
type Document = ApplicationDocument | ProfileDocument;

const ApplicationDetailsPage = () => {
  const [, params] = useRoute("/app/application/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [note, setNote] = useState("");
  
  const applicationId = params?.id ? parseInt(params.id) : null;
  
  // Fetch application details
  const { data: application, isLoading } = useQuery({
    queryKey: ["/api/applications", applicationId],
    queryFn: async () => {
      if (!applicationId) return null;
      const response = await apiRequest("GET", `/api/applications/${applicationId}`);
      return response.json();
    },
    enabled: !!applicationId,
  });
  
  // Fetch application documents
  const { data: documents = [] } = useQuery<ApplicationDocument[]>({
    queryKey: ["/api/applications", applicationId, "documents"],
    queryFn: async () => {
      if (!applicationId) return [];
      const response = await apiRequest("GET", `/api/applications/${applicationId}/documents`);
      return response.json();
    },
    enabled: !!applicationId,
  });
  
  // Fetch student profile documents
  const { data: profileDocuments = [] } = useQuery<ProfileDocument[]>({
    queryKey: ["/api/applications", applicationId, "profile-documents"],
    queryFn: async () => {
      if (!applicationId) return [];
      // This endpoint will return documents from the student profile associated with this application
      const response = await apiRequest("GET", `/api/applications/${applicationId}/profile-documents`);
      return response.json();
    },
    enabled: !!applicationId,
  });
  
  // Combine application documents and profile documents
  const allDocuments: Document[] = [...documents, ...profileDocuments];
  
  // Helper function to check if a document exists for a requirement
  const hasDocumentForRequirement = (requirementName: string): boolean => {
    return allDocuments.some(doc => 
      'documentType' in doc ? doc.documentType === requirementName : doc.type === requirementName
    );
  };
  
  // Fetch application notes
  const { data: notes = [], refetch: refetchNotes } = useQuery({
    queryKey: ["/api/applications", applicationId, "notes"],
    queryFn: async () => {
      if (!applicationId) return [];
      const response = await apiRequest("GET", `/api/applications/${applicationId}/notes`);
      return response.json();
    },
    enabled: !!applicationId,
  });
  
  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (noteText: string) => {
      if (!applicationId) throw new Error("No application ID provided");
      return apiRequest("POST", `/api/applications/${applicationId}/notes`, { 
        text: noteText,
        createdAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Note added",
        description: "Your note has been added successfully.",
      });
      setNote("");
      refetchNotes();
    },
    onError: (error) => {
      toast({
        title: "Error adding note",
        description: error.message || "There was an error adding your note. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!applicationId) throw new Error("No application ID provided");
      return apiRequest("PATCH", `/api/applications/${applicationId}`, { 
        status,
        lastUpdated: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications", applicationId] });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message || "There was an error updating the application status. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Upload document mutation (placeholder for now)
  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!applicationId) throw new Error("No application ID provided");
      return apiRequest("POST", `/api/applications/${applicationId}/documents`, formData);
    },
    onSuccess: () => {
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications", applicationId, "documents"] });
    },
    onError: (error) => {
      toast({
        title: "Error uploading document",
        description: error.message || "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      addNoteMutation.mutate(note);
    }
  };
  
  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate(status);
  };
  
  // Calculate progress based on application status
  const getProgressValue = () => {
    const statusMap: Record<string, number> = {
      'draft': 10,
      'submitted': 25,
      'assessment': 50,
      'submitted_to_school': 75,
      'decision': 90,
      'enrolled': 100
    };
    
    return statusMap[application?.status || 'draft'] || 0;
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string, color: string }> = {
      'draft': { label: 'Draft', color: 'bg-gray-200 text-gray-800' },
      'submitted': { label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
      'assessment': { label: 'In Assessment', color: 'bg-purple-100 text-purple-800' },
      'submitted_to_school': { label: 'Submitted to School', color: 'bg-yellow-100 text-yellow-800' },
      'decision': { label: 'Decision Pending', color: 'bg-orange-100 text-orange-800' },
      'enrolled': { label: 'Enrolled', color: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status] || statusConfig['draft'];
    return <Badge className={`${config.color} font-medium`}>{config.label}</Badge>;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
        <p className="text-gray-600 mb-4">The application you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate('/app/applications')}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Return to Applications
        </Button>
      </div>
    );
  }
  
  // Required documents (this would ideally come from the backend)
  const requiredDocuments = [
    { id: 1, name: "Personal Statement", description: "A statement explaining why you want to pursue this programme", required: true, status: "pending" },
    { id: 2, name: "Academic Transcript", description: "Official academic records from your previous studies", required: true, status: "pending" },
    { id: 3, name: "Reference Letters", description: "Two letters of recommendation from academic or professional referees", required: true, status: "pending" },
    { id: 4, name: "Resume/CV", description: "An up-to-date professional resume or curriculum vitae", required: true, status: "pending" },
    { id: 5, name: "Passport Copy", description: "A valid copy of your passport identification page", required: true, status: "pending" },
    { id: 6, name: "English Proficiency Test", description: "IELTS, TOEFL or other accepted English proficiency test results", required: false, status: "pending" },
  ];
  
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/app/applications')}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
        {getStatusBadge(application.status)}
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {application.programName || "Application"} - {application.universityName || "University"}
        </h1>
        <p className="text-gray-600 mb-4">
          Application ID: {application.id} | Submitted: {application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : "Not submitted yet"}
        </p>
        
        {/* CX Team Notification: Show only for submitted applications that are not in assessment yet */}
        {application.status === 'submitted' && (
          <Alert className="mb-6 bg-blue-50 border-blue-300">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">Attention CX Team</AlertTitle>
            <AlertDescription className="text-blue-700">
              This application has been recently submitted and payment has been completed. 
              Please review the attached documents and begin the assessment process.
              <div className="mt-3">
                <Button 
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleStatusUpdate('assessment')}
                >
                  Begin Assessment
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Application Progress</p>
          <Progress value={getProgressValue()} className="h-2" />
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Draft</span>
            <span>Assessment</span>
            <span>School Review</span>
            <span>Decision</span>
            <span>Enrolled</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Current Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                <span className="font-medium">
                  {application.status === 'draft' ? 'Draft' : 
                   application.status === 'submitted' ? 'Submitted' :
                   application.status === 'assessment' ? 'In Assessment' :
                   application.status === 'submitted_to_school' ? 'Submitted to School' :
                   application.status === 'decision' ? 'Decision Pending' :
                   application.status === 'enrolled' ? 'Enrolled' : 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Application Fee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {application.feePaid ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    <span className="font-medium">Paid</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                    <span className="font-medium">Unpaid - ${application.applicationFee}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                <span className="font-medium">
                  {allDocuments.length} / {requiredDocuments.length} Uploaded
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {application.decisionStatus ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    <span className="font-medium">{application.decisionStatus}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-medium">Pending</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="documents">
        <TabsList className="mb-4">
          <TabsTrigger value="documents">Required Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes & Communication</TabsTrigger>
          <TabsTrigger value="status">Application Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Please upload all required documents to complete your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {requiredDocuments.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {doc.name}
                          {doc.required && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 rounded px-2 py-0.5">
                              Required
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                      <Badge 
                        variant={doc.status === "approved" ? "default" : 
                                doc.status === "rejected" ? "destructive" : "outline"}
                      >
                        {doc.status === "approved" ? "Approved" : 
                          doc.status === "rejected" ? "Rejected" : 
                          doc.status === "pending_review" ? "Under Review" : "Not Uploaded"}
                      </Badge>
                    </div>
                    
                    <div className="mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Input
                            id={`file-${doc.id}`}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const formData = new FormData();
                                formData.append('document', e.target.files[0]);
                                formData.append('documentType', doc.name);
                                uploadDocumentMutation.mutate(formData);
                              }
                            }}
                          />
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Document
                          </Button>
                        </div>
                        
                        {hasDocumentForRequirement(doc.name) && (
                          <Button variant="outline" className="w-full">
                            <Paperclip className="w-4 h-4 mr-2" />
                            View Uploaded
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes & Communication</CardTitle>
              <CardDescription>
                Communicate with the application assessment team or add notes for your reference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <form onSubmit={handleAddNote} className="space-y-4">
                  <Textarea
                    placeholder="Add a note or question about your application..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    type="submit" 
                    disabled={!note.trim() || addNoteMutation.isPending}
                    className="flex items-center"
                  >
                    {addNoteMutation.isPending ? (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Note
                  </Button>
                </form>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Communication History</h3>
                  
                  {notes.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">
                      No notes or communication history yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {notes.map((note: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                {note.isStaff ? "S" : "Y"}
                              </div>
                              <span className="font-medium">
                                {note.isStaff ? "Staff" : "You"}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(note.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{note.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>
                Track the progress of your application through our admissions process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="relative border-l-2 pl-8 py-4 ml-4 border-blue-500">
                  <div className="absolute w-8 h-8 bg-blue-500 rounded-full -left-[17px] -top-1 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-lg">Application Submitted</h3>
                  <p className="text-gray-600 mt-1">
                    Your application has been received by our team and is being prepared for assessment.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {application.submissionDate ? new Date(application.submissionDate).toLocaleString() : "Not submitted yet"}
                  </p>
                </div>
                
                <div className={`relative border-l-2 pl-8 py-4 ml-4 ${application.status === 'assessment' || application.status === 'submitted_to_school' || application.status === 'decision' || application.status === 'enrolled' ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className={`absolute w-8 h-8 rounded-full -left-[17px] -top-1 flex items-center justify-center ${application.status === 'assessment' || application.status === 'submitted_to_school' || application.status === 'decision' || application.status === 'enrolled' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    {application.status === 'assessment' || application.status === 'submitted_to_school' || application.status === 'decision' || application.status === 'enrolled' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-medium">2</span>
                    )}
                  </div>
                  <h3 className="font-medium text-lg">Assessment</h3>
                  <p className="text-gray-600 mt-1">
                    Our team is reviewing your documents and information to ensure everything is complete.
                  </p>
                  {application.status === 'assessment' && (
                    <Badge className="mt-3 bg-yellow-100 text-yellow-800">Current Stage</Badge>
                  )}
                  <div className="mt-3">
                    {application.status === 'submitted' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate('assessment')}
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                        Start Assessment
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className={`relative border-l-2 pl-8 py-4 ml-4 ${application.status === 'submitted_to_school' || application.status === 'decision' || application.status === 'enrolled' ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className={`absolute w-8 h-8 rounded-full -left-[17px] -top-1 flex items-center justify-center ${application.status === 'submitted_to_school' || application.status === 'decision' || application.status === 'enrolled' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    {application.status === 'submitted_to_school' || application.status === 'decision' || application.status === 'enrolled' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-medium">3</span>
                    )}
                  </div>
                  <h3 className="font-medium text-lg">Submitted to School</h3>
                  <p className="text-gray-600 mt-1">
                    Your complete application has been sent to the university for review and consideration.
                  </p>
                  {application.status === 'submitted_to_school' && (
                    <Badge className="mt-3 bg-yellow-100 text-yellow-800">Current Stage</Badge>
                  )}
                  <div className="mt-3">
                    {application.status === 'assessment' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate('submitted_to_school')}
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                        Mark as Submitted to School
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className={`relative border-l-2 pl-8 py-4 ml-4 ${application.status === 'decision' || application.status === 'enrolled' ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className={`absolute w-8 h-8 rounded-full -left-[17px] -top-1 flex items-center justify-center ${application.status === 'decision' || application.status === 'enrolled' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    {application.status === 'decision' || application.status === 'enrolled' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-medium">4</span>
                    )}
                  </div>
                  <h3 className="font-medium text-lg">Decision</h3>
                  <p className="text-gray-600 mt-1">
                    The university is making a decision on your application.
                  </p>
                  {application.status === 'decision' && (
                    <Badge className="mt-3 bg-yellow-100 text-yellow-800">Current Stage</Badge>
                  )}
                  <div className="mt-3">
                    {application.status === 'submitted_to_school' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate('decision')}
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                        Decision in Progress
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className={`relative border-l-2 pl-8 py-4 ml-4 ${application.status === 'enrolled' ? 'border-blue-500' : 'border-gray-300'}`}>
                  <div className={`absolute w-8 h-8 rounded-full -left-[17px] -top-1 flex items-center justify-center ${application.status === 'enrolled' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    {application.status === 'enrolled' ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-medium">5</span>
                    )}
                  </div>
                  <h3 className="font-medium text-lg">Enrolled</h3>
                  <p className="text-gray-600 mt-1">
                    Congratulations! You've been accepted and enrolled in the programme.
                  </p>
                  {application.status === 'enrolled' && (
                    <Badge className="mt-3 bg-yellow-100 text-yellow-800">Current Stage</Badge>
                  )}
                  <div className="mt-3">
                    {application.status === 'decision' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusUpdate('enrolled')}
                        disabled={updateStatusMutation.isPending}
                      >
                        {updateStatusMutation.isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                        Mark as Enrolled
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDetailsPage;