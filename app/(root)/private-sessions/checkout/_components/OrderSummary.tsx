"use client";

import React from "react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const OrderSummary: React.FC = () => {
  const { formData } = useWizardForm();

  // Support both new and legacy data
  const sessionPurchase = formData.sessionPurchase;
  const packageDetails = formData.packageDetails;

  if (!sessionPurchase && !packageDetails) {
    return null;
  }

  // let price: number;
  // let title: string;
  // let description: string;
  // let features: string[];

  if (sessionPurchase) {
    // price = sessionPurchase.totalPrice;
    // title = `${sessionPurchase.sessionCount} ${sessionPurchase.sessionType} Session${sessionPurchase.sessionCount !== 1 ? "s" : ""}`;
    // description = `${sessionPurchase.sessionCount} hours of training at $${sessionPurchase.pricePerSession}/session`;
    // features =
    //   sessionPurchase.sessionType === "Individual"
    //     ? [
    //         "Personalized programming",
    //         "Virtual or In Person",
    //         "Breathwork",
    //         "Meditation",
    //         ...(sessionPurchase.sessionCount >= 4
    //           ? ["Async Q & A", "Video Support"]
    //           : []),
    //       ]
    //     : [
    //         "Unique programming for your group",
    //         "Virtual or In Person",
    //         "Breathwork",
    //         "Meditation",
    //         ...(sessionPurchase.sessionCount >= 4
    //           ? ["Async Q & A", "Video Support", "Sound Bath"]
    //           : []),
    //       ];
  } else {
    // Legacy fallback
    // price = parseFloat(packageDetails!.price);
    // title = packageDetails!.title;
    // description = packageDetails!.description;
    // features = packageDetails!.features;
  }

  // const tax = price * 0.08; // 8% tax (adjust as needed)
  // const total = price + tax;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">
        Order Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Package:</span>
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {formData.packageDetails?.title}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Session Type:
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-200">
            {formData.sessionType}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900 dark:text-gray-200">Total:</span>
            <span className="text-gray-900 dark:text-gray-200">
              ${formData.packageDetails?.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
