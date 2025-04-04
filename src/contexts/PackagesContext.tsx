
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getPackages, savePackage, updatePackage, deletePackage } from '@/services/firebase';

export interface Package {
  id: string;
  name: string;
  price: number;
  duration: number;
  durationUnit: 'minutes' | 'hours' | 'days';
  description?: string;
  popular?: boolean;
  downloadSpeed?: number;
  uploadSpeed?: number;
  maxDownloadSpeed?: number;
  maxUploadSpeed?: number;
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

// Mock data for packages - will be used if Firestore fetch fails
const initialPackages: Package[] = [
  {
    id: '1',
    name: 'Quick Browse',
    price: 20,
    duration: 1,
    durationUnit: 'hours',
    description: 'Perfect for checking emails and quick browsing',
    downloadSpeed: 1,
    uploadSpeed: 0.5,
    maxDownloadSpeed: 2,
    maxUploadSpeed: 1
  },
  {
    id: '2',
    name: 'Standard',
    price: 50,
    duration: 3,
    durationUnit: 'hours',
    description: 'Great for longer browsing sessions',
    popular: true,
    downloadSpeed: 2,
    uploadSpeed: 1,
    maxDownloadSpeed: 5,
    maxUploadSpeed: 2
  },
  {
    id: '3',
    name: 'Half Day',
    price: 100,
    duration: 12,
    durationUnit: 'hours',
    description: 'Ideal for work and entertainment',
    downloadSpeed: 5,
    uploadSpeed: 2,
    maxDownloadSpeed: 10,
    maxUploadSpeed: 5
  },
  {
    id: '4',
    name: 'Full Day',
    price: 150,
    duration: 1,
    durationUnit: 'days',
    description: 'Unlimited access for a full day',
    downloadSpeed: 10,
    uploadSpeed: 5,
    maxDownloadSpeed: 20,
    maxUploadSpeed: 10
  },
];

export const PackagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch packages from Firestore
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const firestorePackages = await getPackages();
        
        if (firestorePackages && firestorePackages.length > 0) {
          // Convert Firestore data to Package type
          const typedPackages = firestorePackages.map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            price: Number(pkg.price),
            duration: Number(pkg.duration),
            durationUnit: pkg.durationUnit as 'minutes' | 'hours' | 'days',
            description: pkg.description,
            popular: pkg.popular || false,
            downloadSpeed: pkg.downloadSpeed ? Number(pkg.downloadSpeed) : undefined,
            uploadSpeed: pkg.uploadSpeed ? Number(pkg.uploadSpeed) : undefined,
            maxDownloadSpeed: pkg.maxDownloadSpeed ? Number(pkg.maxDownloadSpeed) : undefined,
            maxUploadSpeed: pkg.maxUploadSpeed ? Number(pkg.maxUploadSpeed) : undefined,
          }));
          setPackages(typedPackages);
        } else {
          // If no packages in Firestore, use initial data
          setPackages(initialPackages);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
        setError("Failed to load packages");
        // Fallback to initial packages
        setPackages(initialPackages);
        toast({
          title: "Warning",
          description: "Using default packages as we couldn't connect to the database",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const addPackageHandler = async (newPackage: Omit<Package, 'id'>) => {
    try {
      setLoading(true);
      const addedPackage = await savePackage(newPackage);
      setPackages(prev => [...prev, addedPackage as Package]);
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
    } finally {
      setLoading(false);
    }
  };

  const updatePackageHandler = async (id: string, packageData: Partial<Package>) => {
    try {
      setLoading(true);
      await updatePackage(id, packageData);
      setPackages(prev => 
        prev.map(pkg => pkg.id === id ? { ...pkg, ...packageData } : pkg)
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
    } finally {
      setLoading(false);
    }
  };

  const deletePackageHandler = async (id: string) => {
    try {
      setLoading(true);
      await deletePackage(id);
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <PackagesContext.Provider
      value={{
        packages,
        loading,
        error,
        addPackage: addPackageHandler,
        updatePackage: updatePackageHandler,
        deletePackage: deletePackageHandler,
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
