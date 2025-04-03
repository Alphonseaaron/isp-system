
import { useState } from "react";
import { Package } from "@/contexts/PackagesContext";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PackageCardProps {
  package: Package;
  isSelected?: boolean;
  onSelect?: (pkg: Package) => void;
  onPurchase?: (pkg: Package) => void;
}

const PackageCard = ({
  package: pkg,
  isSelected = false,
  onSelect,
  onPurchase,
}: PackageCardProps) => {
  // Guard clause to prevent errors when pkg is undefined
  if (!pkg) {
    console.warn("Package is undefined in PackageCard");
    return null;
  }
  
  const [isHovered, setIsHovered] = useState(false);

  const formattedDuration = () => {
    if (pkg.durationUnit === 'minutes') {
      return `${pkg.duration} min`;
    } else if (pkg.durationUnit === 'hours') {
      return `${pkg.duration} hr${pkg.duration > 1 ? 's' : ''}`;
    } else {
      return `${pkg.duration} day${pkg.duration > 1 ? 's' : ''}`;
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl p-6 transition-all duration-300 hover:shadow-lg",
        isSelected
          ? "border-2 border-primary bg-accent shadow-md"
          : "border border-border bg-card hover:border-primary/50",
        isHovered && !isSelected && "border-primary/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect && onSelect(pkg)}
    >
      {pkg.popular && (
        <div className="absolute -top-3 right-4 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-white">
          Popular
        </div>
      )}
      <div className="mb-4 text-xl font-bold text-foreground">{pkg.name}</div>
      <div className="mb-4 flex items-baseline">
        <span className="text-3xl font-bold text-primary">KSH {pkg.price}</span>
      </div>

      <div className="mb-6 flex items-center text-sm text-muted-foreground">
        <Clock className="mr-2 h-4 w-4" />
        {formattedDuration()}
      </div>

      <div className="mb-6 text-sm text-muted-foreground">
        {pkg.description}
      </div>

      {isSelected ? (
        <Button 
          className="w-full"
          onClick={() => onPurchase && onPurchase(pkg)}
        >
          Purchase
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onPurchase && onPurchase(pkg)}
        >
          Select
        </Button>
      )}
    </div>
  );
};

export default PackageCard;
