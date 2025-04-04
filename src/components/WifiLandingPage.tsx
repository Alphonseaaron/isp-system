
import { useState } from "react";
import { Package } from "@/contexts/PackagesContext";
import { useNavigate } from "react-router-dom";
import { Wifi, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import PhoneInput from "@/components/PhoneInput";
import PackageCard from "@/components/PackageCard";

interface WifiLandingPageProps {
  packages: Package[];
}

const WifiLandingPage = ({ packages }: WifiLandingPageProps) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsPaymentOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an API to process M-Pesa payment
    toast({
      title: "M-Pesa Request Sent",
      description: "Please check your phone for the M-Pesa prompt.",
    });
    
    setIsPaymentOpen(false);
    
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Welcome to BREAMT WiFi! You are now connected.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full wifi-pulse">
              <Wifi className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">BREAMT WiFi</h1>
          <p className="text-xl text-muted-foreground">
            Fast and reliable internet at your fingertips
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="packages">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="packages">WiFi Packages</TabsTrigger>
              <TabsTrigger value="instructions">Connection Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="packages">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    onPurchase={() => handleSelectPackage(pkg)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="instructions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How to Connect</CardTitle>
                  <CardDescription>
                    Follow these simple steps to connect to BREAMT WiFi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">1. Connect to the WiFi Network</h3>
                    <p className="text-sm text-muted-foreground">
                      Search for "BREAMT WiFi" in your device's WiFi settings and connect to it.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">2. Select Your Package</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a WiFi package that suits your needs from our available options.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">3. Make Payment</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay using M-Pesa. You'll receive a payment prompt on your phone.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">4. Start Browsing</h3>
                    <p className="text-sm text-muted-foreground">
                      Once your payment is confirmed, you'll be automatically connected to the internet.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're experiencing any issues with connecting to our WiFi service, 
                    please contact our support team.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment with M-Pesa</DialogTitle>
            <DialogDescription>
              {selectedPackage && `${selectedPackage.name} - KSH ${selectedPackage.price}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
              <p className="text-xs text-muted-foreground">
                You will receive an M-Pesa prompt on this number.
              </p>
            </div>
            
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
              <p className="font-medium">M-Pesa Payment Instructions:</p>
              <p className="mt-1">
                1. Enter your M-Pesa phone number above<br />
                2. Click "Pay Now" to receive an M-Pesa STK push<br />
                3. Enter your M-Pesa PIN when prompted on your phone<br />
                4. Wait for confirmation message
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit}>
              Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WifiLandingPage;
