
import { Users, CreditCard, Wifi, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import StatsCard from "./StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package } from "@/contexts/PackagesContext";

interface DashboardOverviewProps {
  stats: {
    totalActiveUsers: number;
    totalRevenue: number;
    totalTransactions: number;
    failedTransactions: number;
    totalRegisteredUsers: number;
    totalBandwidthUsage: string;
    systemStatus: "online" | "offline" | "warning";
  };
  activeUsers: any[];
  transactions: any[];
  packages: Package[];
}

const DashboardOverview = ({ 
  stats, 
  activeUsers, 
  transactions, 
  packages 
}: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Users"
          value={stats.totalActiveUsers}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Registered Users"
          value={stats.totalRegisteredUsers}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Revenue"
          value={`KSH ${stats.totalRevenue}`}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatsCard
          title="Total Bandwidth Usage"
          value={stats.totalBandwidthUsage}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Success Transactions"
          value={stats.totalTransactions}
          icon={<CreditCard className="h-5 w-5" />}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Failed Transactions"
          value={stats.failedTransactions}
          icon={<CreditCard className="h-5 w-5" />}
          iconColor="text-destructive"
        />
        <StatsCard
          title="System Status"
          value={stats.systemStatus === "online" ? "Online" : stats.systemStatus === "warning" ? "Warning" : "Offline"}
          icon={stats.systemStatus === "online" ? 
            <Wifi className="h-5 w-5" /> : 
            stats.systemStatus === "warning" ? 
            <AlertTriangle className="h-5 w-5" /> :
            <Wifi className="h-5 w-5" />}
          iconColor={stats.systemStatus === "online" ? 
            "text-green-500" : 
            stats.systemStatus === "warning" ? 
            "text-amber-500" : 
            "text-destructive"}
        />
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
                    <TableHead>Bandwidth Usage</TableHead>
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
                        <TableCell>
                          {(Math.random() * 500).toFixed(2)} MB
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
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((tx) => {
                    const user = activeUsers.find(u => u.id === tx.userId);
                    const pkg = packages.find(p => p.id === tx.packageId);
                    
                    return (
                      <TableRow key={tx.id}>
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
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
