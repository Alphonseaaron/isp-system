
import { useState, useEffect } from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Package } from "@/contexts/PackagesContext";
import {
  Search,
  PlusCircle,
  Calendar,
  Download
} from "lucide-react";

interface PaymentManagementProps {
  transactions: any[];
  users: any[];
  packages: Package[];
}

const PaymentManagement = ({ transactions, users, packages }: PaymentManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [manualPayment, setManualPayment] = useState({
    userId: "",
    packageId: "",
    amount: "",
    paymentMethod: "cash",
    reference: "",
  });
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week" | "month">("all");

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.transactionRef.includes(searchTerm) || 
      users.find(u => u.id === tx.userId)?.phoneNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    
    let matchesTime = true;
    if (timeFilter !== "all") {
      const txDate = new Date(tx.timestamp);
      const now = new Date();
      
      if (timeFilter === "today") {
        matchesTime = txDate.getDate() === now.getDate() && 
                      txDate.getMonth() === now.getMonth() && 
                      txDate.getFullYear() === now.getFullYear();
      } else if (timeFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTime = txDate >= weekAgo;
      } else if (timeFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesTime = txDate >= monthAgo;
      }
    }
    
    return matchesSearch && matchesStatus && matchesTime;
  });

  const handleAddPayment = () => {
    if (!manualPayment.userId || !manualPayment.packageId || !manualPayment.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would call an API to add a manual payment
    toast({
      title: "Payment Added",
      description: "Manual payment has been recorded successfully",
    });

    setManualPayment({
      userId: "",
      packageId: "",
      amount: "",
      paymentMethod: "cash",
      reference: "",
    });
    setIsAddPaymentOpen(false);
  };

  const exportPaymentReport = () => {
    toast({
      title: "Report Generated",
      description: "Payment report has been exported successfully",
    });
  };

  const totalRevenue = filteredTransactions
    .filter(tx => tx.status === "completed")
    .reduce((total, tx) => total + tx.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by phone or reference..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={filterStatus}
            onValueChange={(value: "all" | "completed" | "pending" | "failed") => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={timeFilter}
            onValueChange={(value: "all" | "today" | "week" | "month") => setTimeFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Manual Payment
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Manual Payment</DialogTitle>
                <DialogDescription>
                  Add a payment that was made outside the system.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  <Select 
                    value={manualPayment.userId}
                    onValueChange={(value) => setManualPayment({...manualPayment, userId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.phoneNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package">Package</Label>
                  <Select 
                    value={manualPayment.packageId}
                    onValueChange={(value) => setManualPayment({...manualPayment, packageId: value})}
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
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (KSH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={manualPayment.amount}
                    onChange={(e) => setManualPayment({...manualPayment, amount: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={manualPayment.paymentMethod}
                    onValueChange={(value) => setManualPayment({...manualPayment, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="airtel">Airtel Money</SelectItem>
                      <SelectItem value="sasapay">SasaPay</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference (Optional)</Label>
                  <Input
                    id="reference"
                    value={manualPayment.reference}
                    onChange={(e) => setManualPayment({...manualPayment, reference: e.target.value})}
                    placeholder="Transaction reference or receipt number"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPayment}>
                  Add Payment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={exportPaymentReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="bg-slate-100 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <p className="text-2xl font-bold">KSH {totalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Transactions</h3>
            <p className="text-2xl font-bold">{filteredTransactions.length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Successful Payments</h3>
            <p className="text-2xl font-bold">{filteredTransactions.filter(tx => tx.status === "completed").length}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Failed Payments</h3>
            <p className="text-2xl font-bold">{filteredTransactions.filter(tx => tx.status === "failed").length}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => {
                const user = users.find(u => u.id === tx.userId);
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
                        tx.status === "completed" ? "bg-green-100 text-green-600" : 
                        tx.status === "pending" ? "bg-amber-100 text-amber-600" :
                        "bg-red-100 text-red-600"
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
  );
};

export default PaymentManagement;
