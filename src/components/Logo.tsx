
import { Wifi } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${className}`}>
      <div className="wifi-pulse">
        <Wifi className="text-primary" />
      </div>
      <span>BREAMT <span className="text-primary">WiFi</span></span>
    </div>
  );
};

export default Logo;
