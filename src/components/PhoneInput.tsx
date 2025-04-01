
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clean the input to only contain digits
    const cleaned = e.target.value.replace(/\D/g, "");
    onChange(cleaned);
  };

  const formatPhoneNumber = (value: string) => {
    // Format as 07XX XXX XXX (for Kenya)
    if (!value) return "";
    
    let formatted = value;
    if (value.length > 4) {
      formatted = `${value.slice(0, 4)} ${value.slice(4)}`;
    }
    if (value.length > 7) {
      formatted = `${formatted.slice(0, 8)} ${formatted.slice(8)}`;
    }
    
    return formatted;
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="phone" className={focused ? "text-primary" : ""}>
        Phone Number
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
          +254
        </div>
        <Input
          id="phone"
          type="tel"
          className={`pl-14 ${error ? "border-destructive" : ""}`}
          value={formatPhoneNumber(value)}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="07XX XXX XXX"
          maxLength={12} // 9 digits + 2 spaces
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default PhoneInput;
