
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CreditCard, 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  ArrowUpRight,
  RefreshCcw,
  Clock,
  BarChart
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAdminSubscription } from "@/contexts/AdminSubscriptionContext";

const MySubscription = () => {
  const { subscriptionPlans, adminSubscriptions } = useAdminSubscription();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  
  // For demo purposes, assume the currently logged in admin is admin1
  const currentAdminId = "admin1";
  const currentSubscription = adminSubscriptions.find(
    sub => sub.adminId === currentAdminId && sub.status === 'active'
  );
  
  const currentPlan = currentSubscription 
    ? subscriptionPlans.find(plan => plan.id === currentSubscription.planId)
    : null;

  // Calculate days remaining in subscription
  const daysRemaining = currentSubscription 
    ? Math.max(0, Math.floor((currentSubscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  
  // Calculate percentage of subscription period used
  const subscriptionProgress = currentSubscription 
    ? Math.min(100, 100 - (daysRemaining / 30) * 100) // Assuming 30-day subscription
    : 0;
  
  // Usage statistics
  const userQuotaUsed = currentSubscription ? (currentSubscription.userCount / (currentPlan?.userLimit || 1)) * 100 : 0;

  const handleUpgrade = () => {
    if (!selectedPlanId) {
      toast({
        title: "Error",
        description: "Please select a subscription plan",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would initiate a payment process
    toast({
      title: "Subscription Upgraded",
      description: "Your subscription has been upgraded successfully",
    });
    
    setIsUpgradeDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">My Subscription</h2>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {currentSubscription && currentPlan ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">{currentPlan.name}</div>
                      {currentPlan.popular && <Badge variant="secondary">Popular</Badge>}
                    </div>
                    <div className="text-muted-foreground mt-1">KSH {currentPlan.price} / {currentPlan.durationUnit}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">User Quota</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {currentSubscription.userCount} / {currentPlan.userLimit} users
                      </span>
                      <span className="text-sm font-medium">
                        {userQuotaUsed.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={userQuotaUsed} className="h-2" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {daysRemaining} days remaining
                      </span>
                    </div>
                    <Progress value={subscriptionProgress} className="h-2" />
                    {daysRemaining <= 7 && (
                      <div className="text-amber-500 text-sm flex items-center gap-1 mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Expires soon</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                  <CardDescription>
                    Your current plan features and details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">Started On</span>
                      <span className="font-medium">{currentSubscription.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">Renews On</span>
                      <span className="font-medium">{currentSubscription.endDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">Payment Ref</span>
                      <span className="font-medium">{currentSubscription.paymentRef || "N/A"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                  <div className="text-muted-foreground text-sm">
                    Need more users or features? Upgrade your plan.
                  </div>
                  <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upgrade Your Subscription</DialogTitle>
                        <DialogDescription>
                          Choose a new plan to upgrade your subscription
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="plan">Select Plan</Label>
                          <Select 
                            value={selectedPlanId} 
                            onValueChange={setSelectedPlanId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subscription plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {subscriptionPlans
                                .filter(plan => plan.id !== currentPlan.id)
                                .map((plan) => (
                                  <SelectItem key={plan.id} value={plan.id}>
                                    {plan.name} - KSH {plan.price} ({plan.userLimit} users)
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpgrade}>
                          Upgrade
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Active Subscription</CardTitle>
                <CardDescription>
                  You don't have an active subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Subscription Required</AlertTitle>
                  <AlertDescription>
                    You need an active subscription to access all features of the admin panel.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <CardTitle>{plan.name}</CardTitle>
                          {plan.popular && (
                            <Badge variant="secondary">Popular</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="text-3xl font-bold mb-4">KSH {plan.price}</div>
                        
                        <div className="flex items-center mb-4 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {plan.duration} {plan.durationUnit}
                          </span>
                        </div>
                        
                        <div className="flex items-center mb-4 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-2" />
                          <span>
                            Up to {plan.userLimit} users
                          </span>
                        </div>
                        
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <span className="flex h-2 w-2 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="border-t px-6 py-4 bg-muted/50">
                        <Button 
                          className="w-full"
                          onClick={() => {
                            setSelectedPlanId(plan.id);
                            setIsUpgradeDialogOpen(true);
                          }}
                        >
                          Subscribe
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your previous payments and invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock billing history items */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Business Plan Subscription</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">KSH 1,000</div>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Paid
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Starter Plan Subscription</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">KSH 500</div>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Paid
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MySubscription;
