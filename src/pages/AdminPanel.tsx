import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePackages, Package } from "@/contexts/PackagesContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import DeviceSelector from "@/components/admin/DeviceSelector";
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
  Trash,
  Menu
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Import admin dashboard components
import DashboardOverview from "@/components/admin/DashboardOverview";
import UserManagement from "@/components/admin/UserManagement";
import NetworkMonitoring from "@/components/admin/NetworkMonitoring";
import NetworkChart from "@/components/admin/NetworkChart";
import PaymentManagement from "@/components/admin/PaymentManagement";
import PackageForm from "@/components/admin/PackageForm";
import TransactionHistory from "@/components/admin/TransactionHistory";

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
  const { isAdmin, logout, isAuthenticated } = useAuth();
  const { packages, addPackage, updatePackage, deletePackage } = usePackages();
  
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [isEditPackageOpen, setIsEditPackageOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [activeUsers, setActiveUsers] = useState(mockUsers.filter(u => u.activeSession));
  const [transactions, setTransactions] = useState(mockTransactions);
  const [allUsers, setAllUsers] = useState(mockUsers);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleAddPackage = (packageData: any) => {
    addPackage(packageData);
    setIsAddPackageOpen(false);
  };

  const handleUpdatePackage = (packageData: any) => {
    if (!selectedPackageId) return;
    updatePackage(selectedPackageId, packageData);
    setIsEditPackageOpen(false);
    setSelectedPackageId(null);
  };

  const handleDeletePackage = (packageId: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      deletePackage(packageId);
    }
  };

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b py-4 px-6 bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <DeviceSelector 
              value={selectedDevice} 
              onChange={setSelectedDevice} 
              className="hidden md:flex w-[200px]"
            />
            <ThemeToggle />
            <Button variant="ghost" className="hidden md:flex" onClick={() => navigate("/wifi")}>
              Client Portal
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Logout</span>
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
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="md:hidden mb-4">
              <DeviceSelector 
                value={selectedDevice} 
                onChange={setSelectedDevice} 
                className="w-full"
              />
            </div>
            <DashboardOverview 
              stats={{
                totalActiveUsers: activeUsers.length,
                totalRevenue: transactions
                  .filter((tx) => tx.status === "completed")
                  .reduce((acc, tx) => acc + tx.amount, 0),
                totalTransactions: transactions.filter((tx) => tx.status === "completed").length,
                failedTransactions: transactions.filter((tx) => tx.status === "failed").length,
                totalRegisteredUsers: allUsers.length,
                totalBandwidthUsage: "1.2 GB",
                systemStatus: "online" as const,
              }}
              activeUsers={[]} // Filter by selectedDevice in a real app
              transactions={[]} // Filter by selectedDevice in a real app
              packages={packages}
            />
            <div className="mt-8">
              <NetworkChart />
            </div>
          </TabsContent>

          <TabsContent value="packages">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold">WiFi Packages</h2>
              <div className="flex gap-4 w-full sm:w-auto">
                <DeviceSelector 
                  value={selectedDevice} 
                  onChange={setSelectedDevice} 
                  className="flex-1 md:hidden"
                />
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
                    <PackageForm 
                      onSave={handleAddPackage}
                      onCancel={() => setIsAddPackageOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
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
                <PackageForm 
                  initialData={packages.find(p => p.id === selectedPackageId)}
                  onSave={handleUpdatePackage}
                  onCancel={() => setIsEditPackageOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="users">
            <div className="md:hidden mb-4">
              <DeviceSelector 
                value={selectedDevice} 
                onChange={setSelectedDevice} 
                className="w-full"
              />
            </div>
            <UserManagement users={[]} packages={packages} />
          </TabsContent>

          <TabsContent value="payments">
            <div className="md:hidden mb-4">
              <DeviceSelector 
                value={selectedDevice} 
                onChange={setSelectedDevice} 
                className="w-full"
              />
            </div>
            <TransactionHistory 
              transactions={[]} 
              users={[]} 
              packages={packages} 
            />
          </TabsContent>

          <TabsContent value="network">
            <NetworkMonitoring 
              activeUsers={[]} 
              packages={packages} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
