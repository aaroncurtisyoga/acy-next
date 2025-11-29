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
      className={`border-2 rounded-[18px] transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800 ${
        isSelected
          ? "border-gray-300 dark:border-gray-600 shadow-md"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
      onClick={() => onSelect(pkg.id)}
    >
      {/* Header */}
      <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-t-[16px] text-slate-800 dark:text-slate-200 text-center relative">
        <h3 className="text-lg font-semibold mb-1">{pkg.name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {pkg.description}
        </p>

        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <DollarSign
            size={14}
            className="text-green-600 dark:text-green-400 flex-shrink-0"
          />
          <div className="flex-1">
            <span className="font-semibold text-gray-900 dark:text-gray-200">
              ${pkg.price}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              (${pkg.perSession} per session)
            </span>
          </div>
        </div>

        {pkg.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <CheckCircle
              size={14}
              className="text-blue-600 dark:text-blue-400 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageCardMobile;
