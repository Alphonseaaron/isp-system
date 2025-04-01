
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface Package {
  id: string;
  name: string;
  price: number;
  duration: number;
  durationUnit: 'minutes' | 'hours' | 'days';
  description?: string;
  popular?: boolean;
}

interface PackagesContextType {
  packages: Package[];
  loading: boolean;
  error: string | null;
  addPackage: (newPackage: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, packageData: Partial<Package>) => void;
  deletePackage: (id: string) => void;
}

const PackagesContext = createContext<PackagesContextType | undefined>(undefined);

// Mock data for packages
const initialPackages: Package[] = [
  {
    id: '1',
    name: 'Quick Browse',
    price: 20,
    duration: 1,
    durationUnit: 'hours',
    description: 'Perfect for checking emails and quick browsing',
  },
  {
    id: '2',
    name: 'Standard',
    price: 50,
    duration: 3,
    durationUnit: 'hours',
    description: 'Great for longer browsing sessions',
    popular: true,
  },
  {
    id: '3',
    name: 'Half Day',
    price: 100,
    duration: 12,
    durationUnit: 'hours',
    description: 'Ideal for work and entertainment',
  },
  {
    id: '4',
    name: 'Full Day',
    price: 150,
    duration: 1,
    durationUnit: 'days',
    description: 'Unlimited access for a full day',
  },
];

export const PackagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, this would fetch from Firebase
  useEffect(() => {
    // Simulating API call
    setLoading(true);
    setTimeout(() => {
      setPackages(initialPackages);
      setLoading(false);
    }, 500);
  }, []);

  const addPackage = (newPackage: Omit<Package, 'id'>) => {
    try {
      // In a real app, this would add to Firebase
      const id = (packages.length + 1).toString();
      setPackages([...packages, { ...newPackage, id }]);
      toast({
        title: "Success",
        description: "Package added successfully",
      });
    } catch (error) {
      setError("Failed to add package");
      toast({
        title: "Error",
        description: "Failed to add package",
        variant: "destructive",
      });
    }
  };

  const updatePackage = (id: string, packageData: Partial<Package>) => {
    try {
      // In a real app, this would update in Firebase
      setPackages(
        packages.map((pkg) =>
          pkg.id === id ? { ...pkg, ...packageData } : pkg
        )
      );
      toast({
        title: "Success",
        description: "Package updated successfully",
      });
    } catch (error) {
      setError("Failed to update package");
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    }
  };

  const deletePackage = (id: string) => {
    try {
      // In a real app, this would delete from Firebase
      setPackages(packages.filter((pkg) => pkg.id !== id));
      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
    } catch (error) {
      setError("Failed to delete package");
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  return (
    <PackagesContext.Provider
      value={{
        packages,
        loading,
        error,
        addPackage,
        updatePackage,
        deletePackage,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
};

export const usePackages = () => {
  const context = useContext(PackagesContext);
  if (context === undefined) {
    throw new Error('usePackages must be used within a PackagesProvider');
  }
  return context;
};
