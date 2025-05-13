import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation, useRoute } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
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

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment form component
const PaymentForm = ({ applicationId, applicationFee }: { applicationId: number, applicationFee: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect to applications page on success
          return_url: window.location.origin + "/app/applications?success=true&applicationId=" + applicationId,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md border border-gray-200 p-4">
        <PaymentElement />
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-500 mb-4">
        <p className="mb-2">You will be charged <strong>${(applicationFee/100).toFixed(2)} USD</strong> for this application fee.</p>
        <p>This payment secures your application submission to the institution.</p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay Application Fee</>
        )}
      </Button>
    </form>
  );
};

// Payment gateway component - wraps the payment form with Elements provider
const PaymentGateway = ({ applicationId, applicationFee }: { applicationId: number, applicationFee: number }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    apiRequest("POST", "/api/create-payment-intent", { 
      applicationId, 
      amount: applicationFee 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch(err => {
        console.error("Error creating payment intent:", err);
      });
  }, [applicationId, applicationFee]);

  return (
    <div>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm applicationId={applicationId} applicationFee={applicationFee} />
        </Elements>
      ) : (
        <div className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
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
    case 'pending_payment':
      color = "bg-orange-100 text-orange-800";
      label = "Payment Required";
      break;
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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Extract success parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const applicationId = urlParams.get('applicationId');
    
    if (success === 'true' && applicationId) {
      setSuccessMessage("Your application fee has been successfully paid! Your application is now submitted for review.");
      
      // Clear the URL parameters after reading them
      navigate("/app/applications", { replace: true });
      
      // Refresh the applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    }
  }, [location, navigate]);

  // Fetch applications data
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/applications"],
    retry: false,
  });

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

  // Open payment dialog for a specific application
  const handlePaymentClick = (application: any) => {
    setCurrentApplication(application);
    setShowPaymentDialog(true);
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
          {applications.map((application: any) => (
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
                
                {application.status === 'pending_payment' && (
                  <Alert className="mt-4 bg-amber-50 border-amber-200">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Payment Required</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Your application fee of ${(application.applicationFee/100).toFixed(2)} USD must be paid to proceed with your application.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              
              <CardFooter className="bg-gray-50 px-6 py-3 flex justify-end">
                {application.status === 'pending_payment' ? (
                  <Button 
                    onClick={() => handlePaymentClick(application)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Pay Application Fee
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button variant="outline">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pay Application Fee</DialogTitle>
            <DialogDescription>
              Complete your payment to submit your application to {currentApplication?.universityName}
            </DialogDescription>
          </DialogHeader>
          
          {currentApplication && (
            <PaymentGateway 
              applicationId={currentApplication.id} 
              applicationFee={currentApplication.applicationFee} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applications;
