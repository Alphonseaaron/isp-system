
import { Package } from "@/contexts/PackagesContext";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: Package;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onSuccess: () => void;
}
