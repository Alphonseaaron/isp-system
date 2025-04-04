
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package } from "@/contexts/PackagesContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Clock, ArrowLeft } from "lucide-react";
import SessionTimer from "@/components/SessionTimer";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const ActiveSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userEmail } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<{
    package: Package;
    startTime: Date;
    endTime: Date;
  } | null>(null);

  useEffect(() => {
    // Get session info from location state or localStorage
    if (location.state?.sessionInfo) {
      setSessionInfo(location.state.sessionInfo);
      // Save to localStorage for persistence
      localStorage.setItem('wifiSessionInfo', JSON.stringify(location.state.sessionInfo));
    } else {
      // Try to get from localStorage
      const savedSession = localStorage.getItem('wifiSessionInfo');
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        // Convert string dates back to Date objects
        parsedSession.startTime = new Date(parsedSession.startTime);
        parsedSession.endTime = new Date(parsedSession.endTime);
        setSessionInfo(parsedSession);
      } else {
        // No active session, redirect to home
        navigate('/');
      }
    }
  }, [location, navigate]);

  const handleBuyMore = () => {
    navigate('/');
  };

  const handleDisconnect = () => {
    // Clear session data
    localStorage.removeItem('wifiSessionInfo');
    navigate('/');
  };

  if (!sessionInfo) {
    return <div className="p-12 text-center">Loading session information...</div>;
  }

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
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6 flex items-center" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to packages
          </Button>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary p-3 rounded-full">
                <Wifi className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">You're Connected!</h1>
            <p className="text-muted-foreground">
              You have an active WiFi session. Enjoy browsing!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SessionTimer 
              package={sessionInfo.package}
              startTime={sessionInfo.startTime}
              endTime={sessionInfo.endTime}
              onBuyMore={handleBuyMore}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Connection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{sessionInfo.package.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Speed</span>
                  <span className="font-medium">
                    {sessionInfo.package.downloadSpeed} - {sessionInfo.package.maxDownloadSpeed} Mbps
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium">
                    {sessionInfo.startTime.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">
                    {sessionInfo.endTime.toLocaleString()}
                  </span>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-4"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActiveSession;
