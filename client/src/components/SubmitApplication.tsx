import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface SubmitApplicationProps {
  applicationId: number;
}

export const SubmitApplication = ({ applicationId }: SubmitApplicationProps) => {
  const [, navigate] = useLocation();
  const [confirmation, setConfirmation] = useState(false);
  
  const submitMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/applications/${applicationId}`, {
        status: "submitted",
        submissionDate: new Date().toISOString()
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate applications cache
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      
      // Navigate back to applications page with success parameter
      navigate("/app/applications?success=true");
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = () => {
    if (!confirmation) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that all information is accurate before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate();
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Before submitting your application, please review all information carefully. 
          Once submitted, your application will be reviewed by the university's admissions team.
        </p>
        
        <div className="flex items-start space-x-2 pt-4">
          <Checkbox 
            id="confirmation" 
            checked={confirmation}
            onCheckedChange={(checked) => setConfirmation(checked as boolean)}
          />
          <Label
            htmlFor="confirmation"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that all information in my application is accurate and complete.
          </Label>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" type="button" onClick={() => navigate("/app/applications")}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={submitMutation.isPending || !confirmation}
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default SubmitApplication;