
import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
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

type TimeRange = "1h" | "24h" | "7d" | "30d";

const NetworkChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate mock data based on the selected time range
    const mockData = generateMockData(timeRange);
    setData(mockData);
  }, [timeRange]);
  
  const generateMockData = (range: TimeRange) => {
    const now = new Date();
    const data = [];
    
    let points: number;
    let intervalMs: number;
    let format: (date: Date) => string;
    
    switch (range) {
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
    
    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMs);
      
      // Generate random values that make sense for network traffic
      const download = Math.floor(5 + Math.random() * 15); // 5-20 Mbps download
      const upload = Math.floor(1 + Math.random() * 4);  // 1-5 Mbps upload
      const activeUsers = Math.floor(3 + Math.random() * 17); // 3-20 active users
      
      data.push({
        time: format(time),
        download,
        upload,
        activeUsers
      });
    }
    
    return data;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Network Traffic</CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value: TimeRange) => setTimeRange(value)}
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
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="download"
                name="Download (Mbps)"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="upload" 
                name="Upload (Mbps)" 
                stroke="#82ca9d" 
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="activeUsers"
                name="Active Users"
                stroke="#ff7300"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkChart;
