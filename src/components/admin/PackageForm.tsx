
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Package } from "@/contexts/PackagesContext";

interface PackageFormData {
  id?: string;
  name: string;
  price: string;
  duration: string;
  durationUnit: "minutes" | "hours" | "days";
  description: string;
  popular: boolean;
  downloadSpeed: string;
  uploadSpeed: string;
  maxDownloadSpeed: string;
  maxUploadSpeed: string;
}

interface PackageFormProps {
  initialData?: Package;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PackageForm = ({ initialData, onSave, onCancel }: PackageFormProps) => {
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    price: "",
    duration: "",
    durationUnit: "hours",
    description: "",
    popular: false,
    downloadSpeed: "1",
    uploadSpeed: "0.5",
    maxDownloadSpeed: "5",
    maxUploadSpeed: "2"
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        price: initialData.price.toString(),
        duration: initialData.duration.toString(),
        durationUnit: initialData.durationUnit,
        description: initialData.description || "",
        popular: initialData.popular || false,
        downloadSpeed: initialData.downloadSpeed?.toString() || "1",
        uploadSpeed: initialData.uploadSpeed?.toString() || "0.5",
        maxDownloadSpeed: initialData.maxDownloadSpeed?.toString() || "5",
        maxUploadSpeed: initialData.maxUploadSpeed?.toString() || "2"
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      popular: checked
    });
  };

  const handleSelectChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter a package name",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.duration || isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      toast({
        title: "Invalid Duration",
        description: "Please enter a valid duration",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.downloadSpeed || isNaN(Number(formData.downloadSpeed)) || Number(formData.downloadSpeed) < 0) {
      toast({
        title: "Invalid Download Speed",
        description: "Please enter a valid download speed",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.uploadSpeed || isNaN(Number(formData.uploadSpeed)) || Number(formData.uploadSpeed) < 0) {
      toast({
        title: "Invalid Upload Speed",
        description: "Please enter a valid upload speed",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.maxDownloadSpeed || isNaN(Number(formData.maxDownloadSpeed)) || Number(formData.maxDownloadSpeed) < 0) {
      toast({
        title: "Invalid Max Download Speed",
        description: "Please enter a valid maximum download speed",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.maxUploadSpeed || isNaN(Number(formData.maxUploadSpeed)) || Number(formData.maxUploadSpeed) < 0) {
      toast({
        title: "Invalid Max Upload Speed",
        description: "Please enter a valid maximum upload speed",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const packageData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      downloadSpeed: parseFloat(formData.downloadSpeed),
      uploadSpeed: parseFloat(formData.uploadSpeed),
      maxDownloadSpeed: parseFloat(formData.maxDownloadSpeed),
      maxUploadSpeed: parseFloat(formData.maxUploadSpeed)
    };
    
    onSave(packageData);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Package Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., Basic, Premium, etc."
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (KSH)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
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
              onChange={handleInputChange}
              min="1"
            />
            <Select
              value={formData.durationUnit}
              onValueChange={(value: "minutes" | "hours" | "days") => 
                handleSelectChange("durationUnit", value)
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
        <Label>Speed Limits (Mbps)</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="downloadSpeed" className="text-xs">Guaranteed Download</Label>
            <Input
              id="downloadSpeed"
              type="number"
              value={formData.downloadSpeed}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="uploadSpeed" className="text-xs">Guaranteed Upload</Label>
            <Input
              id="uploadSpeed"
              type="number"
              value={formData.uploadSpeed}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="maxDownloadSpeed" className="text-xs">Maximum Download</Label>
            <Input
              id="maxDownloadSpeed"
              type="number"
              value={formData.maxDownloadSpeed}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxUploadSpeed" className="text-xs">Maximum Upload</Label>
            <Input
              id="maxUploadSpeed"
              type="number"
              value={formData.maxUploadSpeed}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Brief description of this package"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="popular"
          checked={formData.popular}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="popular">Mark as Popular</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? "Update Package" : "Add Package"}
        </Button>
      </div>
    </div>
  );
};

export default PackageForm;
