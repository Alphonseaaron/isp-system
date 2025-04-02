
import { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  Download, 
  Calendar
} from "lucide-react";
import { Package } from "@/contexts/PackagesContext";

interface TransactionHistoryProps {
  transactions: any[];
  users: any[];
  packages: Package[];
}

const TransactionHistory = ({ transactions, users, packages }: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending" | "failed">("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  
  // Generate years for filter - from current year to 2 years back
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  
  // Mock MikroTik devices
  const devices = [
    { id: "router1", name: "MikroTik hAP ac2 (Main)" },
    { id: "router2", name: "MikroTik RB4011 (Office)" }
  ];

  // Filter transactions based on search, status, year and device
  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.transactionRef.includes(searchTerm) || 
      users.find(u => u.id === tx.userId)?.phoneNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus;
    
    // Year filtering
    const txYear = new Date(tx.timestamp).getFullYear();
    const matchesYear = yearFilter === "all" || txYear.toString() === yearFilter;
    
    // In a real app, each transaction would be associated with a specific MikroTik device
    // For this mock, we'll randomly assign transactions to devices based on their ID
    const txDeviceId = parseInt(tx.id.replace('tx', '')) % 2 === 0 ? "router1" : "router2";
    const matchesDevice = deviceFilter === "all" || txDeviceId === deviceFilter;
    
    return matchesSearch && matchesStatus && matchesYear && matchesDevice;
  });

  // Generate monthly transaction data for the selected year
  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map(month => ({ 
      month, 
      completed: 0, 
      failed: 0, 
      amount: 0 
    }));
    
    transactions.forEach(tx => {
      const txDate = new Date(tx.timestamp);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth();
      
      // Skip if not in the selected year
      if (yearFilter !== "all" && txYear.toString() !== yearFilter) {
        return;
      }
      
      // Skip if not for the selected device
      const txDeviceId = parseInt(tx.id.replace('tx', '')) % 2 === 0 ? "router1" : "router2";
      if (deviceFilter !== "all" && txDeviceId !== deviceFilter) {
        return;
      }
      
      if (tx.status === "completed") {
        data[txMonth].completed += 1;
        data[txMonth].amount += tx.amount;
      } else if (tx.status === "failed") {
        data[txMonth].failed += 1;
      }
    });
    
    return data;
  };

  const monthlyData = generateMonthlyData();
  
  // Generate daily transaction data for the current month
  const generateDailyData = () => {
    const now = new Date();
    const year = yearFilter === "all" ? now.getFullYear() : parseInt(yearFilter);
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      completed: 0,
      failed: 0,
      amount: 0
    }));
    
    transactions.forEach(tx => {
      const txDate = new Date(tx.timestamp);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth();
      const txDay = txDate.getDate() - 1; // 0-indexed array
      
      // Only count transactions from the current month in the selected year
      if (txYear === year && txMonth === month) {
        // Skip if not for the selected device
        const txDeviceId = parseInt(tx.id.replace('tx', '')) % 2 === 0 ? "router1" : "router2";
        if (deviceFilter !== "all" && txDeviceId !== deviceFilter) {
          return;
        }
        
        if (tx.status === "completed") {
          data[txDay].completed += 1;
          data[txDay].amount += tx.amount;
        } else if (tx.status === "failed") {
          data[txDay].failed += 1;
        }
      }
    });
    
    return data;
  };

  const dailyData = generateDailyData();

  // Total revenue for filtered transactions
  const totalRevenue = filteredTransactions
    .filter(tx => tx.status === "completed")
    .reduce((total, tx) => total + tx.amount, 0);

  // Export transaction report as PDF
  const exportReport = () => {
    toast({
      title: "Report Generated",
      description: "Transaction report has been exported as PDF",
    });
  };

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
            value={yearFilter}
            onValueChange={(value) => setYearFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={deviceFilter}
            onValueChange={(value) => setDeviceFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select MikroTik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All MikroTiks</SelectItem>
              {devices.map(device => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={exportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report (PDF)
        </Button>
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

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Transactions Table</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Chart</TabsTrigger>
          <TabsTrigger value="daily">Daily Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>MikroTik</TableHead>
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
                    // Mock assign each transaction to a device based on ID
                    const deviceId = parseInt(tx.id.replace('tx', '')) % 2 === 0 ? "router1" : "router2";
                    const device = devices.find(d => d.id === deviceId);
                    
                    return (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-xs">
                          {tx.transactionRef}
                        </TableCell>
                        <TableCell>{user?.phoneNumber || "Unknown"}</TableCell>
                        <TableCell>{pkg?.name || "Unknown Package"}</TableCell>
                        <TableCell>{device?.name || "Unknown"}</TableCell>
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
                          {new Date(tx.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Monthly Transactions {yearFilter !== "all" ? `(${yearFilter})` : "(All Years)"}
                {deviceFilter !== "all" && ` - ${devices.find(d => d.id === deviceFilter)?.name}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="completed" 
                      name="Completed Transactions" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="failed" 
                      name="Failed Transactions" 
                      fill="#ef4444" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="amount"
                      name="Revenue (KSH)"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Daily Transactions (Current Month)
                {deviceFilter !== "all" && ` - ${devices.find(d => d.id === deviceFilter)?.name}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="completed" 
                      name="Completed Transactions" 
                      fill="#10b981" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="failed" 
                      name="Failed Transactions" 
                      fill="#ef4444" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="amount"
                      name="Revenue (KSH)"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionHistory;
