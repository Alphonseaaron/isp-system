
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { usePackages, Package } from "@/contexts/PackagesContext";
import { useAuth } from "@/contexts/AuthContext";
import PackageCard from "@/components/PackageCard";
import PhoneInput from "@/components/PhoneInput";
import OtpInput from "@/components/OtpInput";
import PaymentModal from "@/components/PaymentModal";
import SessionTimer from "@/components/SessionTimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Loader2, LogOut } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { packages, loading: packagesLoading } = usePackages();
  const { currentUser, loginWithPhone, verifyCode, logout, isAdmin, loading: authLoading } = useAuth();
  
  const [step, setStep] = useState<"select" | "phone" | "otp" | "activeSession">("select");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeSessionData, setActiveSessionData] = useState<{
    packageId: string;
    startTime: Date;
    endTime: Date;
  } | null>(null);

  // Check if user has an active session
  useEffect(() => {
    if (currentUser?.activeSession && currentUser.activeSession.status === 'active') {
      const { packageId, startTime, endTime } = currentUser.activeSession;
      setActiveSessionData({
        packageId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });
      setStep("activeSession");
    } else if (isAdmin) {
      navigate("/admin");
    }
  }, [currentUser, isAdmin, navigate]);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      toast({
        title: "Selection Required",
        description: "Please select a package to continue",
        variant: "destructive",
      });
      return;
    }
    
    setStep("phone");
  };

  const handlePhoneSubmit = async () => {
    if (phone.length < 9) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    
    setPhoneError("");
    // For demo purposes, we'll skip the OTP verification and show payment modal directly
    setShowPaymentModal(true);
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 6) {
      setOtpError("Please enter the complete verification code");
      return;
    }
    
    setOtpError("");
    try {
      await verifyCode(otp);
      
      if (isAdmin) {
        navigate("/admin");
      } else {
        // If it's a regular user, show payment modal
        setShowPaymentModal(true);
      }
    } catch (error) {
      setOtpError("Invalid verification code");
    }
  };

  const handlePaymentSuccess = (packageId: string) => {
    // Create active session
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;
    
    const startTime = new Date();
    const endTime = new Date();
    
    // Calculate end time based on package duration
    if (pkg.durationUnit === 'minutes') {
      endTime.setMinutes(endTime.getMinutes() + pkg.duration);
    } else if (pkg.durationUnit === 'hours') {
      endTime.setHours(endTime.getHours() + pkg.duration);
    } else {
      endTime.setDate(endTime.getDate() + pkg.duration);
    }
    
    setActiveSessionData({
      packageId: pkg.id,
      startTime,
      endTime,
    });
    
    setStep("activeSession");
  };

  const handleBuyMore = () => {
    setStep("select");
    setSelectedPackage(null);
    setActiveSessionData(null);
  };

  const handleLogout = () => {
    logout();
    setStep("select");
    setSelectedPackage(null);
    setActiveSessionData(null);
    setPhone("");
    setOtp("");
  };

  const handleAdminLogin = () => {
    // For demo purposes, directly log in as admin
    verifyCode('123456');
  };

  const renderContent = () => {
    if (packagesLoading || authLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    }

    switch (step) {
      case "select":
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Select a WiFi Package
              </h1>
              <p className="text-muted-foreground">
                Choose the package that suits your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  isSelected={selectedPackage?.id === pkg.id}
                  onSelect={handlePackageSelect}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={handleContinue}>
                Continue
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleAdminLogin}
              >
                Admin Login
              </Button>
            </div>
          </div>
        );

      case "phone":
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Enter Your Phone Number
              </h1>
              <p className="text-muted-foreground">
                We'll use this to process your payment
              </p>
            </div>

            <PhoneInput
              value={phone}
              onChange={setPhone}
              error={phoneError}
            />

            <div className="flex flex-col gap-2">
              <Button onClick={handlePhoneSubmit}>
                Continue to Payment
              </Button>
              <Button variant="ghost" onClick={() => setStep("select")}>
                Back
              </Button>
            </div>
          </div>
        );

      case "otp":
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Enter Verification Code
              </h1>
              <p className="text-muted-foreground">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            <OtpInput
              value={otp}
              onChange={setOtp}
              error={otpError}
            />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Didn't receive the code?{" "}
              </span>
              <button
                className="text-primary hover:underline"
                onClick={() => {
                  setOtp("");
                  loginWithPhone(phone);
                  toast({
                    title: "Code Resent",
                    description: "A new verification code has been sent to your phone",
                  });
                }}
              >
                Resend
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleOtpSubmit}>Verify</Button>
              <Button variant="ghost" onClick={() => setStep("phone")}>
                Back
              </Button>
            </div>
          </div>
        );

      case "activeSession":
        if (!activeSessionData) return null;
        
        const activePackage = packages.find(p => p.id === activeSessionData.packageId);
        if (!activePackage) return null;
        
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-2xl font-bold tracking-tight">
                Connected to BREAMT WiFi
              </h1>
              <p className="text-muted-foreground">
                You are now connected to the internet
              </p>
            </div>

            <SessionTimer
              package={activePackage}
              startTime={activeSessionData.startTime}
              endTime={activeSessionData.endTime}
              onBuyMore={handleBuyMore}
            />

            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          {isAdmin && (
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              Admin Panel
            </Button>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4">
        {renderContent()}
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          <p>© 2024 BREAMT WiFi. All rights reserved.</p>
        </div>
      </footer>

      {selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          selectedPackage={selectedPackage}
          phoneNumber={phone}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Index;
