"use client";

import { FC } from "react";
import { Check, CheckCircle, DollarSign } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  perSession: number;
  sessions: number;
  benefits: string[];
}

interface PackageCardMobileProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PackageCardMobile: FC<PackageCardMobileProps> = ({
  pkg,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`border-2 rounded-[18px] transition-all duration-200 cursor-pointer bg-white ${
        isSelected
          ? "border-gray-300 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(pkg.id)}
    >
      {/* Header */}
      <div className="bg-slate-100 p-4 rounded-t-[16px] text-slate-800 text-center relative">
        <h3 className="text-lg font-semibold mb-1">{pkg.name}</h3>
        <p className="text-slate-600 text-sm">{pkg.description}</p>

        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <DollarSign size={14} className="text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-gray-900">${pkg.price}</span>
            <span className="text-xs text-gray-500 ml-1">
              (${pkg.perSession} per session)
            </span>
          </div>
        </div>

        {pkg.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
            <span className="text-gray-700">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageCardMobile;
