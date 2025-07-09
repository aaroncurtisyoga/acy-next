"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { CheckCircle, Calendar, Home } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const ConfirmationPage: React.FC = () => {
  const { formData, resetFormData } = useWizardForm();
  const router = useRouter();

  useEffect(() => {
    // If no form data, redirect to start
    if (!formData.packageDetails) {
      router.push("/private-sessions/select-package");
    }
  }, [formData, router]);

  const handleGoHome = () => {
    resetFormData();
    router.push("/");
  };

  const handleViewAccount = () => {
    router.push("/account");
  };

  if (!formData.packageDetails) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 dark:text-gray-100 mb-2">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Your private session package has been purchased successfully.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8 text-left">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Order Details
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Package:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formData.packageDetails.title}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Session Type:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formData.sessionType}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Amount Paid:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              ${formData.packageDetails.price}
            </span>
          </div>
          {formData.customerInfo && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formData.customerInfo.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center mb-3">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            What&apos;s Next?
          </h3>
        </div>
        <div className="text-blue-800 dark:text-blue-200 space-y-2">
          <p>✅ You&apos;ll receive a confirmation email shortly</p>
          <p>
            ✅ Aaron will contact you within 24 hours to schedule your sessions
          </p>
          <p>✅ Check your account page to view your purchase history</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          color="primary"
          size="lg"
          onPress={handleViewAccount}
          className="min-w-[200px] font-medium [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
        >
          View My Account
        </Button>
        <Button
          variant="bordered"
          size="lg"
          onPress={handleGoHome}
          startContent={<Home size={16} />}
          className="min-w-[200px] font-medium rounded-lg"
        >
          Back to Home
        </Button>
      </div>

      {/* Support */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Questions? Contact Aaron at{" "}
          <a
            href="mailto:aaron@aaroncurtisyoga.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            aaron@aaroncurtisyoga.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
