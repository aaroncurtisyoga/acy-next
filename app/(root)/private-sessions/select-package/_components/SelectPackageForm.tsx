import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import { INDIVIDUAL } from "@/app/(root)/private-sessions/_lib/constants";
import { calculateSessionPricing } from "@/app/(root)/private-sessions/_lib/helpers";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import CheckoutButton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButton";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/select-package/_components/SelectTypeOfPrivateSession";
import SessionCountSelector from "@/app/(root)/private-sessions/select-package/_components/SessionCountSelector";
import { SelectPackageFormSchema } from "@/app/_lib/schema";

export type Inputs = z.infer<typeof SelectPackageFormSchema>;

const SelectPackageForm: FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { updateFormData, goToNextStep } = useWizardForm();
  const router = useRouter();
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);

  const methods = useForm<Inputs>({
    resolver: zodResolver(SelectPackageFormSchema),
    defaultValues: {
      sessionCount: 3,
    },
  });

  const onSubmit = async (data: Inputs) => {
    const sessionPurchase = calculateSessionPricing(
      privateSessionType,
      data.sessionCount,
    );

    // Save form data to context
    updateFormData({
      sessionType: privateSessionType,
      sessionCount: data.sessionCount,
      sessionPurchase: sessionPurchase,
      customerInfo: {
        email: user?.emailAddresses[0]?.emailAddress || "",
        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      },
    });

    // Navigate to checkout
    goToNextStep();
    router.push("/private-sessions/checkout");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          methods.handleSubmit(onSubmit)(e);
        }}
      >
        {/* Step Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-[32px] font-medium text-gray-900 mb-2">
            Select your sessions.
          </h1>
          <p className="text-gray-600">
            Choose the session type and number of sessions that best fits your
            needs.
          </p>
        </div>
        <div className="mb-12">
          <SelectTypeOfPrivateSession
            setPrivateSessionType={setPrivateSessionType}
          />

          <Controller
            control={methods.control}
            name="sessionCount"
            render={({ fieldState }) => (
              <>
                <SessionCountSelector
                  sessionType={privateSessionType}
                  name="sessionCount"
                />
                {fieldState.error && (
                  <p className="text-danger-500 text-center mt-3">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
        <CheckoutButton />{" "}
      </form>
    </FormProvider>
  );
};

export default SelectPackageForm;
