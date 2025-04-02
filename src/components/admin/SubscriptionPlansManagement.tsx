
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle,
  Pencil,
  Trash,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";
import { useAdminSubscription } from "@/contexts/AdminSubscriptionContext";
import SubscriptionPlanForm from "./SubscriptionPlanForm";
import DeviceSelector from "@/components/admin/DeviceSelector";

const SubscriptionPlansManagement = () => {
  const { subscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } = useAdminSubscription();
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>("all");

  const handleAddPlan = (planData: any) => {
    addSubscriptionPlan(planData);
    setIsAddPlanOpen(false);
  };

  const handleUpdatePlan = (planData: any) => {
    if (!selectedPlanId) return;
    updateSubscriptionPlan(selectedPlanId, planData);
    setIsEditPlanOpen(false);
    setSelectedPlanId(null);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm("Are you sure you want to delete this subscription plan?")) {
      deleteSubscriptionPlan(planId);
    }
  };

  const handleEditClick = (planId: string) => {
    setSelectedPlanId(planId);
    setIsEditPlanOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold">Subscription Plans</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <DeviceSelector 
            value={selectedDevice} 
            onChange={setSelectedDevice} 
            className="flex-1 md:hidden"
          />
          <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subscription Plan</DialogTitle>
                <DialogDescription>
                  Create a new subscription plan for regular admins
                </DialogDescription>
              </DialogHeader>
              <SubscriptionPlanForm 
                onSave={handleAddPlan}
                onCancel={() => setIsAddPlanOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="md:hidden mb-4">
        <DeviceSelector 
          value={selectedDevice} 
          onChange={setSelectedDevice} 
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && (
                  <Badge variant="secondary">Popular</Badge>
                )}
              </div>
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
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
            <CardFooter className="border-t px-6 py-4 bg-muted/50 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEditClick(plan.id)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeletePlan(plan.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>
              Update the selected subscription plan
            </DialogDescription>
          </DialogHeader>
          <SubscriptionPlanForm 
            initialData={subscriptionPlans.find(p => p.id === selectedPlanId)}
            onSave={handleUpdatePlan}
            onCancel={() => setIsEditPlanOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansManagement;
