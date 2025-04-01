
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const OtpInput = ({ length = 6, value, onChange, error }: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(value.split("").concat(Array(length - value.length).fill("")));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    const newOtp = value.split("").concat(Array(length - value.length).fill(""));
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    
    // Allow only numbers
    if (newValue && !/^\d+$/.test(newValue)) {
      return;
    }
    
    if (newValue.length > 1) {
      // Handle paste event with multiple characters
      const pastedValue = newValue.slice(0, length - index);
      const newOtp = [...otp];
      
      for (let i = 0; i < pastedValue.length; i++) {
        if (index + i < length) {
          newOtp[index + i] = pastedValue[i];
        }
      }
      
      setOtp(newOtp);
      onChange(newOtp.join(""));
      
      // Focus on the next empty input or the last input
      const nextIndex = Math.min(index + pastedValue.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    } else {
      // Handle typing a single character
      const newOtp = [...otp];
      newOtp[index] = newValue;
      setOtp(newOtp);
      onChange(newOtp.join(""));
      
      // Auto focus next input
      if (newValue && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0 && inputRefs.current[index - 1]) {
      // Navigate left
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < length - 1 && inputRefs.current[index + 1]) {
      // Navigate right
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "h-12 w-12 text-center text-lg",
              error ? "border-destructive" : ""
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  );
};

export default OtpInput;
