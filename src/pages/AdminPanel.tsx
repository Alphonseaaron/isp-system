
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePackages, Package } from "@/contexts/PackagesContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LogOut, 
  Users, 
  Package as PackageIcon, 
  CreditCard, 
  Wifi, 
  PlusCircle,
  Pencil,
  Trash
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">{stats.totalActiveUsers}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-primary mr-2" />
                    <div className="text-2xl font-bold">KSH {stats.totalRevenue}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Success Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-green-500 mr-2" />
                    <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Failed Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-destructive mr-2" />
                    <div className="text-2xl font-bold">{stats.failedTransactions}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Phone</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Start Time</TableHead>
                          <TableHead>End Time</TableHead>
                          <TableHead>Time Left</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeUsers.map((user) => {
                          const pkg = packages.find(p => p.id === user.activeSession?.packageId);
                          if (!user.activeSession || !pkg) return null;
                          
                          const endTime = new Date(user.activeSession.endTime);
                          const now = new Date();
                          const timeLeft = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000 / 60));
                          
                          return (
                            <TableRow key={user.id}>
                              <TableCell>{user.phoneNumber}</TableCell>
                              <TableCell>{pkg.name}</TableCell>
                              <TableCell>
                                {new Date(user.activeSession.startTime).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {endTime.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {timeLeft} min
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Phone</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.slice(0, 5).map((tx) => {
                          const user = mockUsers.find(u => u.id === tx.userId);
                          const pkg = packages.find(p => p.id === tx.packageId);
                          
                          return (
                            <TableRow key={tx.id}>
                              <TableCell>{user?.phoneNumber || "Unknown"}</TableCell>
                              <TableCell>{pkg?.name || "Unknown Package"}</TableCell>
                              <TableCell>KSH {tx.amount}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  tx.status === "completed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}>
                                  {tx.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                {tx.timestamp.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
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
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{pkg.name}</span>
                      {pkg.popular && (
                        <span className="bg-secondary text-white text-xs rounded-full px-2 py-1">
                          Popular
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {pkg.duration} {pkg.durationUnit}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">KSH {pkg.price}</div>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
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
                  </CardFooter>
                </Card>
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
            <h2 className="text-xl font-bold mb-6">User Management</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Total Sessions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>
                          {user.lastActive.toLocaleString()}
                        </TableCell>
                        <TableCell>{user.totalSessions}</TableCell>
                        <TableCell>
                          {user.activeSession ? (
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
                            <Button size="sm" variant="outline">
                              <Wifi className="h-4 w-4 mr-2" />
                              {user.activeSession ? "Disconnect" : "Grant Access"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <h2 className="text-xl font-bold mb-6">Transaction History</h2>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => {
                      const user = mockUsers.find(u => u.id === tx.userId);
                      const pkg = packages.find(p => p.id === tx.packageId);
                      
                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">
                            {tx.transactionRef}
                          </TableCell>
                          <TableCell>{user?.phoneNumber || "Unknown"}</TableCell>
                          <TableCell>{pkg?.name || "Unknown Package"}</TableCell>
                          <TableCell>KSH {tx.amount}</TableCell>
                          <TableCell>{tx.paymentMethod}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tx.status === "completed" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}>
                              {tx.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {tx.timestamp.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
