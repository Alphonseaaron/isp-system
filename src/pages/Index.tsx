
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PackageCard from "@/components/PackageCard";
import PaymentModal from "@/components/PaymentModal";
import { Package, usePackages } from "@/contexts/PackagesContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const { isAuthenticated, isAdmin, userEmail } = useAuth();
  const navigate = useNavigate();
  const { packages } = usePackages();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // You could show a success message or redirect
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
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
          <h1 className="text-4xl font-bold mb-4">BREAMT WiFi Services</h1>
          <p className="text-xl text-muted-foreground">
            Fast, reliable internet access for all your devices.
            Choose a package that fits your needs.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              name={pkg.name}
              price={pkg.price}
              duration={pkg.duration}
              durationUnit={pkg.durationUnit}
              description={pkg.description || ""}
              popular={pkg.popular}
              onSelectPackage={() => handleSelectPackage(pkg)}
            />
          ))}
        </section>
      </main>

      {selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          selectedPackage={selectedPackage}
          phoneNumber={phoneNumber}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BREAMT WiFi Services. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
