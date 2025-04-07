
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PackageCard from "@/components/PackageCard";
import PaymentModal from "@/components/PaymentModal";
import { Package, usePackages } from "@/contexts/PackagesContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const { isAuthenticated, isAdmin, userEmail, adminDetails } = useAuth();
  const navigate = useNavigate();
  const { packages, loading } = usePackages();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeSessionInfo, setActiveSessionInfo] = useState<{
    package: Package;
    startTime: Date;
    endTime: Date;
  } | null>(null);

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
    
    // Check for active session in localStorage
    const savedSession = localStorage.getItem('wifiSessionInfo');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        // Convert string dates back to Date objects
        parsedSession.startTime = new Date(parsedSession.startTime);
        parsedSession.endTime = new Date(parsedSession.endTime);
        
        // Only set as active if the session hasn't expired
        if (new Date() < new Date(parsedSession.endTime)) {
          setActiveSessionInfo(parsedSession);
        } else {
          // Clear expired session
          localStorage.removeItem('wifiSessionInfo');
        }
      } catch (error) {
        console.error("Error parsing saved session:", error);
        localStorage.removeItem('wifiSessionInfo');
      }
    }
  }, [isAdmin, navigate]);

  const handleSelectPackage = (pkg: Package) => {
    if (!pkg) {
      toast({
        title: "Error",
        description: "Unable to select package. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (!selectedPackage) return;
    
    // Calculate end time based on package duration
    const startTime = new Date();
    const endTime = new Date(startTime);
    
    if (selectedPackage.durationUnit === 'minutes') {
      endTime.setMinutes(endTime.getMinutes() + selectedPackage.duration);
    } else if (selectedPackage.durationUnit === 'hours') {
      endTime.setHours(endTime.getHours() + selectedPackage.duration);
    } else {
      // days
      endTime.setDate(endTime.getDate() + selectedPackage.duration);
    }
    
    const sessionInfo = {
      package: selectedPackage,
      startTime: startTime,
      endTime: endTime
    };
    
    setShowPaymentModal(false);
    toast({
      title: "Success",
      description: "Your payment was successful. Enjoy your WiFi access!",
    });
    
    // Update active session info locally
    setActiveSessionInfo(sessionInfo);
    
    // Navigate to active session page with session info
    navigate('/active-session', { 
      state: { 
        sessionInfo: sessionInfo
      }
    });
  };

  const handleViewSession = () => {
    if (activeSessionInfo) {
      navigate('/active-session', { 
        state: { 
          sessionInfo: activeSessionInfo
        }
      });
    }
  };

  const isPackageActive = (pkg: Package) => {
    return activeSessionInfo !== null && activeSessionInfo.package.id === pkg.id;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {adminDetails?.companyName ? (
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">{adminDetails.companyName}</span>
              <span className="text-sm ml-2 text-muted-foreground">WiFi Services</span>
            </div>
          ) : (
            <Logo />
          )}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="text-sm text-muted-foreground">
                Logged in as {userEmail}
              </div>
            ) : (
              <Button variant="outline" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {adminDetails?.companyName ? adminDetails.companyName : "BREAMT"} WiFi Services
          </h1>
          <p className="text-xl text-muted-foreground">
            Fast, reliable internet access for all your devices.
            Choose a package that fits your needs.
          </p>
        </section>

        {loading ? (
          <div className="text-center py-12">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">No packages available at the moment.</div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isActive={isPackageActive(pkg)}
                onPurchase={() => handleSelectPackage(pkg)}
                onViewSession={handleViewSession}
              />
            ))}
          </section>
        )}
      </main>

      {selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          selectedPackage={selectedPackage}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {adminDetails?.companyName ? adminDetails.companyName : "BREAMT"} WiFi Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
