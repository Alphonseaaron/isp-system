
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChange, logoutUser, db } from "@/services/firebase";
import { toast } from "@/components/ui/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        
        try {
          // Check if user has an admin profile in Firestore
          const userDocRef = doc(db, "admins", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // User has admin data in Firestore
            const userData = userDoc.data();
            setIsAdmin(true);
            setAdminDetails({
              companyName: userData.companyName || "BREAMT",
              subscriptionTier: userData.subscriptionTier,
              isActive: userData.isActive !== false // Default to true if not specified
            });
          } else {
            // Super admin check (in a real app, this would check user roles in Firestore)
            // For now, we're hard-coding alphonsemumbo@gmail.com as a super admin
            if (user.email === "alphonsemumbo@gmail.com") {
              setIsAdmin(true);
              setAdminDetails({
                companyName: "BREAMT",
                isActive: true
              });
              
              // Create admin entry for super admin if it doesn't exist
              await setDoc(userDocRef, {
                email: user.email,
                companyName: "BREAMT",
                isActive: true,
                role: "superadmin",
                createdAt: new Date()
              });
            } else if (user.email?.includes("admin")) {
              // Regular admin setup for demo purposes
              setIsAdmin(true);
              
              const companyName = user.email.split("@")[0].replace("admin", "").toUpperCase() + " Networks";
              setAdminDetails({
                companyName: companyName,
                subscriptionTier: "Premium",
                isActive: true
              });
              
              // Create admin entry
              await setDoc(userDocRef, {
                email: user.email,
                companyName: companyName,
                subscriptionTier: "Premium",
                isActive: true,
                role: "admin",
                createdAt: new Date()
              });
            } else {
              // Regular user
              setIsAdmin(false);
              setAdminDetails(null);
            }
          }
        } catch (error) {
          console.error("Error fetching admin details:", error);
          // Fallback to basic authentication
          if (user.email === "alphonsemumbo@gmail.com") {
            setIsAdmin(true);
            setAdminDetails({
              companyName: "BREAMT",
              isActive: true
            });
          } else {
            setIsAdmin(user.email?.includes("admin") || false);
          }
        }
      } else {
        // No user logged in
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
