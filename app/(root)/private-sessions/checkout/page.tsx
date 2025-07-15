"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import CheckoutForm from "@/app/(root)/private-sessions/checkout/_components/CheckoutForm";
import OrderSummary from "@/app/(root)/private-sessions/checkout/_components/OrderSummary";
import { StepIndicator } from "@/app/(root)/private-sessions/select-package/_components/StepIndicator";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const CheckoutPage: React.FC = () => {
  const { formData } = useWizardForm();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createPaymentIntent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Support both new and legacy data
      const sessionPurchase = formData.sessionPurchase;
      const packageDetails = formData.packageDetails;

      let amount: number;
      let packageName: string;
      let sessionCount: number | undefined;
      let pricePerSession: number | undefined;

      if (sessionPurchase) {
        amount = sessionPurchase.totalPrice;
        packageName = `${sessionPurchase.sessionCount} ${sessionPurchase.sessionType} Sessions`;
        sessionCount = sessionPurchase.sessionCount;
        pricePerSession = sessionPurchase.pricePerSession;
      } else if (packageDetails) {
        // Legacy fallback
        amount = parseFloat(packageDetails.price);
        packageName = packageDetails.package;
      } else {
        throw new Error("No session or package data found");
      }

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          packageName,
          sessionType: formData.sessionType,
          sessionCount,
          pricePerSession,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent");
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error("Error creating payment intent:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Redirect if no package or session data selected
  useEffect(() => {
    if (!formData.sessionPurchase && !formData.packageDetails) {
      router.push("/private-sessions/select-package");
      return;
    }

    createPaymentIntent();
  }, [formData, router, createPaymentIntent]);

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#0066cc",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="wrapper-width pt-6">
      {/* Step indicator */}
      <div className="text-left mb-6">
        <StepIndicator currentStep={4} totalSteps={4} />
      </div>

      <div className="mb-8">
        <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 dark:text-gray-200">
          Complete your payment.
        </h1>
        <p className="text-gray-700 dark:text-gray-400 mt-2">
          Secure payment powered by Stripe
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment form */}
        <div className="order-2 md:order-1">
          {error ? (
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 text-lg mb-4">
                  {error}
                </div>
                <Button color="primary" onPress={() => createPaymentIntent()}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : clientSecret ? (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          ) : (
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 h-[502px] flex items-center justify-center">
              <div className="text-center">
                <Spinner size="lg" color="primary" />
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="order-1 md:order-2">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
