
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  UserPlus,
  Ban,
  Trash,
  History,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  RefreshCcw,
  User
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AdminSubscription } from "@/models/AdminSubscription";
import { useAdminSubscription } from "@/contexts/AdminSubscriptionContext";
import DeviceSelector from "@/components/admin/DeviceSelector";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
  lastLogin?: Date;
}

// Mock admin users data
const mockAdminUsers: AdminUser[] = [
  {
    id: "admin1",
    email: "admin1@example.com",
    name: "Admin User 1",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "admin2",
    email: "admin2@example.com",
    name: "Admin User 2",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    isActive: false,
    lastLogin: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  },
];

const AdminManagement = () => {
  const { subscriptionPlans, adminSubscriptions, renewAdminSubscription, cancelAdminSubscription } = useAdminSubscription();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isSubscriptionHistoryOpen, setIsSubscriptionHistoryOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<AdminSubscription | null>(null);
  const [renewalPlanId, setRenewalPlanId] = useState<string>("");
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    name: "",
    password: "",
    planId: "",
  });

  const filteredAdmins = adminUsers.filter(admin => {
    const matchesSearch = admin.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         admin.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && admin.isActive) ||
      (statusFilter === "inactive" && !admin.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleAddAdmin = () => {
    if (!newAdmin.email || !newAdmin.name || !newAdmin.password || !newAdmin.planId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an API to create a new admin user
    const newAdminUser: AdminUser = {
      id: `admin${adminUsers.length + 1}`,
      email: newAdmin.email,
      name: newAdmin.name,
      createdAt: new Date(),
      isActive: true,
    };

    setAdminUsers([...adminUsers, newAdminUser]);

    toast({
      title: "Admin Added",
      description: `Admin ${newAdmin.name} has been added successfully`,
    });

    setNewAdmin({
      email: "",
      name: "",
      password: "",
      planId: "",
    });
    setIsAddAdminOpen(false);
  };

  const handleToggleAdminStatus = (adminId: string, isActive: boolean) => {
    setAdminUsers(
      adminUsers.map(admin => 
        admin.id === adminId ? { ...admin, isActive: !isActive } : admin
      )
    );

    toast({
      title: isActive ? "Admin Deactivated" : "Admin Activated",
      description: `Admin has been ${isActive ? "deactivated" : "activated"} successfully`,
    });
  };

  const handleDeleteAdmin = (adminId: string) => {
    setAdminUsers(adminUsers.filter(admin => admin.id !== adminId));

    toast({
      title: "Admin Deleted",
      description: "Admin has been deleted successfully",
    });
  };

  const handleViewSubscriptionHistory = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setIsSubscriptionHistoryOpen(true);
  };

  const handleOpenRenewDialog = (subscription: AdminSubscription) => {
    setSelectedSubscription(subscription);
    setRenewalPlanId(subscription.planId);
    setIsRenewDialogOpen(true);
  };

  const handleRenewSubscription = () => {
    if (!selectedSubscription || !renewalPlanId) {
      toast({
        title: "Error",
        description: "Please select a subscription plan",
        variant: "destructive"
      });
      return;
    }

    const plan = subscriptionPlans.find(p => p.id === renewalPlanId);
    if (!plan) return;

    const newEndDate = new Date();
    
    // Add duration based on the plan
    if (plan.durationUnit === 'days') {
      newEndDate.setDate(newEndDate.getDate() + plan.duration);
    } else if (plan.durationUnit === 'months') {
      newEndDate.setMonth(newEndDate.getMonth() + plan.duration);
    } else if (plan.durationUnit === 'years') {
      newEndDate.setFullYear(newEndDate.getFullYear() + plan.duration);
    }

    renewAdminSubscription(selectedSubscription.id, newEndDate);
    setIsRenewDialogOpen(false);
  };

  const getSubscriptionForAdmin = (adminId: string) => {
    return adminSubscriptions.find(sub => sub.adminId === adminId && sub.status === 'active');
  };

  const getSubscriptionPlanName = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    return plan ? plan.name : 'Unknown Plan';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Admins</SelectItem>
              <SelectItem value="active">Active Admins</SelectItem>
              <SelectItem value="inactive">Inactive Admins</SelectItem>
            </SelectContent>
          </Select>

          <DeviceSelector 
            value={selectedDevice} 
            onChange={setSelectedDevice} 
            className="w-[180px] hidden md:flex"
          />
        </div>
        
        <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Admin
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin and assign a subscription plan.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select 
                  value={newAdmin.planId} 
                  onValueChange={(value) => setNewAdmin({...newAdmin, planId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subscription plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptionPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - KSH {plan.price} ({plan.userLimit} users)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin}>
                Add Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="md:hidden mb-4">
        <DeviceSelector 
          value={selectedDevice} 
          onChange={setSelectedDevice} 
          className="w-full"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => {
                const adminSubscription = getSubscriptionForAdmin(admin.id);
                
                return (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      {adminSubscription ? (
                        <div className="space-y-1">
                          <div className="font-medium">
                            {getSubscriptionPlanName(adminSubscription.planId)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Expires: {adminSubscription.endDate.toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No active subscription</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {admin.isActive ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleAdminStatus(admin.id, admin.isActive)}
                        >
                          {admin.isActive ? (
                            <Ban className="h-4 w-4 mr-2 text-amber-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          )}
                          {admin.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          onClick={() => handleViewSubscriptionHistory(admin)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          onClick={() => handleDeleteAdmin(admin.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isSubscriptionHistoryOpen} onOpenChange={setIsSubscriptionHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Subscription History</DialogTitle>
            <DialogDescription>
              {selectedAdmin && `Admin: ${selectedAdmin.name} (${selectedAdmin.email})`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>User Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAdmin && adminSubscriptions
                  .filter(sub => sub.adminId === selectedAdmin.id)
                  .map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>{getSubscriptionPlanName(subscription.planId)}</TableCell>
                      <TableCell>{subscription.startDate.toLocaleDateString()}</TableCell>
                      <TableCell>{subscription.endDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {subscription.status === 'active' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                            Active
                          </span>
                        )}
                        {subscription.status === 'expired' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-600">
                            Expired
                          </span>
                        )}
                        {subscription.status === 'canceled' && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                            Canceled
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{subscription.userCount} users</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {(subscription.status === 'expired' || subscription.status === 'canceled') && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleOpenRenewDialog(subscription)}
                            >
                              <RefreshCcw className="h-4 w-4 mr-2" />
                              Renew
                            </Button>
                          )}
                          {subscription.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => cancelAdminSubscription(subscription.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2 text-destructive" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsSubscriptionHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenewDialogOpen} onOpenChange={setIsRenewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Subscription</DialogTitle>
            <DialogDescription>
              Select a plan to renew this subscription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="renewalPlan">Subscription Plan</Label>
              <Select 
                value={renewalPlanId} 
                onValueChange={setRenewalPlanId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subscription plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - KSH {plan.price} ({plan.userLimit} users)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenewSubscription}>
              Renew Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;
