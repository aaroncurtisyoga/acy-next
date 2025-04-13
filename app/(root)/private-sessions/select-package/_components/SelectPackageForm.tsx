import React, { FC, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderType } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  ALL_OFFERINGS,
  INDIVIDUAL,
} from "@/app/(root)/private-sessions/_lib/constants";
import { getPackageDetails } from "@/app/(root)/private-sessions/_lib/helpers";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import { AdditionalDescription } from "@/app/(root)/private-sessions/select-package/_components/AdditionalDescription";
import CheckoutButton from "@/app/(root)/private-sessions/select-package/_components/CheckoutButton";
import { PackageDescription } from "@/app/(root)/private-sessions/select-package/_components/PackageDescription";
import { PackageLabel } from "@/app/(root)/private-sessions/select-package/_components/PackageLabel";
import PrivateSessionOfferings from "@/app/(root)/private-sessions/select-package/_components/PrivateSessionOfferings";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/select-package/_components/SelectTypeOfPrivateSession";
import { checkoutOrder } from "@/app/_lib/actions/order.actions";
import { SelectPackageFormSchema } from "@/app/_lib/schema";

export type Inputs = z.infer<typeof SelectPackageFormSchema>;

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const SelectPackageForm: FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(SelectPackageFormSchema),
    defaultValues: {
      package: selectedPackageFromRedux ?? "",
    },
  });

  // Update form values if the Redux store changes
  useEffect(() => {
    if (selectedPackageFromRedux) {
      reset({ package: selectedPackageFromRedux }); // Reset form with new value if updated in Redux
    }
  }, [selectedPackageFromRedux, reset]);

  const onSubmit = async (data) => {
    const selectedPackage = data.package;
    dispatch(setSelectedPackage(data.package));
    // todo: when this becomes a wizard form, move this into redux
    const packageDetails = getPackageDetails(selectedPackage, ALL_OFFERINGS);

    const order = {
      buyerId: user.publicMetadata.userId as string,
      isFree: false,
      type: OrderType.PRIVATE_SESSION,
      name: packageDetails.package,
      price: packageDetails.price,
    };

    await checkoutOrder(order);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
    >
      <div className="mb-12">
        <PackageLabel />
        <PackageDescription />
        <AdditionalDescription />

        <SelectTypeOfPrivateSession
          setPrivateSessionType={setPrivateSessionType}
        />

        <Controller
          control={control}
          name="package"
          render={({ field, fieldState }) => (
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
  );
};

export default SelectPackageForm;
