import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Check, 
  CheckCircle,
  ChevronRight, 
  Clock, 
  FileText, 
  Loader2,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast, useToast } from "@/hooks/use-toast";
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
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const { toast } = useToast();
  
  // Submit application mutation
  const submitApplicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/applications/${id}`, { 
        status: "submitted",
        submissionDate: new Date().toISOString(),
        feePaid: true, // Mark fee as paid
        lastUpdated: new Date().toISOString(),
        internalNotes: "Application submitted and ready for CX team review. Application fee paid."
      });
    },
    onSuccess: () => {
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      
      // Redirect to application details page
      navigate(`/app/application/${applicationId}`, { replace: true });
      
      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted and is now under review by our team.",
      });
    },
    onError: (error) => {
      console.error("Error submitting application:", error);
      
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Simulate payment processing
  const processPayment = () => {
    setIsLoading(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setPaymentCompleted(true);
      setIsLoading(false);
      
      // Automatically submit the application after payment
      submitApplicationMutation.mutate(applicationId);
    }, 1500);
  };
  
  const handleSubmitApplication = async () => {
    // Show payment form first
    setShowPaymentForm(true);
  };
  
  return (
    <div className="space-y-6">
      {!showPaymentForm ? (
        <>
          <div className="text-sm text-gray-500 mb-4">
            <p className="mb-2">You are about to submit your application to the institution for review.</p>
            <p>Once submitted, your application will be processed by the admissions team.</p>
            <p className="mt-2 font-medium">An application fee of $50.00 is required to proceed.</p>
          </div>

          <Button 
            onClick={handleSubmitApplication}
            className="w-full" 
            disabled={isLoading}
          >
            Continue to Payment
          </Button>
        </>
      ) : (
        <>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Application Fee Payment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please complete the payment to submit your application. This fee is non-refundable.
            </p>
            
            {!paymentCompleted ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Smith"
                        className="w-full p-2 border rounded"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full p-2 border rounded"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiration Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full p-2 border rounded"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full p-2 border rounded"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-medium">
                      <span>Application Fee:</span>
                      <span>$50.00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPaymentForm(false)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={processPayment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Processing...
                      </>
                    ) : (
                      "Pay & Submit Application"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">Payment Successful!</h3>
                <p className="text-gray-600">Your application is being submitted...</p>
              </div>
            )}
          </div>
        </>
      )}
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

  // Define Application type
  interface Application {
    id: number;
    programId: number;
    programName?: string;
    universityName?: string;
    universityLocation?: string;
    universityLogo?: string;
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
    intakePeriod?: string;
    intakeYear?: number;
  }

  // Fetch applications data
  const { data: applications = [], isLoading, refetch } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    retry: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
  
  // Effect to handle URL parameters and trigger refetches
  useEffect(() => {
    // Handle success parameter
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const fromSearch = urlParams.get('from') === 'search';
    
    if (success === 'true') {
      setSuccessMessage("Your application has been successfully submitted for review!");
      
      // Clear the URL parameters after reading them
      navigate("/app/applications", { replace: true });
      
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      refetch();
    }
    
    // If coming from search, force a refetch
    if (fromSearch) {
      // Clear the URL parameter
      navigate("/app/applications", { replace: true });
      
      // Force a delay and refetch
      setTimeout(() => {
        refetch();
      }, 300);
    }
  }, [location, navigate, refetch]);
  
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
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-400 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-300 to-blue-400 rounded-full opacity-20 blur-xl"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-2">📚 My Applications</h1>
          <p className="text-xl text-white/90">Track your university application progress and manage submissions</p>
        </div>
      </div>
      
      {successMessage && (
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-lg">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800 font-bold">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {deleteMessage && (
        <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 rounded-2xl shadow-lg">
          <Check className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800 font-bold">Success!</AlertTitle>
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
        <Card className="rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-blue-50 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Applications Yet</h2>
            <p className="max-w-md mx-auto text-gray-600 leading-relaxed mb-6">
              You haven't submitted any applications yet. Complete your profile and search for programmes to begin your application process.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl px-8 py-3 shadow-lg">
              Search Programs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <Card key={application.id} className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-lg">
                      {application.universityLogo ? (
                        <img 
                          src={application.universityLogo} 
                          alt={`${application.universityName} logo`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-800 mb-1">{application.programName}</CardTitle>
                      <CardDescription className="text-gray-600 font-medium">
                        {application.universityName}, {application.universityLocation}
                      </CardDescription>
                    </div>
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
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Intake Period</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Term</p>
                      <p className="font-medium">
                        {application.intakePeriod || 
                          (application.status === 'draft' ? 
                            <span className="text-amber-600">Not selected yet</span> : 
                            <span className="text-gray-500">Not specified</span>
                          )
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Year</p>
                      <p className="font-medium">
                        {application.intakeYear || 
                          (application.status === 'draft' ? 
                            <span className="text-amber-600">Not selected yet</span> : 
                            <span className="text-gray-500">Not specified</span>
                          )
                        }
                      </p>
                    </div>
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
                <div className="flex gap-2">
                  {application.status === 'draft' ? (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/app/application/${application.id}`)}
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button 
                        onClick={() => handleSubmitClick(application)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Submit Application
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/app/application/${application.id}`)}
                    >
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
