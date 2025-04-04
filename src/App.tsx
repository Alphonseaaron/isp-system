
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import ActiveSession from "./pages/ActiveSession";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import WifiLandingPage from "@/components/WifiLandingPage";
import { PackagesProvider, usePackages } from "./contexts/PackagesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";

// Move the QueryClient instantiation inside the component
const App = () => {
  // Create a client
  const queryClient = new QueryClient();
  
  // Initialize offline persistence for Firestore
  useEffect(() => {
    // Check if the app is online
    if (navigator.onLine) {
      console.log("App is online and ready to use Firebase services");
    } else {
      console.log("App is offline. Some functionality may be limited");
    }
  }, []);
  
  const WifiRouteWrapper = () => {
    const { packages } = usePackages();
    return <WifiLandingPage packages={packages} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <PackagesProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/wifi" element={<WifiRouteWrapper />} />
                  <Route path="/active-session" element={<ActiveSession />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </PackagesProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
