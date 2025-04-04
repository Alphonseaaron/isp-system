
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChange, logoutUser } from "@/services/firebase";
import { toast } from "@/components/ui/use-toast";

export interface AdminDetails {
  companyName?: string;
  subscriptionTier?: string;
  isActive?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  adminDetails: AdminDetails | null;
  loading: boolean;
  login: (email: string, isAdmin: boolean, details?: AdminDetails) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        
        // Super admin check (in a real app, this would check user roles in Firestore)
        // For now, we're hard-coding alphonsemumbo@gmail.com as a super admin
        if (user.email === "alphonsemumbo@gmail.com") {
          setIsAdmin(true);
          setAdminDetails({
            companyName: "BREAMT",
            isActive: true
          });
        } else {
          // Check if the user is a regular admin (in a real app, this would query Firestore)
          setIsAdmin(true); // For demo purposes, all authenticated users are admins
          
          // Mock admin details for regular admins
          // In a real app, this would be fetched from Firestore
          if (user.email?.includes("admin")) {
            setAdminDetails({
              companyName: user.email.split("@")[0].replace("admin", "").toUpperCase() + " Networks",
              subscriptionTier: "Premium",
              isActive: true
            });
          }
        }
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setIsAdmin(false);
        setAdminDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, isAdmin: boolean, details?: AdminDetails) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setIsAdmin(isAdmin);
    if (details) {
      setAdminDetails(details);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUserEmail(null);
      setIsAdmin(false);
      setAdminDetails(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "Something went wrong while logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        userEmail,
        adminDetails,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
