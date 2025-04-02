
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSubscriptionPlan } from "@/models/AdminSubscription";
import { X, Plus } from "lucide-react";

interface SubscriptionPlanFormProps {
  initialData?: AdminSubscriptionPlan;
  onSave: (data: Omit<AdminSubscriptionPlan, 'id'>) => void;
  onCancel: () => void;
}

const SubscriptionPlanForm = ({
  initialData,
  onSave,
  onCancel,
}: SubscriptionPlanFormProps) => {
  const [formData, setFormData] = useState<Omit<AdminSubscriptionPlan, 'id'>>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    userLimit: initialData?.userLimit || 50,
    features: initialData?.features || ["WiFi management"],
    duration: initialData?.duration || 1,
    durationUnit: initialData?.durationUnit || "months",
    description: initialData?.description || "",
    popular: initialData?.popular || false,
  });

  const [newFeature, setNewFeature] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "userLimit" || name === "duration" ? Number(value) : value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      popular: checked,
    }));
  };

  const handleSelectChange = (value: "days" | "months" | "years") => {
    setFormData((prev) => ({
      ...prev,
      durationUnit: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (KSH)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userLimit">User Limit</Label>
        <Input
          id="userLimit"
          name="userLimit"
          type="number"
          min="1"
          value={formData.userLimit}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={formData.duration}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="durationUnit">Unit</Label>
          <Select
            value={formData.durationUnit}
            onValueChange={(value: "days" | "months" | "years") => handleSelectChange(value)}
          >
            <SelectTrigger id="durationUnit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Features</Label>
        <ul className="space-y-2 mb-2">
          {formData.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="flex-1 bg-muted p-2 rounded-md text-sm">
                {feature}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Input
            placeholder="Add a feature"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addFeature}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="popular"
          checked={formData.popular || false}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="popular">Mark as Popular</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
};

export default SubscriptionPlanForm;
