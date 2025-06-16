export interface OfferingType {
  title: string;
  price: string;
  description: string;
  features: string[];
  package: string;
}

export interface PackageDetailsType {
  title: string;
  price: string;
  description: string;
  features: string[];
}

export interface SessionPurchase {
  sessionType: SessionType;
  sessionCount: number;
  pricePerSession: number;
  totalPrice: number;
  discount?: {
    percentage: number;
    amount: number;
    label: string;
  };
}

export interface WizardFormData {
  sessionType: SessionType;
  sessionCount?: number;
  sessionPurchase?: SessionPurchase;
  customerInfo?: {
    email: string;
    name: string;
  };
}

export type SessionType = "Individual" | "Group";
