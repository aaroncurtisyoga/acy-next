"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/react";
import { Check } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const OrderSummary: React.FC = () => {
  const { formData } = useWizardForm();

  if (!formData.packageDetails) {
    return null;
  }

  const { packageDetails, sessionType } = formData;
  const price = parseFloat(packageDetails.price);
  const tax = price * 0.08; // 8% tax (adjust as needed)
  const total = price + tax;

  return (
    <div className="space-y-6">
      {/* Package Details */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Order Summary</h3>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="space-y-4">
            {/* Session Type */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Session Type</span>
                <span className="font-medium">{sessionType}</span>
              </div>
            </div>

            {/* Package Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{packageDetails.title}</span>
                <span className="font-semibold">${packageDetails.price}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {packageDetails.description}
              </p>

              {/* Features */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Includes:</p>
                {packageDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={12} className="text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardBody>
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
        </CardBody>
      </Card>

      {/* Security Notice */}
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 font-medium">
            ✅ 30-day money-back guarantee
          </p>
          <p className="text-xs text-green-600 mt-1">
            Not satisfied? Get a full refund within 30 days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
