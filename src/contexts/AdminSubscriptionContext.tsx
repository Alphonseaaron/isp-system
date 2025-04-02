
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AdminSubscriptionPlan, AdminSubscription } from '@/models/AdminSubscription';

interface AdminSubscriptionContextType {
  subscriptionPlans: AdminSubscriptionPlan[];
  adminSubscriptions: AdminSubscription[];
  loading: boolean;
  error: string | null;
  addSubscriptionPlan: (newPlan: Omit<AdminSubscriptionPlan, 'id'>) => void;
  updateSubscriptionPlan: (id: string, planData: Partial<AdminSubscriptionPlan>) => void;
  deleteSubscriptionPlan: (id: string) => void;
  addAdminSubscription: (newSubscription: Omit<AdminSubscription, 'id'>) => void;
  updateAdminSubscription: (id: string, subscriptionData: Partial<AdminSubscription>) => void;
  cancelAdminSubscription: (id: string) => void;
  renewAdminSubscription: (id: string, newEndDate: Date) => void;
}

const AdminSubscriptionContext = createContext<AdminSubscriptionContextType | undefined>(undefined);

// Mock data for subscription plans
const initialSubscriptionPlans: AdminSubscriptionPlan[] = [
  {
    id: '1',
    name: 'Starter Plan',
    price: 500,
    userLimit: 50,
    features: ['WiFi management', 'Basic analytics', 'Email support'],
    duration: 1,
    durationUnit: 'months',
    description: 'Perfect for small businesses',
  },
  {
    id: '2',
    name: 'Business Plan',
    price: 1000,
    userLimit: 100,
    features: ['WiFi management', 'Advanced analytics', 'Priority support', 'Custom branding'],
    duration: 1,
    durationUnit: 'months',
    description: 'Great for growing businesses',
    popular: true,
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    price: 1500,
    userLimit: 200,
    features: ['WiFi management', 'Premium analytics', '24/7 support', 'Custom branding', 'Multiple locations'],
    duration: 1,
    durationUnit: 'months',
    description: 'For large organizations',
  },
];

// Mock data for admin subscriptions
const initialAdminSubscriptions: AdminSubscription[] = [
  {
    id: '1',
    adminId: 'admin1',
    planId: '2',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    status: 'active',
    userCount: 45,
    paymentRef: 'PAY-1234567',
  },
  {
    id: '2',
    adminId: 'admin2',
    planId: '1',
    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'expired',
    userCount: 12,
    paymentRef: 'PAY-7654321',
  },
];

export const AdminSubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<AdminSubscriptionPlan[]>(initialSubscriptionPlans);
  const [adminSubscriptions, setAdminSubscriptions] = useState<AdminSubscription[]>(initialAdminSubscriptions);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // In a real app, this would fetch from Firebase or another backend
  useEffect(() => {
    // Simulating API call
    setLoading(true);
    setTimeout(() => {
      setSubscriptionPlans(initialSubscriptionPlans);
      setAdminSubscriptions(initialAdminSubscriptions);
      setLoading(false);
    }, 500);
  }, []);

  const addSubscriptionPlan = (newPlan: Omit<AdminSubscriptionPlan, 'id'>) => {
    try {
      // In a real app, this would add to Firebase or another backend
      const id = (subscriptionPlans.length + 1).toString();
      setSubscriptionPlans([...subscriptionPlans, { ...newPlan, id }]);
      toast({
        title: "Success",
        description: "Subscription plan added successfully",
      });
    } catch (error) {
      setError("Failed to add subscription plan");
      toast({
        title: "Error",
        description: "Failed to add subscription plan",
        variant: "destructive",
      });
    }
  };

  const updateSubscriptionPlan = (id: string, planData: Partial<AdminSubscriptionPlan>) => {
    try {
      // In a real app, this would update in Firebase or another backend
      setSubscriptionPlans(
        subscriptionPlans.map((plan) =>
          plan.id === id ? { ...plan, ...planData } : plan
        )
      );
      toast({
        title: "Success",
        description: "Subscription plan updated successfully",
      });
    } catch (error) {
      setError("Failed to update subscription plan");
      toast({
        title: "Error",
        description: "Failed to update subscription plan",
        variant: "destructive",
      });
    }
  };

  const deleteSubscriptionPlan = (id: string) => {
    try {
      // In a real app, this would delete from Firebase or another backend
      setSubscriptionPlans(subscriptionPlans.filter((plan) => plan.id !== id));
      toast({
        title: "Success",
        description: "Subscription plan deleted successfully",
      });
    } catch (error) {
      setError("Failed to delete subscription plan");
      toast({
        title: "Error",
        description: "Failed to delete subscription plan",
        variant: "destructive",
      });
    }
  };

  const addAdminSubscription = (newSubscription: Omit<AdminSubscription, 'id'>) => {
    try {
      // In a real app, this would add to Firebase or another backend
      const id = (adminSubscriptions.length + 1).toString();
      setAdminSubscriptions([...adminSubscriptions, { ...newSubscription, id }]);
      toast({
        title: "Success",
        description: "Admin subscription added successfully",
      });
    } catch (error) {
      setError("Failed to add admin subscription");
      toast({
        title: "Error",
        description: "Failed to add admin subscription",
        variant: "destructive",
      });
    }
  };

  const updateAdminSubscription = (id: string, subscriptionData: Partial<AdminSubscription>) => {
    try {
      // In a real app, this would update in Firebase or another backend
      setAdminSubscriptions(
        adminSubscriptions.map((subscription) =>
          subscription.id === id ? { ...subscription, ...subscriptionData } : subscription
        )
      );
      toast({
        title: "Success",
        description: "Admin subscription updated successfully",
      });
    } catch (error) {
      setError("Failed to update admin subscription");
      toast({
        title: "Error",
        description: "Failed to update admin subscription",
        variant: "destructive",
      });
    }
  };

  const cancelAdminSubscription = (id: string) => {
    try {
      // In a real app, this would update in Firebase or another backend
      setAdminSubscriptions(
        adminSubscriptions.map((subscription) =>
          subscription.id === id ? { ...subscription, status: 'canceled' } : subscription
        )
      );
      toast({
        title: "Success",
        description: "Admin subscription canceled successfully",
      });
    } catch (error) {
      setError("Failed to cancel admin subscription");
      toast({
        title: "Error",
        description: "Failed to cancel admin subscription",
        variant: "destructive",
      });
    }
  };

  const renewAdminSubscription = (id: string, newEndDate: Date) => {
    try {
      // In a real app, this would update in Firebase or another backend
      setAdminSubscriptions(
        adminSubscriptions.map((subscription) =>
          subscription.id === id ? 
          { 
            ...subscription, 
            status: 'active',
            endDate: newEndDate 
          } : subscription
        )
      );
      toast({
        title: "Success",
        description: "Admin subscription renewed successfully",
      });
    } catch (error) {
      setError("Failed to renew admin subscription");
      toast({
        title: "Error",
        description: "Failed to renew admin subscription",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminSubscriptionContext.Provider
      value={{
        subscriptionPlans,
        adminSubscriptions,
        loading,
        error,
        addSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
        addAdminSubscription,
        updateAdminSubscription,
        cancelAdminSubscription,
        renewAdminSubscription,
      }}
    >
      {children}
    </AdminSubscriptionContext.Provider>
  );
};

export const useAdminSubscription = () => {
  const context = useContext(AdminSubscriptionContext);
  if (context === undefined) {
    throw new Error('useAdminSubscription must be used within an AdminSubscriptionProvider');
  }
  return context;
};
