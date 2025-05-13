import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Check, 
  ChevronRight, 
  Clock, 
  FileText, 
  Loader2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Action to submit application
const SubmitApplication = ({ applicationId }: { applicationId: number }) => {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Submit application mutation
  const submitApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/applications/${id}`, { 
        status: "submitted",
        submissionDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      
      // Redirect to applications page with success parameter
      navigate("/app/applications?success=true", { replace: true });
    },
    onError: (error) => {
      console.error("Error submitting application:", error);
    }
  });
  
  const handleSubmitApplication = async () => {
    setIsLoading(true);
    try {
      await submitApplicationMutation.mutateAsync(applicationId);
    } catch (error) {
      console.error("Error in submit handler:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500 mb-4">
        <p className="mb-2">You are about to submit your application to the institution for review.</p>
        <p>Once submitted, your application will be processed by the admissions team.</p>
      </div>

      <Button 
        onClick={handleSubmitApplication}
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Submit Application</>
        )}
      </Button>
    </div>
  );
};

// Main application status badge component
const ApplicationStatusBadge = ({ status }: { status: string }) => {
  let color = "bg-gray-100 text-gray-800";
  let label = status;

  switch (status) {
    case 'draft':
      color = "bg-gray-100 text-gray-800";
      label = "Draft";
      break;
    case 'submitted':
      color = "bg-blue-100 text-blue-800";
      label = "Submitted";
      break;
    // We've removed the payment step
    /*case 'pending_payment':
      color = "bg-orange-100 text-orange-800";
      label = "Payment Required";
      break;*/
    case 'pending_review':
      color = "bg-yellow-100 text-yellow-800";
      label = "Pending Review";
      break;
    case 'under_review':
      color = "bg-indigo-100 text-indigo-800";
      label = "Under Review";
      break;
    case 'accepted':
      color = "bg-green-100 text-green-800";
      label = "Accepted";
      break;
    case 'rejected':
      color = "bg-red-100 text-red-800";
      label = "Rejected";
      break;
    case 'waitlisted':
      color = "bg-purple-100 text-purple-800";
      label = "Waitlisted";
      break;
  }

  return (
    <Badge className={`${color} font-medium`}>{label}</Badge>
  );
};

const Applications = () => {
  const [, params] = useRoute("/app/applications");
  const [location, navigate] = useLocation();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  // Extract success parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    
    if (success === 'true') {
      setSuccessMessage("Your application has been successfully submitted for review!");
      
      // Clear the URL parameters after reading them
      navigate("/app/applications", { replace: true });
      
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    }
  }, [location, navigate]);

  // Define Application type
  interface Application {
    id: number;
    programId: number;
    programName?: string;
    universityName?: string;
    universityLocation?: string;
    studentId: number;
    status: string;
    createdAt: string;
    lastUpdated: string;
    submissionDate: string | null;
    decisionStatus?: string;
    decisionDate?: string;
    applicationFee?: number;
    feePaid?: boolean;
    notes?: string;
    internalNotes?: string;
  }

  // Fetch applications data
  const { data: applications = [], isLoading, refetch } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // Force refetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Delete application mutation
  const deleteApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/applications/${id}`);
    },
    onSuccess: () => {
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      refetch(); // Immediately refetch as well
      
      // Show success message
      setDeleteMessage("Application has been successfully deleted.");
      
      // Clear the message after a few seconds
      setTimeout(() => {
        setDeleteMessage(null);
      }, 5000);
    },
    onError: (error) => {
      toast({
        title: "Error deleting application",
        description: error.message || "There was an error deleting your application. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Open submit dialog for a specific application
  const handleSubmitClick = (application: any) => {
    setCurrentApplication(application);
    setShowSubmitDialog(true);
  };
  
  // Open delete dialog for a specific application
  const handleDeleteClick = (application: any) => {
    setCurrentApplication(application);
    setShowDeleteDialog(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!currentApplication) return;
    
    try {
      await deleteApplicationMutation.mutateAsync(currentApplication.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
      
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {deleteMessage && (
        <Alert className="bg-blue-50 border-blue-200">
          <Check className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Success!</AlertTitle>
          <AlertDescription className="text-blue-700">
            {deleteMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-12 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">No Applications Yet</h2>
            <p className="max-w-md mx-auto">
              You haven't submitted any applications yet. Complete your profile and search for programmes to begin your application process.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{application.programName}</CardTitle>
                    <CardDescription>
                      {application.universityName}, {application.universityLocation}
                    </CardDescription>
                  </div>
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                  <div>
                    <p className="text-sm text-gray-500">Application ID</p>
                    <p className="font-medium">{application.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Applied</p>
                    <p className="font-medium">{application.submissionDate ? formatDate(application.submissionDate) : "Not submitted yet"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(application.lastUpdated)}</p>
                  </div>
                </div>
                
                {application.status === 'draft' && (
                  <Alert className="mt-4 bg-amber-50 border-amber-200">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Ready for Submission</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Your application is ready to be submitted for review. Click the submit button below to continue.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              
              <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50" 
                  onClick={() => handleDeleteClick(application)}
                >
                  Delete Application
                </Button>
                <div>
                  {application.status === 'draft' ? (
                    <Button 
                      onClick={() => handleSubmitClick(application)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Submit Application
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button variant="outline">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Submission Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Application</DialogTitle>
            <DialogDescription>
              Submit your application to {currentApplication?.universityName} for review
            </DialogDescription>
          </DialogHeader>
          
          {currentApplication && (
            <SubmitApplication applicationId={currentApplication.id} />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentApplication && (
            <div className="pt-4 pb-2">
              <p className="text-sm text-gray-600 mb-4">
                You are about to delete your application to:
              </p>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mb-4">
                <p className="font-medium">{currentApplication.programName}</p>
                <p className="text-sm text-gray-600">{currentApplication.universityName}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between gap-4 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applications;
