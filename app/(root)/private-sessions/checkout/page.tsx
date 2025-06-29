"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import CheckoutForm from "@/app/(root)/private-sessions/checkout/_components/CheckoutForm";
import OrderSummary from "@/app/(root)/private-sessions/checkout/_components/OrderSummary";
import { ProgressStepper } from "@/app/(root)/private-sessions/select-package/_components/ProgressStepper";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const CheckoutPage: React.FC = () => {
  const { formData, goToPreviousStep } = useWizardForm();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createPaymentIntent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Support both new and legacy data structures
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
        // Legacy support
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

  // Let Clerk and Stripe handle their own loading states

  if (error) {
    return (
      <div className="wrapper-width py-6">
        {/* Progress Stepper - Left-aligned to match content */}
        <div className="text-left mb-6">
          <ProgressStepper currentStep={4} totalSteps={4} />
        </div>

        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <Button color="primary" onPress={() => createPaymentIntent()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper-width py-6">
      {/* Progress Stepper - Left-aligned to match content */}
      <div className="text-left mb-6">
        <ProgressStepper currentStep={4} totalSteps={4} />
      </div>

      <div className="mb-8">
        <Button
          variant="light"
          startContent={<ArrowLeft size={16} />}
          onPress={() => {
            goToPreviousStep();
            router.push("/private-sessions/select-package");
          }}
          className="mb-4"
          isDisabled={loading}
        >
          Back to Session Selection
        </Button>

        <h1 className="text-2xl md:text-[32px] font-medium text-gray-900">
          Complete your payment.
        </h1>
        <p className="text-gray-600 mt-2">Secure payment powered by Stripe</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="order-2 md:order-1">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>

        {/* Order Summary */}
        <div className="order-1 md:order-2">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
