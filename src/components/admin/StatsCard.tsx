
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  bgColor?: string;
  labelColor?: string;
  valueColor?: string;
  showShadow?: boolean;
}

const StatsCard = ({
  title,
  value,
  icon,
  description,
  iconColor = "text-primary",
  trend,
  trendValue,
  bgColor = "bg-white",
  labelColor = "text-muted-foreground",
  valueColor = "text-foreground",
  showShadow = true
}: StatsCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    return trend === 'up' ? (
      <span className="text-green-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        {trendValue}
      </span>
    ) : trend === 'down' ? (
      <span className="text-red-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {trendValue}
      </span>
    ) : (
      <span className="text-gray-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
        </svg>
        {trendValue}
      </span>
    );
  };

  return (
    <Card className={`${bgColor} transition-all ${showShadow ? 'hover:shadow-md' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm ${labelColor}`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`mr-2 p-2 rounded-lg bg-primary/10 ${iconColor}`}>{icon}</div>
            <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
          </div>
          {getTrendIcon()}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
