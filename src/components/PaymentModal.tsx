
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
import { User } from "@/contexts/AuthContext";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package | null;
  phoneNumber: string;
  onSuccess: (packageId: string) => void;
}

type PaymentStatus = "pending" | "processing" | "success" | "failed";

const PaymentModal = ({
  isOpen,
  onClose,
  selectedPackage,
  phoneNumber,
  onSuccess,
}: PaymentModalProps) => {
  const [status, setStatus] = useState<PaymentStatus>("pending");

  if (!selectedPackage) return null;

  const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    
    let formatted = value;
    if (value.length > 4) {
      formatted = `${value.slice(0, 4)} ${value.slice(4)}`;
    }
    if (value.length > 7) {
      formatted = `${formatted.slice(0, 8)} ${formatted.slice(8)}`;
    }
    
    return formatted;
  };

  const handleInitiatePayment = () => {
    setStatus("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      setStatus("success");
      toast({
        title: "Payment Successful",
        description: "You now have access to BREAMT WiFi!",
      });
      
      // After 2 seconds, close the modal
      setTimeout(() => {
        onSuccess(selectedPackage.id);
        onClose();
      }, 2000);
    }, 3000);
  };

  const renderContent = () => {
    switch (status) {
      case "pending":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Payment</DialogTitle>
              <DialogDescription>
                You will receive a payment prompt on your phone.
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
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Phone Number:</span>
                  <span className="font-medium">+254 {formatPhoneNumber(phoneNumber)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="font-bold text-primary">KSH {selectedPackage.price}</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
                <p className="font-medium">Payment Instructions:</p>
                <p className="mt-1">
                  1. Click "Pay Now" to initiate payment<br />
                  2. Enter your M-Pesa PIN when prompted<br />
                  3. Wait for confirmation message
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleInitiatePayment}>Pay Now</Button>
            </DialogFooter>
          </>
        );
      
      case "processing":
        return (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <DialogTitle className="text-center mb-2">Processing Payment</DialogTitle>
            <DialogDescription className="text-center">
              Please enter your M-Pesa PIN when prompted on your phone.
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
              <Button onClick={handleInitiatePayment}>Try Again</Button>
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
