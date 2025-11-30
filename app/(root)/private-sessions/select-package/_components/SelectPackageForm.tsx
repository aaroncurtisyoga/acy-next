"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButtonSkeleton";
import { StepIndicator } from "@/app/(root)/private-sessions/select-package/_components/StepIndicator";
import SessionTypeToggle from "@/app/(root)/private-sessions/select-package/_components/SessionTypeToggle";
import PackageCardMobile from "@/app/(root)/private-sessions/select-package/_components/PackageCardMobile";
import PackageCardDesktop from "@/app/(root)/private-sessions/select-package/_components/PackageCardDesktop";
import { packages } from "@/app/(root)/private-sessions/select-package/_lib/packages";

const SelectPackageForm: FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { updateFormData, goToNextStep } = useWizardForm();
  const router = useRouter();
  const [sessionType, setSessionType] = useState<"individual" | "group">(
    "individual",
  );
  const [selectedPackage, setSelectedPackage] = useState("growth");

  const currentPackages = packages[sessionType];

  const onSubmit = async () => {
    const selectedPkg = currentPackages.find((p) => p.id === selectedPackage);
    if (!selectedPkg) return;

    updateFormData({
      sessionType: sessionType === "individual" ? "Individual" : "Group",
      sessionCount: selectedPkg.sessions,
      packageDetails: {
        package: selectedPkg.name,
        title: `${selectedPkg.sessions} ${sessionType} sessions`,
        price: selectedPkg.price.toString(),
        description: selectedPkg.description,
        features: selectedPkg.benefits,
      },
      sessionPurchase: {
        sessionType: sessionType === "individual" ? "Individual" : "Group",
        sessionCount: selectedPkg.sessions,
        pricePerSession: selectedPkg.perSession,
        totalPrice: selectedPkg.price,
      },
      customerInfo: {
        email: user?.emailAddresses[0]?.emailAddress || "",
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      },
    });

    goToNextStep();
    router.push("/private-sessions/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <div>
        <div className="text-left mb-6">
          <StepIndicator currentStep={3} totalSteps={4} />
        </div>

        {/* Header and Session Type Selection */}
        <div className="mb-8">
          <div className="text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:items-center">
              <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 dark:text-gray-200">
                Select your package.
              </h1>
              <SessionTypeToggle
                sessionType={sessionType}
                onSessionTypeChange={setSessionType}
              />
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-2">
          {/* Mobile: Stacked Cards */}
          <div className="block md:hidden space-y-4">
            {currentPackages.map((pkg) => (
              <PackageCardMobile
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedPackage === pkg.id}
                onSelect={setSelectedPackage}
              />
            ))}
          </div>

          {/* Desktop: Side by Side Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentPackages.map((pkg) => (
              <PackageCardDesktop
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedPackage === pkg.id}
                onSelect={setSelectedPackage}
              />
            ))}
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-4 mb-8">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left">
            <strong>Refund Policy:</strong> Full refunds are available at any
            time prior to the actual class taking place. Once a session has
            begun, refunds are not available. By proceeding with your purchase,
            you acknowledge and agree to these terms.
          </p>
        </div>

        {/* Checkout Button */}
        <div className="flex flex-col items-center gap-4">
          {!isUserLoaded ? (
            <CheckoutButtonSkeleton />
          ) : (
            <>
              <SignedOut>
                <SignInButton>
                  <Button
                    color="primary"
                    size="lg"
                    className="w-full max-w-[440px] font-medium [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
                  >
                    Sign In to Purchase
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full max-w-[440px] font-medium [&:hover]:bg-[#1a5bb8] [&:hover]:text-white transition-colors rounded-lg"
                  onPress={onSubmit}
                >
                  Continue to Checkout
                </Button>
              </SignedIn>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectPackageForm;
