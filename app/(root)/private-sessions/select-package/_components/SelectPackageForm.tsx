import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Check } from "lucide-react";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import CheckoutButtonSkeleton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButtonSkeleton";

// Package data structure
const packages = {
  individual: [
    {
      id: "starter",
      name: "Starter",
      sessions: 3,
      price: 405,
      perSession: 135,
      description: "Try out personalized yoga",
      benefits: [
        "Get familiar with Aaron's teaching style",
        "Build foundational practice",
        "Flexible scheduling",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Growth",
      sessions: 6,
      price: 720,
      perSession: 120,
      originalPrice: 810,
      savings: 90,
      description: "Develop a consistent practice",
      benefits: [
        "11% discount on sessions",
        "Deeper technique refinement",
        "Noticeable progress",
        "Priority booking",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      id: "transformation",
      name: "Transformation",
      sessions: 10,
      price: 1050,
      perSession: 105,
      originalPrice: 1350,
      savings: 300,
      description: "Commit to real change",
      benefits: [
        "22% discount on sessions",
        "Comprehensive program design",
        "Major breakthroughs",
        "VIP support between sessions",
      ],
      popular: false,
    },
  ],
  group: [
    {
      id: "starter",
      name: "Starter",
      sessions: 3,
      price: 465,
      perSession: 155,
      description: "Try out personalized yoga",
      benefits: [
        "Get familiar with Aaron's teaching style",
        "Build foundational practice",
        "Flexible scheduling",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Growth",
      sessions: 6,
      price: 810,
      perSession: 135,
      originalPrice: 930,
      savings: 120,
      description: "Develop a consistent practice",
      benefits: [
        "13% discount on sessions",
        "Deeper technique refinement",
        "Noticeable progress",
        "Priority booking",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      id: "transformation",
      name: "Transformation",
      sessions: 10,
      price: 1200,
      perSession: 120,
      originalPrice: 1550,
      savings: 350,
      description: "Commit to real change",
      benefits: [
        "23% discount on sessions",
        "Comprehensive program design",
        "Major breakthroughs",
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
        <div className="flex justify-center mb-0">
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

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-12">
          {currentPackages.map((pkg) => (
            <Card
              key={pkg.id}
              isPressable
              className={`relative transition-all duration-200 ${
                selectedPackage === pkg.id
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:ring-2 hover:ring-primary/50 hover:shadow-md border border-gray-200"
              } bg-white ${pkg.popular ? "md:-my-6 md:py-6" : ""}`}
              onPress={() => setSelectedPackage(pkg.id)}
            >
              <CardBody className={pkg.popular ? "px-6 py-8" : "p-6"}>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-900">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-[0.8rem] min-h-[2.5rem] flex items-start justify-center">
                    {pkg.description}
                  </p>

                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-1">
                      {pkg.sessions}
                    </div>
                    <div className="text-lg text-gray-600">sessions</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg px-4 py-2 mb-6">
                    <div className="text-lg font-semibold text-gray-900">
                      ${pkg.price}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${pkg.perSession}/session
                      {sessionType === "group" && (
                        <div className="text-xs text-gray-500 mt-1">
                          (per group, not per person)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  {pkg.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="flex-shrink-0">
                        <Check size={16} className="text-green-600" />
                      </div>
                      <span className="text-gray-700 leading-none">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
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

          {/* See all options link */}
          <Button
            variant="light"
            color="default"
            size="sm"
            className="text-gray-600"
          >
            See all options
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectPackageForm;
