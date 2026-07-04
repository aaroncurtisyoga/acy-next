"use client";

import { FC } from "react";
import { Check } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  perSession: number;
  sessions: number;
  benefits: string[];
}

interface PackageCardDesktopProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PackageCardDesktop: FC<PackageCardDesktopProps> = ({
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
      <div className="pt-2 pb-4 px-2">
        {/* Header */}
        <div className="bg-slate-100 p-4 rounded-[12px] mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm md:text-lg font-semibold text-slate-800 md:mb-0.5">
              {pkg.name}
            </h3>
            <p className="text-slate-600 text-xs">{pkg.description}</p>
          </div>
          {isSelected && (
            <div className="w-7 h-7 rounded-full bg-primary border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
              <Check size={16} className="text-white" />
            </div>
          )}
        </div>

        {/* Feature List */}
        <ul role="tabpanel" className="space-y-0">
          <li className="py-3 border-b border-gray-200">
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Total Price</div>
              <div>
                <span className="text-lg font-bold text-gray-900">
                  ${pkg.price}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  (${pkg.perSession} per session)
                </span>
              </div>
            </div>
          </li>
          <li className="py-3 border-b border-gray-200">
            <div className="space-y-1">
              <div className="text-xs text-gray-600">Number of Sessions</div>
              <div className="text-sm font-medium text-gray-900">
                {pkg.sessions}
              </div>
            </div>
          </li>

          {pkg.benefits.map((benefit, index) => (
            <li
              key={index}
              className="py-3 border-b border-gray-200 last:border-b-0"
            >
              <div className="space-y-1">
                <div className="text-xs text-gray-600">Benefit {index + 1}</div>
                <div className="text-sm text-gray-900">{benefit}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PackageCardDesktop;
