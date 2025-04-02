
export interface AdminSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  userLimit: number;
  features: string[];
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  description?: string;
  popular?: boolean;
}

export interface AdminSubscription {
  id: string;
  adminId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'canceled';
  userCount: number;
  paymentRef?: string;
}
