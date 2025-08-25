import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@heroui/react";
import { Check, CheckCircle, User, Users, DollarSign } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButtonSkeleton";
import { StepIndicator } from "@/app/(root)/private-sessions/select-package/_components/StepIndicator";
import { packages } from "@/app/(root)/private-sessions/select-package/_lib/packages";

const SelectPackageForm: FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { updateFormData, goToNextStep } = useWizardForm();
  const router = useRouter();
  const [sessionType, setSessionType] = useState<"individual" | "group">(
    "individual",
  );
  const [selectedPackage, setSelectedPackage] = useState("growth");

  const onSubmit = async () => {
    const selectedPkg = packages[sessionType].find(
      (p) => p.id === selectedPackage,
    );

    if (!selectedPkg) return;

    // Save form data to context
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

    // Navigate to checkout
    goToNextStep();
    router.push("/private-sessions/checkout");
  };

  const currentPackages = packages[sessionType];
  const selectedPkg = currentPackages.find((p) => p.id === selectedPackage);

  return (
    <div className="max-w-4xl mx-auto">
      <div>
        {/* Step Indicator - Left-aligned to match content */}
        <div className="text-left mb-6">
          <StepIndicator currentStep={3} totalSteps={4} />
        </div>

        {/* Header and Session Type Selection */}
        <div className="mb-8">
          {/* Header */}
          <div className="text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:items-center">
              <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 dark:text-gray-200">
                Select your package.
              </h1>

              {/* Session Type Toggle - Moved to headline level */}
              <div className="flex gap-2 mt-2 sm:mt-0 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                <button
                  onClick={() => setSessionType("individual")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    sessionType === "individual"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md border border-blue-200 dark:border-blue-600"
                      : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User
                      size={16}
                      className={
                        sessionType === "individual"
                          ? "text-blue-600 dark:text-blue-400"
                          : ""
                      }
                    />
                    <span>Individual</span>
                  </div>
                </button>
                <button
                  onClick={() => setSessionType("group")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    sessionType === "group"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md border border-blue-200 dark:border-blue-600"
                      : "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users
                      size={16}
                      className={
                        sessionType === "group"
                          ? "text-blue-600 dark:text-blue-400"
                          : ""
                      }
                    />
                    <span>Group</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-2">
          {/* Define unique gradients for each package */}
          {(() => {
            const getPackageGradient = () => {
              return "bg-slate-100 dark:bg-slate-700";
            };

            return (
              <>
                {/* Mobile: Stacked Cards */}
                <div className="block md:hidden space-y-4">
                  {currentPackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-[18px] transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800 ${
                        selectedPackage === pkg.id
                          ? "border-gray-300 dark:border-gray-600 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {/* Header - Only name and description */}
                      <div
                        className={`${getPackageGradient()} p-4 rounded-t-[16px] text-slate-800 dark:text-slate-200 text-center relative`}
                      >
                        <h3 className="text-lg font-semibold mb-1">
                          {pkg.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                          {pkg.description}
                        </p>

                        {/* Selection indicator in top right */}
                        {selectedPackage === pkg.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* Body - Price and benefits */}
                      <div className="p-4 space-y-3">
                        {/* Price as a line item */}
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

                        {/* Benefits */}
                        {pkg.benefits.map((benefit, benefitIndex) => (
                          <div
                            key={benefitIndex}
                            className="flex items-center gap-3 text-sm"
                          >
                            <CheckCircle
                              size={14}
                              className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                            />
                            <span className="text-gray-700 dark:text-gray-300">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Netflix-style Side by Side */}
                <div className="hidden md:grid md:grid-cols-3 gap-3">
                  {currentPackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-[18px] transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800 ${
                        selectedPackage === pkg.id
                          ? "border-gray-300 dark:border-gray-600 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="pt-2 pb-4 px-2">
                        {/* Header with Custom Radio Button */}
                        <div
                          className={`${getPackageGradient()} p-4 rounded-[12px] mb-4 flex items-center justify-between`}
                        >
                          <div>
                            <h3 className="text-sm md:text-lg font-semibold text-slate-800 dark:text-slate-200 md:mb-0.5">
                              {pkg.name}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-xs">
                              {pkg.description}
                            </p>
                          </div>
                          {selectedPackage === pkg.id && (
                            <div className="w-7 h-7 rounded-full bg-primary border-2 border-primary flex items-center justify-center transition-all duration-200 shadow-sm">
                              <Check size={16} className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* Netflix-style Feature List */}
                        <ul role="tabpanel" className="space-y-0">
                          <li className="py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="space-y-1">
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Total Price
                              </div>
                              <div>
                                <span className="text-lg font-bold text-gray-900 dark:text-gray-200">
                                  ${pkg.price}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  (${pkg.perSession} per session)
                                </span>
                              </div>
                            </div>
                          </li>
                          <li className="py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="space-y-1">
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Number of Sessions
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                {pkg.sessions}
                              </div>
                            </div>
                          </li>

                          {pkg.benefits.map((benefit, benefitIndex) => (
                            <li
                              key={benefitIndex}
                              className="py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            >
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  Benefit {benefitIndex + 1}
                                </div>
                                <div className="text-sm text-gray-900 dark:text-gray-200">
                                  {benefit}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
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
