
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Package } from "@/contexts/PackagesContext";
import { Wifi, Clock } from "lucide-react";

interface SessionTimerProps {
  package: Package;
  startTime: Date;
  endTime: Date;
  onBuyMore?: () => void;
}

const SessionTimer = ({ package: pkg, startTime, endTime, onBuyMore }: SessionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const total = endTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      
      if (now > endTime) {
        setTimeLeft(0);
        setProgress(0);
        return;
      }
      
      const remaining = endTime.getTime() - now.getTime();
      setTimeLeft(Math.floor(remaining / 1000));
      
      // Calculate progress percentage
      const progressPercent = 100 - (elapsed / total * 100);
      setProgress(Math.max(0, Math.min(100, progressPercent)));
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="wifi-pulse">
            <Wifi className="text-primary h-6 w-6" />
          </div>
          <div>
            <CardTitle>Active Session</CardTitle>
            <CardDescription>
              {pkg.name} ({pkg.duration} {pkg.durationUnit})
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Time Remaining</span>
          </div>
          <div className="text-lg font-medium">{formatTime(timeLeft)}</div>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Started: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span>
            Ends: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {onBuyMore && (
          <Button variant="outline" className="w-full mt-2" onClick={onBuyMore}>
            Buy More Time
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionTimer;
