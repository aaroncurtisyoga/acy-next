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

export type SessionType = "Individual" | "Group";
