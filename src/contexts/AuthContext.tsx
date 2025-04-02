
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChange, logoutUser } from "@/services/firebase";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  loading: boolean;
  login: (email: string, isAdmin: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
        } else {
          // Check if the user is a regular admin (in a real app, this would query Firestore)
          setIsAdmin(true); // For demo purposes, all authenticated users are admins
        }
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, isAdmin: boolean) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setIsAdmin(isAdmin);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUserEmail(null);
      setIsAdmin(false);
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
