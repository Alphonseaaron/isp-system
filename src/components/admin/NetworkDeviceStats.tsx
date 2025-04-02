
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ChartBar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import StatsCard from "./StatsCard";

interface NetworkDevice {
  id: string;
  name: string;
  type: string;
  status: string;
  ipAddress: string;
  uptime: string;
  clients: number;
  cpuLoad: number;
  memoryUsage: number;
  diskUsage: number;
  downloadSpeed: number;
  uploadSpeed: number;
}

interface UsageData {
  time: string;
  download: number;
  upload: number;
  activeUsers: number;
}

const NetworkDeviceStats = () => {
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  
  // Mock network devices data - in a real implementation, this would come from the MikroTik API
  const networkDevices: NetworkDevice[] = [
    {
      id: "router1",
      name: "MikroTik hAP ac2 (Main)",
      type: "router",
      status: "online",
      ipAddress: "192.168.1.1",
      uptime: "10d 4h 35m",
      clients: 12,
      cpuLoad: 22,
      memoryUsage: 45,
      diskUsage: 37,
      downloadSpeed: 18.5,
      uploadSpeed: 4.8
    },
    {
      id: "router2",
      name: "MikroTik RB4011 (Office)",
      type: "router",
      status: "online",
      ipAddress: "192.168.2.1",
      uptime: "15d 8h 20m",
      clients: 8,
      cpuLoad: 15,
      memoryUsage: 32,
      diskUsage: 28,
      downloadSpeed: 12.3,
      uploadSpeed: 3.5
    },
    {
      id: "ap1",
      name: "BREAMT WiFi AP 1 (Lobby)",
      type: "access_point",
      status: "online",
      ipAddress: "192.168.1.2",
      uptime: "5d 12h 20m",
      clients: 8,
      cpuLoad: 18,
      memoryUsage: 30,
      diskUsage: 22,
      downloadSpeed: 10.8,
      uploadSpeed: 2.2
    },
    {
      id: "ap2",
      name: "BREAMT WiFi AP 2 (Outdoor)",
      type: "access_point",
      status: "online",
      ipAddress: "192.168.1.3",
      uptime: "3d 7h 15m",
      clients: 4,
      cpuLoad: 12,
      memoryUsage: 25,
      diskUsage: 18,
      downloadSpeed: 5.6,
      uploadSpeed: 1.2
    }
  ];
  
  // Generate mock usage data based on the selected time range and device
  const generateUsageData = () => {
    const now = new Date();
    const data: UsageData[] = [];
    
    let points: number;
    let intervalMs: number;
    let format: (date: Date) => string;
    
    switch (timeRange) {
      case "1h":
        points = 12;
        intervalMs = 5 * 60 * 1000; // 5 minutes
        format = (date) => `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        break;
      case "24h":
        points = 24;
        intervalMs = 60 * 60 * 1000; // 1 hour
        format = (date) => `${date.getHours()}:00`;
        break;
      case "7d":
        points = 7;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        format = (date) => date.toLocaleDateString(undefined, { weekday: 'short' });
        break;
      case "30d":
        points = 30;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        format = (date) => `${date.getDate()}/${date.getMonth() + 1}`;
        break;
    }
    
    // Apply a multiplier based on the selected device to differentiate data
    let multiplier = 1;
    let baseDownload = 5;
    let baseUpload = 1;
    let baseUsers = 3;
    
    if (selectedDevice !== "all") {
      const device = networkDevices.find(d => d.id === selectedDevice);
      if (device) {
        multiplier = device.type === "router" ? 1.5 : 0.8;
        baseDownload = device.downloadSpeed / 2;
        baseUpload = device.uploadSpeed / 2;
        baseUsers = device.clients / 2;
      }
    }
    
    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMs);
      
      // Generate values based on device characteristics
      const download = Math.floor((baseDownload + Math.random() * 10) * multiplier);
      const upload = Math.floor((baseUpload + Math.random() * 3) * multiplier);
      const activeUsers = Math.floor((baseUsers + Math.random() * 5) * multiplier);
      
      data.push({
        time: format(time),
        download,
        upload,
        activeUsers
      });
    }
    
    return data;
  };

  const usageData = generateUsageData();
  
  // Data for bandwidth usage bar chart
  const bandwidthData = networkDevices.map(device => ({
    name: device.name.split(' ')[2] || device.name.split(' ')[0],
    download: device.downloadSpeed,
    upload: device.uploadSpeed
  }));

  const handleExportReport = () => {
    toast({
      title: "Report Generated",
      description: "Network usage report has been exported as PDF",
    });
  };

  const getSelectedDevice = () => {
    if (selectedDevice === "all") {
      return {
        clients: networkDevices.reduce((sum, device) => sum + device.clients, 0),
        downloadSpeed: networkDevices.reduce((sum, device) => sum + device.downloadSpeed, 0),
        uploadSpeed: networkDevices.reduce((sum, device) => sum + device.uploadSpeed, 0),
        cpuLoad: Math.round(networkDevices.reduce((sum, device) => sum + device.cpuLoad, 0) / networkDevices.length),
        memoryUsage: Math.round(networkDevices.reduce((sum, device) => sum + device.memoryUsage, 0) / networkDevices.length)
      };
    }
    
    const device = networkDevices.find(d => d.id === selectedDevice);
    return device || networkDevices[0];
  };

  const deviceInfo = getSelectedDevice();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Network Monitoring</h2>
          <Select
            value={selectedDevice}
            onValueChange={(value) => setSelectedDevice(value)}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              {networkDevices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleExportReport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Connected Clients"
          value={typeof deviceInfo.clients === 'number' ? deviceInfo.clients : 0}
          icon={<ChartBar className="h-5 w-5" />}
          iconColor="text-primary"
        />
        <StatsCard
          title="Download Speed"
          value={`${typeof deviceInfo.downloadSpeed === 'number' ? deviceInfo.downloadSpeed.toFixed(1) : 0} Mbps`}
          icon={<Download className="h-5 w-5" />}
          iconColor="text-blue-500"
          trend="up"
          trendValue="2.3%"
        />
        <StatsCard
          title="Upload Speed"
          value={`${typeof deviceInfo.uploadSpeed === 'number' ? deviceInfo.uploadSpeed.toFixed(1) : 0} Mbps`}
          icon={<Download className="h-5 w-5 rotate-180" />}
          iconColor="text-green-500"
          trend="up"
          trendValue="1.5%"
        />
        <StatsCard
          title="CPU Load"
          value={`${typeof deviceInfo.cpuLoad === 'number' ? deviceInfo.cpuLoad : 0}%`}
          icon={<ChartBar className="h-5 w-5" />}
          iconColor="text-amber-500"
          trend={deviceInfo.cpuLoad > 80 ? "up" : deviceInfo.cpuLoad > 50 ? "neutral" : "down"}
          trendValue={deviceInfo.cpuLoad > 80 ? "High" : deviceInfo.cpuLoad > 50 ? "Normal" : "Low"}
        />
        <StatsCard
          title="Memory Usage"
          value={`${typeof deviceInfo.memoryUsage === 'number' ? deviceInfo.memoryUsage : 0}%`}
          icon={<ChartBar className="h-5 w-5" />}
          iconColor="text-purple-500"
          trend={deviceInfo.memoryUsage > 80 ? "up" : deviceInfo.memoryUsage > 50 ? "neutral" : "down"}
          trendValue={deviceInfo.memoryUsage > 80 ? "High" : deviceInfo.memoryUsage > 50 ? "Normal" : "Low"}
        />
      </div>
      
      <Tabs defaultValue="bandwidth">
        <TabsList>
          <TabsTrigger value="bandwidth">Bandwidth Usage</TabsTrigger>
          <TabsTrigger value="history">Usage History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bandwidth" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bandwidth Usage by Device</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bandwidthData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Mbps', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} Mbps`, undefined]} />
                    <Legend />
                    <Bar dataKey="download" name="Download" fill="#8884d8" />
                    <Bar dataKey="upload" name="Upload" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Network Traffic History</CardTitle>
              <Select
                value={timeRange}
                onValueChange={(value: "1h" | "24h" | "7d" | "30d") => setTimeRange(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={usageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="download" 
                      name="Download (Mbps)" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="upload" 
                      name="Upload (Mbps)" 
                      fill="#82ca9d" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="activeUsers"
                      name="Active Users"
                      fill="#ff7300"
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

export default NetworkDeviceStats;
