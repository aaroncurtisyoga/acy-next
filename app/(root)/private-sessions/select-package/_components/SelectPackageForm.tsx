import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Check, CheckCircle } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButtonSkeleton";

// Package data structure
const packages = {
  individual: [
    {
      id: "starter",
      name: "Single Session",
      sessions: 1,
      price: 135,
      perSession: 135,
      description: "Try out personalized yoga",
      benefits: [
        "Get familiar with Aaron's teaching style",
        "Experience personalized approach",
        "Flexible scheduling",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Foundation",
      sessions: 3,
      price: 405,
      perSession: 135,
      description: "Build your practice foundation",
      benefits: [
        "Develop consistent routine",
        "Learn fundamental techniques",
        "Progress tracking",
        "Priority booking",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      id: "transformation",
      name: "Growth",
      sessions: 6,
      price: 720,
      perSession: 120,
      originalPrice: 810,
      savings: 90,
      description: "Develop a consistent practice",
      benefits: [
        "11% discount on sessions",
        "Comprehensive technique refinement",
        "Noticeable progress",
        "VIP support between sessions",
      ],
      popular: false,
    },
  ],
  group: [
    {
      id: "starter",
      name: "Single Session",
      sessions: 1,
      price: 155,
      perSession: 155,
      description: "Try out personalized yoga",
      benefits: [
        "Get familiar with Aaron's teaching style",
        "Experience personalized approach",
        "Flexible scheduling",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Foundation",
      sessions: 3,
      price: 465,
      perSession: 155,
      description: "Build your practice foundation",
      benefits: [
        "Develop consistent routine",
        "Learn fundamental techniques",
        "Progress tracking",
        "Priority booking",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      id: "transformation",
      name: "Growth",
      sessions: 6,
      price: 810,
      perSession: 135,
      originalPrice: 930,
      savings: 120,
      description: "Develop a consistent practice",
      benefits: [
        "13% discount on sessions",
        "Comprehensive technique refinement",
        "Noticeable progress",
        "VIP support between sessions",
      ],
      popular: false,
    },
  ],
};

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
        ...(selectedPkg.savings && {
          discount: {
            percentage: Math.round(
              (selectedPkg.savings /
                (selectedPkg.originalPrice || selectedPkg.price)) *
                100,
            ),
            amount: selectedPkg.savings,
            label: `Save $${selectedPkg.savings}`,
          },
        }),
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 mb-2">
            Select your package.
          </h1>
          <p className="text-gray-600">
            Choose the package that best fits your yoga journey.
          </p>
        </div>

        {/* Session Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <Button
              variant={sessionType === "individual" ? "solid" : "light"}
              color={sessionType === "individual" ? "primary" : "default"}
              className="min-w-[120px]"
              onPress={() => setSessionType("individual")}
            >
              Individual
            </Button>
            <Button
              variant={sessionType === "group" ? "solid" : "light"}
              color={sessionType === "group" ? "primary" : "default"}
              className="min-w-[120px]"
              onPress={() => setSessionType("group")}
            >
              Group
            </Button>
          </div>
        </div>

        {/* Package Selection */}
        <div className="my-12">
          {/* Define unique gradients for each package */}
          {(() => {
            const getPackageGradient = () => {
              return "bg-gradient-to-r from-slate-700 to-slate-500";
            };

            return (
              <>
                {/* Mobile: Stacked Cards */}
                <div className="block md:hidden space-y-4">
                  {currentPackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="p-4">
                        {/* Header */}
                        <div
                          className={`${getPackageGradient()} p-4 rounded-lg text-white text-center mb-4`}
                        >
                          <h3 className="text-lg font-semibold mb-1">
                            {pkg.name}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {pkg.description}
                          </p>
                          <div className="mt-3 text-xl font-bold">
                            ${pkg.price}
                          </div>
                          <div className="text-white/90 text-sm">
                            ${pkg.perSession}/session
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
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                  {currentPackages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        selectedPackage === pkg.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="p-6">
                        {/* Header with Custom Radio Button */}
                        <div
                          className={`${getPackageGradient()} p-4 rounded-lg mb-4 flex items-center justify-between`}
                        >
                          <div>
                            <h3 className="text-sm font-semibold text-white">
                              {pkg.name}
                            </h3>
                            <p className="text-white/90 text-xs">
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
                              <div className="text-lg font-bold text-gray-900">
                                ${pkg.price}
                              </div>
                              <div className="text-sm text-gray-600">
                                ${pkg.perSession}/session
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
                          {pkg.savings && (
                            <li className="py-3 border-b border-gray-200">
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600">
                                  You Save
                                </div>
                                <div className="text-sm font-medium text-green-600">
                                  ${pkg.savings}
                                </div>
                              </div>
                            </li>
                          )}
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
