
import { useState } from "react";
import { Package } from "@/contexts/PackagesContext";
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
  Wifi,
  Search,
  UserPlus,
  Ban,
  Trash,
  History,
  Smartphone,
  Clock
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface UserManagementProps {
  users: any[];
  packages: Package[];
}

const UserManagement = ({ users, packages }: UserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isViewHistoryOpen, setIsViewHistoryOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUserData, setNewUserData] = useState({
    phoneNumber: "",
    packageId: "",
    paymentConfirmed: false,
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.phoneNumber.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.activeSession) ||
      (statusFilter === "inactive" && !user.activeSession);
    
    return matchesSearch && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUserData.phoneNumber || !newUserData.packageId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an API to create a new user
    toast({
      title: "User Added",
      description: `User ${newUserData.phoneNumber} has been added successfully`,
    });

    setNewUserData({
      phoneNumber: "",
      packageId: "",
      paymentConfirmed: false,
    });
    setIsAddUserOpen(false);
  };

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    // In a real implementation, this would call an API to suspend or activate a user
    toast({
      title: isActive ? "User Suspended" : "User Activated",
      description: `User has been ${isActive ? "suspended" : "activated"} successfully`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    // In a real implementation, this would call an API to delete a user
    toast({
      title: "User Deleted",
      description: "User has been deleted successfully",
    });
  };

  const handleViewHistory = (user: any) => {
    setSelectedUser(user);
    setIsViewHistoryOpen(true);
  };

  // Mock session history data
  const mockSessionHistory = [
    {
      id: "session1",
      packageName: "1 Hour Pass",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      device: "iPhone 13",
      dataUsed: "45 MB",
      ipAddress: "192.168.1.105",
    },
    {
      id: "session2",
      packageName: "Daily Pass",
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      device: "MacBook Pro",
      dataUsed: "750 MB",
      ipAddress: "192.168.1.110",
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by phone number..."
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
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user and assign a WiFi package.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="07XXXXXXXX"
                  value={newUserData.phoneNumber}
                  onChange={(e) => setNewUserData({...newUserData, phoneNumber: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="package">Select Package</Label>
                <Select 
                  value={newUserData.packageId} 
                  onValueChange={(value) => setNewUserData({...newUserData, packageId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - KSH {pkg.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="paymentConfirmed"
                  checked={newUserData.paymentConfirmed}
                  onChange={(e) => setNewUserData({...newUserData, paymentConfirmed: e.target.checked})}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="paymentConfirmed">Payment Confirmed</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Total Sessions</TableHead>
                <TableHead>Current Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const currentPackage = user.activeSession 
                  ? packages.find(p => p.id === user.activeSession.packageId) 
                  : null;
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.phoneNumber}</TableCell>
                    <TableCell>{user.lastActive.toLocaleString()}</TableCell>
                    <TableCell>{user.totalSessions}</TableCell>
                    <TableCell>
                      {currentPackage 
                        ? `${currentPackage.name} (${currentPackage.duration} ${currentPackage.durationUnit})` 
                        : "None"}
                    </TableCell>
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id, !!user.activeSession)}
                        >
                          {user.activeSession ? (
                            <Ban className="h-4 w-4 mr-2 text-amber-500" />
                          ) : (
                            <Wifi className="h-4 w-4 mr-2 text-green-500" />
                          )}
                          {user.activeSession ? "Suspend" : "Activate"}
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          onClick={() => handleViewHistory(user)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          onClick={() => handleDeleteUser(user.id)}
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

      <Dialog open={isViewHistoryOpen} onOpenChange={setIsViewHistoryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Session History</DialogTitle>
            <DialogDescription>
              {selectedUser && `User: ${selectedUser.phoneNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Data Used</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSessionHistory.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.packageName}</TableCell>
                    <TableCell>{session.startTime.toLocaleString()}</TableCell>
                    <TableCell>{session.endTime.toLocaleString()}</TableCell>
                    <TableCell className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      {session.device}
                    </TableCell>
                    <TableCell>{session.dataUsed}</TableCell>
                    <TableCell>{session.ipAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewHistoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
