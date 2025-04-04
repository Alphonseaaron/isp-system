
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package } from "@/contexts/PackagesContext";
import { Loader2, CheckCircle2, Phone } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import PhoneInput from "@/components/PhoneInput";
import { saveTransaction } from "@/services/firebase";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package | null;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onSuccess: () => void;
}

type PaymentStatus = "pending" | "processing" | "success" | "failed";

const PaymentModal = ({
  isOpen,
  onClose,
  selectedPackage,
  phoneNumber,
  onPhoneNumberChange,
  onSuccess,
}: PaymentModalProps) => {
  const [status, setStatus] = useState<PaymentStatus>("pending");

  // Guard clause to prevent errors when selectedPackage is null
  if (!selectedPackage) return null;

  const initiatePayment = async () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }
    
    setStatus("processing");
    
    try {
      // Save transaction to Firestore
      await saveTransaction({
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        amount: selectedPackage.price,
        phoneNumber: phoneNumber,
        paymentMethod: "M-Pesa",
      });
      
      // In a real implementation, we would call the M-Pesa API here
      // For M-Pesa STK Push integration, we would use the Daraja API
      // This would include:
      // 1. Initiating the STK push
      // 2. Sending the payment request to the user's phone
      // 3. Waiting for confirmation from M-Pesa
      
      // For demo purposes, just simulate successful payment after a delay
      setTimeout(() => {
        setStatus("success");
        toast({
          title: "Payment Successful",
          description: `You now have access to WiFi!`,
        });
        
        // After 2 seconds, close the modal and trigger success callback
        setTimeout(() => {
          onSuccess();
          setStatus("pending"); // Reset for next time
          onClose();
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("failed");
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderContent = () => {
    switch (status) {
      case "pending":
        return (
          <>
            <DialogHeader>
              <DialogTitle>M-Pesa Payment</DialogTitle>
              <DialogDescription>
                Enter your phone number to receive an M-Pesa payment request
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Package:</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {selectedPackage.duration} {selectedPackage.durationUnit}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="font-bold text-primary">KSH {selectedPackage.price}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="text-green-600 h-5 w-5" />
                  <span className="font-medium">Pay with M-Pesa</span>
                </div>
                <PhoneInput 
                  value={phoneNumber} 
                  onChange={onPhoneNumberChange} 
                />
                <p className="text-xs text-muted-foreground">
                  You will receive an M-Pesa prompt on this number
                </p>
              </div>
              
              <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm">
                <p className="mt-1">
                  1. Enter your phone number above<br />
                  2. Click "Pay Now" to receive an M-Pesa STK push<br />
                  3. Enter your M-Pesa PIN when prompted on your phone
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={initiatePayment} className="bg-green-600 hover:bg-green-700">
                Pay Now with M-Pesa
              </Button>
            </DialogFooter>
          </>
        );
      
      case "processing":
        return (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <DialogTitle className="text-center mb-2">Processing Payment</DialogTitle>
            <DialogDescription className="text-center">
              Please check your phone for the M-Pesa prompt and enter your PIN
            </DialogDescription>
          </div>
        );
      
      case "success":
        return (
          <div className="py-8 flex flex-col items-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
            <DialogTitle className="text-center mb-2">Payment Successful</DialogTitle>
            <DialogDescription className="text-center">
              Your WiFi access is being activated. You'll be connected shortly.
            </DialogDescription>
          </div>
        );
      
      case "failed":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Payment Failed</DialogTitle>
              <DialogDescription>
                We couldn't process your payment. Please try again.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={initiatePayment}>Try Again</Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
