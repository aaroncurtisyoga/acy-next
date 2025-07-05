"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Loader2, ArrowRight } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { goToNextStep } = useWizardForm();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/private-sessions/confirmation`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setErrorMessage(result.error.message || "An error occurred");
      setIsLoading(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      // Payment succeeded, redirect to confirmation
      goToNextStep();
      router.push("/private-sessions/confirmation");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <PaymentElement
            options={{
              layout: "tabs",
              fields: {
                billingDetails: {
                  email: "auto",
                  name: "auto",
                  address: {
                    country: "auto",
                    postalCode: "auto",
                  },
                },
              },
            }}
          />
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        <Button
          type="submit"
          color="primary"
          size="lg"
          fullWidth
          isDisabled={!stripe || isLoading}
          startContent={
            isLoading ? <Loader2 className="animate-spin" size={16} /> : null
          }
          className="font-medium [&:hover]:bg-[#2d4a9e] [&:hover]:text-white transition-colors rounded-lg"
        >
          {isLoading ? "Processing..." : "Complete Payment"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default CheckoutForm;
