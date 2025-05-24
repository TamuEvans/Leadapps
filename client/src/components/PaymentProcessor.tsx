import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Check, AlertCircle, Clock, DollarSign, Receipt } from "lucide-react";

interface Payment {
  id: number;
  applicationId?: number;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  description: string;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
  stripePaymentIntentId?: string;
  receiptUrl?: string;
}

interface PaymentProcessorProps {
  applicationId?: number;
  amount: number;
  description: string;
  onPaymentComplete?: (payment: Payment) => void;
}

export default function PaymentProcessor({ 
  applicationId, 
  amount, 
  description, 
  onPaymentComplete 
}: PaymentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { toast } = useToast();

  const { data: paymentHistory = [] } = useQuery({
    queryKey: ['/api/payments/history'],
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest('POST', '/api/payments/create-intent', paymentData);
      return response.json();
    },
    onSuccess: (data) => {
      // In a real implementation, this would integrate with Stripe's client-side SDK
      toast({
        title: "Payment Initiated",
        description: "Redirecting to secure payment page...",
      });
      onPaymentComplete?.(data.payment);
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process payment",
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    setIsProcessing(true);
    
    const paymentData = {
      amount,
      currency: 'USD',
      description,
      applicationId,
      paymentMethod,
    };

    createPaymentMutation.mutate(paymentData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'refunded': return <Receipt className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Payment Description:</span>
              <span className="text-gray-700">{description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount:</span>
              <span className="text-2xl font-bold text-green-600">
                ${amount.toFixed(2)} USD
              </span>
            </div>
            {applicationId && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Application ID:</span>
                <span className="text-gray-700">#{applicationId}</span>
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-1 gap-2">
              <div 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details Form (Placeholder for Stripe integration) */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Secure payment processing powered by Stripe
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="font-mono"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardholder-name">Cardholder Name</Label>
                  <Input
                    id="cardholder-name"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || createPaymentMutation.isPending}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isProcessing || createPaymentMutation.isPending ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5 mr-2" />
                Pay ${amount.toFixed(2)} USD
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your payment information is secure and encrypted. We do not store your card details.
          </p>
        </CardContent>
      </Card>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-600" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentHistory.map((payment: Payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{payment.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                      {payment.paidAt && ` • Paid: ${new Date(payment.paidAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">
                    ${payment.amount.toFixed(2)} {payment.currency}
                  </p>
                  <Badge className={getStatusColor(payment.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(payment.status)}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Secure Payment Processing</h4>
              <p className="text-xs text-gray-600 mt-1">
                All payments are processed securely through Stripe. Your financial information is protected with industry-standard encryption and is never stored on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}