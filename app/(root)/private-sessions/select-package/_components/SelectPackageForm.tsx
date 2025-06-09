import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { useWizardForm } from "@/app/(root)/private-sessions/_lib/_context/FormContext";
import {
  ALL_OFFERINGS,
  INDIVIDUAL,
} from "@/app/(root)/private-sessions/_lib/constants";
import { getPackageDetails } from "@/app/(root)/private-sessions/_lib/helpers";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import CheckoutButton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButton";
import { PackageDescription } from "@/app/(root)/private-sessions/select-package/_components/PackageDescription";
import PrivateSessionOfferings from "@/app/(root)/private-sessions/select-package/_components/PrivateSessionOfferings";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/select-package/_components/SelectTypeOfPrivateSession";
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
      package: "",
    },
  });

  const onSubmit = async (data: Inputs) => {
    const selectedPackage = data.package;
    const packageDetails = getPackageDetails(selectedPackage, ALL_OFFERINGS);

    if (!packageDetails) {
      console.error("Package details not found");
      return;
    }

    // Save form data to context
    updateFormData({
      sessionType: privateSessionType,
      package: selectedPackage,
      packageDetails: packageDetails,
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
        <div className="mb-12">
          <PackageDescription />

          <SelectTypeOfPrivateSession
            setPrivateSessionType={setPrivateSessionType}
          />

          <Controller
            control={methods.control}
            name="package"
            render={({ fieldState }) => (
              <>
                <PrivateSessionOfferings
                  privateSessionType={privateSessionType}
                  name="package"
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
