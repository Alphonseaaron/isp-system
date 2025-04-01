
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface User {
  phoneNumber: string;
  id: string;
  activeSession?: {
    packageId: string;
    startTime: Date;
    endTime: Date;
    status: 'active' | 'expired';
  };
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  loginWithPhone: (phoneNumber: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check if user is logged in
  useEffect(() => {
    // In a real app, this would check Firebase Auth state
    const savedUser = localStorage.getItem('breamt_user');
    const savedAdmin = localStorage.getItem('breamt_admin');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }
    
    setLoading(false);
  }, []);

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would use Firebase Auth
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a successful phone number submission
      toast({
        title: "Verification code sent",
        description: `A code has been sent to ${phoneNumber}`,
      });
      
      // Store phone number temporarily
      localStorage.setItem('breamt_temp_phone', phoneNumber);
      
      setLoading(false);
    } catch (error) {
      setError("Failed to send verification code");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      });
    }
  };

  const verifyCode = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would verify with Firebase Auth
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for admin code (for demo purposes)
      if (code === '123456') {
        setIsAdmin(true);
        localStorage.setItem('breamt_admin', 'true');
      }
      
      // Get stored phone number
      const phoneNumber = localStorage.getItem('breamt_temp_phone') || '';
      
      // Create a new user
      const newUser: User = {
        phoneNumber,
        id: Date.now().toString(),
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('breamt_user', JSON.stringify(newUser));
      localStorage.removeItem('breamt_temp_phone');
      
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
      
      setLoading(false);
    } catch (error) {
      setError("Invalid verification code");
      setLoading(false);
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    // In a real app, this would sign out from Firebase Auth
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('breamt_user');
    localStorage.removeItem('breamt_admin');
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        loginWithPhone,
        verifyCode,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
