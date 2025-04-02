
import { useState } from "react";
import { Package } from "@/contexts/PackagesContext";
import { useNavigate } from "react-router-dom";
import { Wifi, Download, Upload, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import PhoneInput from "@/components/PhoneInput";

interface WifiLandingPageProps {
  packages: Package[];
}

const WifiLandingPage = ({ packages }: WifiLandingPageProps) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "airtel" | "sasapay">("mpesa");

  const popularPackage = packages.find((pkg) => pkg.popular) || packages[0];

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsPaymentOpen(true);
  };

  const handlePaymentSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an API to process payment
    toast({
      title: "Payment Processing",
      description: "Your payment is being processed. You will receive an SMS shortly.",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full wifi-pulse">
              <Wifi className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">BREAMT WiFi</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
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
                  <Card 
                    key={pkg.id} 
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      pkg.popular ? "border-primary border-2" : ""
                    }`}
                  >
                    <CardHeader className="bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between items-center">
                        <CardTitle>{pkg.name}</CardTitle>
                        {pkg.popular && (
                          <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                            Popular
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {pkg.duration} {pkg.durationUnit}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold mb-6">KSH {pkg.price}</div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center text-gray-600 dark:text-gray-400">
                            <Download className="h-4 w-4 mr-2" />
                            Download Speed
                          </span>
                          <span className="font-medium">
                            {pkg.downloadSpeed} - {pkg.maxDownloadSpeed} Mbps
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(pkg.downloadSpeed / 20) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center text-gray-600 dark:text-gray-400">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Speed
                          </span>
                          <span className="font-medium">
                            {pkg.uploadSpeed} - {pkg.maxUploadSpeed} Mbps
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${(pkg.maxDownloadSpeed / 30) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {pkg.duration} {pkg.durationUnit} of browsing time
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {pkg.description}
                      </p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 dark:bg-gray-800">
                      <Button 
                        className="w-full" 
                        onClick={() => handleSelectPackage(pkg)}
                      >
                        Select Package
                      </Button>
                    </CardFooter>
                  </Card>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Search for "BREAMT WiFi" in your device's WiFi settings and connect to it.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">2. Select Your Package</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose a WiFi package that suits your needs from our available options.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">3. Make Payment</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pay using M-Pesa, Airtel Money, or SASAPay. You'll receive login credentials via SMS.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">4. Start Browsing</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              {selectedPackage && `${selectedPackage.name} - KSH ${selectedPackage.price}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (for payment)</Label>
              <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={paymentMethod === "mpesa" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPaymentMethod("mpesa")}
                >
                  M-Pesa
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "airtel" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPaymentMethod("airtel")}
                >
                  Airtel
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "sasapay" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPaymentMethod("sasapay")}
                >
                  SASAPay
                </Button>
              </div>
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
