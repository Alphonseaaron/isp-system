import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePackages, Package } from "@/contexts/PackagesContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LogOut, 
  PlusCircle,
  Pencil,
  Trash
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Import admin dashboard components
import DashboardOverview from "@/components/admin/DashboardOverview";
import UserManagement from "@/components/admin/UserManagement";
import NetworkMonitoring from "@/components/admin/NetworkMonitoring";
import NetworkChart from "@/components/admin/NetworkChart";
import PaymentManagement from "@/components/admin/PaymentManagement";

// Mock user data
const mockUsers = [
  {
    id: "1",
    phoneNumber: "0712345678",
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    totalSessions: 5,
    activeSession: {
      packageId: "2",
      startTime: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      endTime: new Date(Date.now() + 1000 * 60 * 135), // 2:15 hours left
      status: "active",
    },
  },
  {
    id: "2",
    phoneNumber: "0723456789",
    lastActive: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    totalSessions: 2,
    activeSession: {
      packageId: "1",
      startTime: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      endTime: new Date(Date.now() + 1000 * 60 * 50), // 50 minutes left
      status: "active",
    },
  },
  {
    id: "3",
    phoneNumber: "0734567890",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    totalSessions: 8,
    activeSession: null,
  },
];

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    userId: "1",
    packageId: "2",
    amount: 50,
    status: "completed",
    paymentMethod: "M-Pesa",
    transactionRef: "MPESA123456",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
  {
    id: "tx2",
    userId: "2",
    packageId: "1",
    amount: 20,
    status: "completed",
    paymentMethod: "M-Pesa",
    transactionRef: "MPESA123457",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: "tx3",
    userId: "3",
    packageId: "4",
    amount: 150,
    status: "completed",
    paymentMethod: "Airtel Money",
    transactionRef: "AIRTEL123458",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    id: "tx4",
    userId: "1",
    packageId: "3",
    amount: 100,
    status: "failed",
    paymentMethod: "M-Pesa",
    transactionRef: "MPESA123459",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "tx5",
    userId: "3",
    packageId: "2",
    amount: 50,
    status: "completed",
    paymentMethod: "SasaPay",
    transactionRef: "SASA123460",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
  },
];

interface NewPackageFormData {
  name: string;
  price: string;
  duration: string;
  durationUnit: "minutes" | "hours" | "days";
  description: string;
  popular: boolean;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const { packages, addPackage, updatePackage, deletePackage } = usePackages();
  
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [isEditPackageOpen, setIsEditPackageOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewPackageFormData>({
    name: "",
    price: "",
    duration: "",
    durationUnit: "hours",
    description: "",
    popular: false,
  });
  
  const [activeUsers, setActiveUsers] = useState(mockUsers.filter(u => u.activeSession));
  const [transactions, setTransactions] = useState(mockTransactions);
  const [allUsers, setAllUsers] = useState(mockUsers);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleAddPackage = () => {
    if (!formData.name || !formData.price || !formData.duration) {
      toast({
        title: "Invalid Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addPackage({
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      durationUnit: formData.durationUnit,
      description: formData.description,
      popular: formData.popular,
    });

    setFormData({
      name: "",
      price: "",
      duration: "",
      durationUnit: "hours",
      description: "",
      popular: false,
    });

    setIsAddPackageOpen(false);
  };

  const handleEditClick = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (pkg) {
      setFormData({
        name: pkg.name,
        price: pkg.price.toString(),
        duration: pkg.duration.toString(),
        durationUnit: pkg.durationUnit,
        description: pkg.description || "",
        popular: pkg.popular || false,
      });
      setSelectedPackageId(packageId);
      setIsEditPackageOpen(true);
    }
  };

  const handleUpdatePackage = () => {
    if (!selectedPackageId) return;

    updatePackage(selectedPackageId, {
      name: formData.name,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      durationUnit: formData.durationUnit,
      description: formData.description,
      popular: formData.popular,
    });

    setIsEditPackageOpen(false);
    setSelectedPackageId(null);
  };

  const handleDeletePackage = (packageId: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deletePackage(packageId);
    }
  };

  // Stats for the dashboard
  const stats = {
    totalActiveUsers: activeUsers.length,
    totalRevenue: transactions
      .filter((tx) => tx.status === "completed")
      .reduce((acc, tx) => acc + tx.amount, 0),
    totalTransactions: transactions.filter((tx) => tx.status === "completed").length,
    failedTransactions: transactions.filter((tx) => tx.status === "failed").length,
    totalRegisteredUsers: allUsers.length,
    totalBandwidthUsage: "1.2 GB",
    systemStatus: "online" as const,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6 bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Client Portal
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="payments">Payments & Billing</TabsTrigger>
            <TabsTrigger value="network">Network Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview 
              stats={stats}
              activeUsers={activeUsers}
              transactions={transactions}
              packages={packages}
            />
            <div className="mt-8">
              <NetworkChart />
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">WiFi Packages</h2>
              <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Package
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New WiFi Package</DialogTitle>
                    <DialogDescription>
                      Create a new package to offer to your customers
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Package Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (KSH)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <div className="flex gap-2">
                          <Input
                            id="duration"
                            type="number"
                            className="flex-1"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          />
                          <Select
                            value={formData.durationUnit}
                            onValueChange={(value: "minutes" | "hours" | "days") => 
                              setFormData({...formData, durationUnit: value})
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={formData.popular}
                        onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="popular">Mark as Popular</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddPackageOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPackage}>
                      Add Package
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="bg-white rounded-lg border shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">{pkg.name}</h3>
                      {pkg.popular && (
                        <span className="bg-secondary text-white text-xs rounded-full px-2 py-1">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pkg.duration} {pkg.durationUnit}
                    </p>
                    <div className="text-3xl font-bold mb-2">KSH {pkg.price}</div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                  
                  <div className="border-t px-6 py-4 bg-gray-50 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEditClick(pkg.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeletePackage(pkg.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Dialog open={isEditPackageOpen} onOpenChange={setIsEditPackageOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit WiFi Package</DialogTitle>
                  <DialogDescription>
                    Update the selected package
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Package Name</Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Price (KSH)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-duration">Duration</Label>
                      <div className="flex gap-2">
                        <Input
                          id="edit-duration"
                          type="number"
                          className="flex-1"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        />
                        <Select
                          value={formData.durationUnit}
                          onValueChange={(value: "minutes" | "hours" | "days") => 
                            setFormData({...formData, durationUnit: value})
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-popular"
                      checked={formData.popular}
                      onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="edit-popular">Mark as Popular</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditPackageOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdatePackage}>
                    Update Package
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={allUsers} packages={packages} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement 
              transactions={transactions} 
              users={allUsers} 
              packages={packages} 
            />
          </TabsContent>

          <TabsContent value="network">
            <NetworkMonitoring 
              activeUsers={activeUsers} 
              packages={packages} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
