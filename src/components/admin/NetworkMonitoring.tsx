
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
import { Package } from "@/contexts/PackagesContext";
import StatsCard from "./StatsCard";
import { 
  Wifi, 
  Signal, 
  Router, 
  LogOut,
  Activity,
  Upload,
  Download 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface NetworkMonitoringProps {
  activeUsers: any[];
  packages: Package[];
}

const NetworkMonitoring = ({ activeUsers, packages }: NetworkMonitoringProps) => {
  const [networkDevices, setNetworkDevices] = useState([
    {
      id: "router1",
      name: "MikroTik hAP ac2",
      type: "router",
      status: "online",
      ipAddress: "192.168.1.1",
      uptime: "10d 4h 35m",
      clients: 12,
    },
    {
      id: "ap1",
      name: "BREAMT WiFi AP 1",
      type: "access_point",
      status: "online",
      ipAddress: "192.168.1.2",
      uptime: "5d 12h 20m",
      clients: 8,
    },
    {
      id: "ap2",
      name: "BREAMT WiFi AP 2",
      type: "access_point",
      status: "online",
      ipAddress: "192.168.1.3",
      uptime: "3d 7h 15m",
      clients: 4,
    }
  ]);
  
  const [activeConnections, setActiveConnections] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real implementation, this would fetch data from the MikroTik API
    const connections = activeUsers
      .filter(user => user.activeSession)
      .map(user => {
        const deviceTypes = ["iPhone 13", "Samsung Galaxy S21", "MacBook Pro", "Windows Laptop", "iPad Pro"];
        const randomDevice = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
        const randomMac = Array(6).fill(0).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
        const dataUsed = Math.floor(Math.random() * 1000);
        
        return {
          userId: user.id,
          phoneNumber: user.phoneNumber,
          ipAddress: `192.168.1.${100 + parseInt(user.id)}`,
          macAddress: randomMac,
          device: randomDevice,
          connectionTime: user.activeSession.startTime,
          dataUsed: dataUsed,
          downloadSpeed: Math.floor(Math.random() * 10),
          uploadSpeed: Math.floor(Math.random() * 2),
        };
      });
      
    setActiveConnections(connections);
  }, [activeUsers]);
  
  const handleDisconnectUser = (userId: string) => {
    // In a real implementation, this would call the MikroTik API to disconnect the user
    toast({
      title: "User Disconnected",
      description: "The user has been disconnected from the network",
    });
  };
  
  // Calculated network stats
  const totalDownload = activeConnections.reduce((total, conn) => total + conn.downloadSpeed, 0);
  const totalUpload = activeConnections.reduce((total, conn) => total + conn.uploadSpeed, 0);
  const totalDataUsed = activeConnections.reduce((total, conn) => total + conn.dataUsed, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Network Devices"
          value={networkDevices.length}
          icon={<Router className="h-5 w-5" />}
        />
        <StatsCard
          title="Active Connections"
          value={activeConnections.length}
          icon={<Wifi className="h-5 w-5" />}
        />
        <StatsCard
          title="Download Traffic"
          value={`${totalDownload} Mbps`}
          icon={<Download className="h-5 w-5" />}
        />
        <StatsCard
          title="Upload Traffic"
          value={`${totalUpload} Mbps`}
          icon={<Upload className="h-5 w-5" />}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Network Devices</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Connected Clients</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {networkDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell className="capitalize">{device.type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="capitalize">{device.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{device.ipAddress}</TableCell>
                    <TableCell>{device.uptime}</TableCell>
                    <TableCell>{device.clients}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Active Connections</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Connected Since</TableHead>
                  <TableHead>Data Usage</TableHead>
                  <TableHead>Speed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeConnections.map((connection) => (
                  <TableRow key={connection.userId}>
                    <TableCell>{connection.phoneNumber}</TableCell>
                    <TableCell>{connection.ipAddress}</TableCell>
                    <TableCell className="font-mono text-xs">{connection.macAddress}</TableCell>
                    <TableCell>{connection.device}</TableCell>
                    <TableCell>{new Date(connection.connectionTime).toLocaleString()}</TableCell>
                    <TableCell>{connection.dataUsed} MB</TableCell>
                    <TableCell>{connection.downloadSpeed} Mbps ↓ / {connection.uploadSpeed} Mbps ↑</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDisconnectUser(connection.userId)}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Kick
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkMonitoring;
