import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button, Tooltip } from "@heroui/react";
import { Check, CheckCircle, User, Users } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButtonSkeleton";
import { ProgressStepper } from "@/app/(root)/private-sessions/select-package/_components/ProgressStepper";
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
        {/* Progress Stepper - Left-aligned to match content */}
        <div className="text-left mb-6">
          <ProgressStepper currentStep={3} totalSteps={4} />
        </div>

        {/* Header and Session Type Selection */}
        <div className="mb-6">
          {/* Header */}
          <div className="text-left mb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:items-center mb-2">
              <h1 className="text-2xl md:text-[32px] font-medium text-gray-900">
                Select your package.
              </h1>

              {/* Session Type Toggle - Moved to headline level */}
              <div className="flex gap-1 mt-2 sm:mt-0">
                <Tooltip content="Individual Sessions" placement="bottom">
                  <button
                    onClick={() => setSessionType("individual")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      sessionType === "individual"
                        ? "bg-slate-300 text-slate-900 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      <span>Individual</span>
                    </div>
                  </button>
                </Tooltip>
                <Tooltip content="Group Sessions" placement="bottom">
                  <button
                    onClick={() => setSessionType("group")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      sessionType === "group"
                        ? "bg-slate-300 text-slate-900 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Users size={14} />
                      <span>Group</span>
                    </div>
                  </button>
                </Tooltip>
              </div>
            </div>

            <p className="text-gray-600">
              Choose the package that best fits your yoga journey.
            </p>
          </div>
        </div>

        {/* Package Selection */}
        <div className="my-12">
          {/* Define unique gradients for each package */}
          {(() => {
            const getPackageGradient = () => {
              return "bg-slate-50";
            };

            return (
              <>
                {/* Mobile: Stacked Cards */}
                <div className="block md:hidden space-y-4">
                  {currentPackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-[18px] transition-all duration-200 cursor-pointer ${
                        selectedPackage === pkg.id
                          ? "border-gray-300"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="p-4">
                        {/* Header */}
                        <div
                          className={`${getPackageGradient()} p-4 rounded-[12px] text-slate-800 text-center mb-4`}
                        >
                          <h3 className="text-lg font-semibold mb-1">
                            {pkg.name}
                          </h3>
                          <p className="text-slate-600 text-sm">
                            {pkg.description}
                          </p>
                          <div className="mt-3">
                            <span className="text-xl font-bold">
                              ${pkg.price}
                            </span>
                            <span className="text-xs text-slate-500 ml-2">
                              (${pkg.perSession} per session)
                            </span>
                          </div>
                        </div>

                        {/* Custom Radio Button */}
                        <div className="flex justify-center mb-4">
                          {selectedPackage === pkg.id && (
                            <div className="w-6 h-6 rounded-full border-2 bg-white border-primary flex items-center justify-center transition-all duration-200">
                              <Check size={14} className="text-primary" />
                            </div>
                          )}
                        </div>

                        {/* Benefits */}
                        <div className="space-y-2">
                          {pkg.benefits.map((benefit, benefitIndex) => (
                            <div
                              key={benefitIndex}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle
                                size={14}
                                className="text-green-600 flex-shrink-0"
                              />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Netflix-style Side by Side */}
                <div className="hidden md:grid md:grid-cols-3 gap-3">
                  {currentPackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-[18px] transition-all duration-200 cursor-pointer ${
                        selectedPackage === pkg.id
                          ? "border-gray-300"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="pt-2 pb-4 px-2">
                        {/* Header with Custom Radio Button */}
                        <div
                          className={`${getPackageGradient()} p-4 rounded-[12px] mb-4 flex items-center justify-between`}
                        >
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                              {pkg.name}
                            </h3>
                            <p className="text-slate-600 text-xs">
                              {pkg.description}
                            </p>
                          </div>
                          {selectedPackage === pkg.id && (
                            <div className="w-6 h-6 rounded-full border-2 bg-white border-white flex items-center justify-center transition-all duration-200">
                              <Check size={14} className="text-primary" />
                            </div>
                          )}
                        </div>

                        {/* Netflix-style Feature List */}
                        <ul role="tabpanel" className="space-y-0">
                          <li className="py-3 border-b border-gray-200">
                            <div className="space-y-1">
                              <div className="text-xs text-gray-600">
                                Total Price
                              </div>
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
                              <div className="text-xs text-gray-600">
                                Number of Sessions
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {pkg.sessions}
                              </div>
                            </div>
                          </li>

                          {pkg.benefits.map((benefit, benefitIndex) => (
                            <li
                              key={benefitIndex}
                              className="py-3 border-b border-gray-200 last:border-b-0"
                            >
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600">
                                  Benefit {benefitIndex + 1}
                                </div>
                                <div className="text-sm text-gray-900">
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

        {/* Checkout Button */}
        <div className="flex flex-col items-center gap-4">
          {!isUserLoaded ? (
            <CheckoutButtonSkeleton />
          ) : (
            <>
              <SignedOut>
                <SignInButton>
                  <Button color="primary" size="lg" className="w-full max-w-md">
                    Sign In to Purchase
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full max-w-md"
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
