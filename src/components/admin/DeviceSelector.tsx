
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface DeviceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

interface NetworkDevice {
  id: string;
  name: string;
  type: string;
}

// Mock network devices that would come from your MikroTik API
const networkDevices: NetworkDevice[] = [
  {
    id: "router1",
    name: "MikroTik hAP ac2 (Main)",
    type: "router",
  },
  {
    id: "router2",
    name: "MikroTik RB4011 (Office)",
    type: "router",
  },
  {
    id: "ap1",
    name: "BREAMT WiFi AP 1 (Lobby)",
    type: "access_point",
  },
  {
    id: "ap2",
    name: "BREAMT WiFi AP 2 (Outdoor)",
    type: "access_point",
  }
];

const DeviceSelector = ({ value, onChange, label, className }: DeviceSelectorProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className={className || "w-[240px]"}>
        <SelectValue placeholder={label || "Select Device"} />
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
  );
};

export default DeviceSelector;
export { networkDevices };
