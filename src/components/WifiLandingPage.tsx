
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "@/contexts/PackagesContext";
import Logo from "@/components/Logo";
import PhoneInput from "@/components/PhoneInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import PaymentModal from "./PaymentModal";
import { Router, Wifi, WifiOff, Clock, Upload, Download } from "lucide-react";

interface WifiLandingPageProps {
  packages: Package[];
}

const WifiLandingPage = ({ packages }: WifiLandingPageProps) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [wifiStatus, setWifiStatus] = useState<"connected" | "disconnected" | "checking">("checking");
  const [routerInfo, setRouterInfo] = useState({
    name: "BREAMT WiFi",
    ssid: "BREAMT_HOTSPOT",
    signalStrength: 85
  });
  
  // Simulate checking WiFi connection status on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real implementation, this would check if the device is connected to BREAMT WiFi
      setWifiStatus("connected");
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedPackage) {
      toast({
        title: "No Package Selected",
        description: "Please select a WiFi package",
        variant: "destructive",
      });
      return;
    }
    
    setShowPayment(true);
  };
  
  const handlePaymentSuccess = (packageId: string) => {
    // In a real implementation, this would activate WiFi access
    toast({
      title: "WiFi Activated",
      description: "You are now connected to BREAMT WiFi!",
    });
    
    // Redirect to success page or customer portal
    navigate("/portal");
  };

  const getPopularPackage = () => {
    return packages.find(pkg => pkg.popular) || packages[0];
  };

  const renderWifiStatus = () => {
    if (wifiStatus === "checking") {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Checking WiFi connection...</span>
        </div>
      );
    }
    
    if (wifiStatus === "disconnected") {
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
          <div className="flex items-center">
            <WifiOff className="h-6 w-6 text-amber-500 mr-2" />
            <h3 className="text-lg font-medium text-amber-700">Not Connected to BREAMT WiFi</h3>
          </div>
          <p className="text-amber-600 mt-2">
            Please connect to the "{routerInfo.ssid}" WiFi network to continue.
          </p>
          <div className="mt-4 border border-amber-200 rounded p-3 bg-white">
            <p className="text-sm font-medium">How to connect:</p>
            <ol className="text-sm text-gray-600 mt-1 pl-5 list-decimal">
              <li>Open your device's WiFi settings</li>
              <li>Select the network named "{routerInfo.ssid}"</li>
              <li>If prompted, enter the network password (ask staff)</li>
              <li>Once connected, refresh this page</li>
            </ol>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
        <div className="flex items-center">
          <Wifi className="h-6 w-6 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-green-700">Connected to BREAMT WiFi</h3>
        </div>
        <p className="text-green-600 mt-1">
          You're connected to {routerInfo.name} with signal strength {routerInfo.signalStrength}%.
          Please select a package below to access the internet.
        </p>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6 bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Need help?</span> Call 0712 345 678
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome to BREAMT WiFi</h1>
            <p className="text-muted-foreground">
              Pay for internet access quickly and easily
            </p>
          </div>
          
          {renderWifiStatus()}
          
          <div className="space-y-6">
            <Tabs defaultValue="select">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="select">Select Package</TabsTrigger>
                <TabsTrigger value="info">How It Works</TabsTrigger>
              </TabsList>
              
              <TabsContent value="select" className="pt-4 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Choose Your WiFi Package</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.map((pkg) => (
                      <Card 
                        key={pkg.id} 
                        className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                          selectedPackage?.id === pkg.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold">{pkg.name}</h3>
                              {pkg.popular && (
                                <span className="bg-secondary text-white text-xs rounded-full px-2 py-1">
                                  Popular
                                </span>
                              )}
                            </div>
                            
                            <div className="text-2xl font-bold mb-1">KSH {pkg.price}</div>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              {pkg.duration} {pkg.durationUnit}
                            </div>
                            
                            {/* Show speed info if available */}
                            {(pkg.downloadSpeed || pkg.maxDownloadSpeed) && (
                              <div className="space-y-1 mt-3 pt-3 border-t text-sm">
                                {pkg.downloadSpeed && (
                                  <div className="flex items-center">
                                    <Download className="h-3 w-3 mr-1 text-blue-500" />
                                    <span>Guaranteed: {pkg.downloadSpeed} Mbps</span>
                                  </div>
                                )}
                                {pkg.uploadSpeed && (
                                  <div className="flex items-center">
                                    <Upload className="h-3 w-3 mr-1 text-green-500" />
                                    <span>Upload: {pkg.uploadSpeed} Mbps</span>
                                  </div>
                                )}
                                {pkg.maxDownloadSpeed && (
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <span>Up to {pkg.maxDownloadSpeed} Mbps download</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {selectedPackage?.id === pkg.id && (
                            <div className="bg-primary/10 text-primary text-center py-2 text-sm">
                              Selected
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-2">Your Phone Number</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your phone number to pay and access the internet
                  </p>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <Button className="w-full" size="lg" onClick={handleContinue}>
                  Continue to Payment
                </Button>
              </TabsContent>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4 text-blue-800">How BREAMT WiFi Works</h3>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                          <Wifi className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">1. Connect to BREAMT WiFi</h4>
                        <p className="text-sm text-gray-600">
                          Connect your device to the BREAMT_HOTSPOT WiFi network.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                          <Router className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">2. Choose a Package</h4>
                        <p className="text-sm text-gray-600">
                          Select the WiFi package that suits your needs and budget.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                          <Clock className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">3. Make Payment</h4>
                        <p className="text-sm text-gray-600">
                          Pay securely using M-Pesa, Airtel Money, or SasaPay.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                          <Download className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">4. Access the Internet</h4>
                        <p className="text-sm text-gray-600">
                          Your device will be automatically granted internet access once payment is confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-bold mb-4">Frequently Asked Questions</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">How long does access last?</h4>
                      <p className="text-sm text-gray-600">
                        Access duration depends on your selected package (hours or days).
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">How many devices can I connect?</h4>
                      <p className="text-sm text-gray-600">
                        One payment allows one device to connect. For multiple devices, you'll need multiple purchases.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">What if my connection drops?</h4>
                      <p className="text-sm text-gray-600">
                        Your access time continues even if disconnected. Reconnect to continue using your time.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Need more help?</h4>
                      <p className="text-sm text-gray-600">
                        Contact our support at 0712 345 678 or ask staff on premises.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <Button onClick={() => getPopularPackage() && setSelectedPackage(getPopularPackage())}>
                    Get Started with Popular Package
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        selectedPackage={selectedPackage}
        phoneNumber={phoneNumber}
        onSuccess={handlePaymentSuccess}
      />
      
      <footer className="bg-gray-50 border-t py-4 px-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BREAMT WiFi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WifiLandingPage;
