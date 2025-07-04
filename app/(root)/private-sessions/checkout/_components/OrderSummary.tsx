"use client";

import React from "react";
import { Divider } from "@heroui/react";
import { Check } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const OrderSummary: React.FC = () => {
  const { formData } = useWizardForm();

  // Support both new and legacy data structures
  const sessionPurchase = formData.sessionPurchase;
  const packageDetails = formData.packageDetails;

  if (!sessionPurchase && !packageDetails) {
    return null;
  }

  let price: number;
  let title: string;
  let description: string;
  let features: string[];

  if (sessionPurchase) {
    price = sessionPurchase.totalPrice;
    title = `${sessionPurchase.sessionCount} ${sessionPurchase.sessionType} Session${sessionPurchase.sessionCount !== 1 ? "s" : ""}`;
    description = `${sessionPurchase.sessionCount} hours of training at $${sessionPurchase.pricePerSession}/session`;
    features =
      sessionPurchase.sessionType === "Individual"
        ? [
            "Personalized programming",
            "Virtual or In Person",
            "Breathwork",
            "Meditation",
            ...(sessionPurchase.sessionCount >= 4
              ? ["Async Q & A", "Video Support"]
              : []),
          ]
        : [
            "Unique programming for your group",
            "Virtual or In Person",
            "Breathwork",
            "Meditation",
            ...(sessionPurchase.sessionCount >= 4
              ? ["Async Q & A", "Video Support", "Sound Bath"]
              : []),
          ];
  } else {
    // Legacy support
    price = parseFloat(packageDetails!.price);
    title = packageDetails!.title;
    description = packageDetails!.description;
    features = packageDetails!.features;
  }

  const tax = price * 0.08; // 8% tax (adjust as needed)
  const total = price + tax;

  return (
    <div className="space-y-6">
      {/* Package Details */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4">
          {/* Session Type */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Session Type</span>
              <span className="font-medium">{formData.sessionType}</span>
            </div>
          </div>

          {/* Package/Session Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{title}</span>
              <span className="font-semibold">${price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{description}</p>

            {/* Discount Info */}
            {sessionPurchase?.discount && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-green-800 font-medium">
                  🎉 {sessionPurchase.discount.label} - Save $
                  {sessionPurchase.discount.amount.toFixed(2)}
                </p>
              </div>
            )}

            {/* Features */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Includes:</p>
              <ul className="space-y-1 ml-6">
                {features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 list-disc">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Divider />
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
