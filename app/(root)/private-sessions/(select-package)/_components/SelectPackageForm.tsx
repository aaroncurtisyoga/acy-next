import React, { FC, useEffect, useState } from "react";
import { RadioGroup } from "@nextui-org/react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/_lib/redux/hooks";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/(select-package)/_components/SelectTypeOfPrivateSession";
import PrivateSessionOfferings from "@/app/(root)/private-sessions/(select-package)/_components/PrivateSessionOfferings";
import CheckoutButton from "@/app/(root)/private-sessions/(select-package)/_components/CheckoutButton";
import {
  selectedPackage,
  setSelectedPackage,
} from "@/_lib/redux/features/privateSessionFormSlice";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import {
  ALL_OFFERINGS,
  INDIVIDUAL,
} from "@/app/(root)/private-sessions/_lib/constants";
import { SelectPackageFormSchema } from "@/_lib/schema";
import { PackageLabel } from "@/app/(root)/private-sessions/(select-package)/_components/PackageLabel";
import { PackageDescription } from "@/app/(root)/private-sessions/(select-package)/_components/PackageDescription";
import { AdditionalDescription } from "@/app/(root)/private-sessions/(select-package)/_components/AdditionalDescription";
import { getPackageDetails } from "@/app/(root)/private-sessions/_lib/helpers";
import { useUser } from "@clerk/nextjs";
import { OrderType } from "@prisma/client";

export type Inputs = z.infer<typeof SelectPackageFormSchema>;

const SelectPackageForm: FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const dispatch = useAppDispatch();
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);
  const selectedPackageFromRedux = useAppSelector(selectedPackage);
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

  const onSubmit = (data) => {
    console.log("inside onSubmit", data);
    const selectedPackage = data.package;
    dispatch(setSelectedPackage(data.package));
    // when this becomes a wizard form, move this into redux
    const packageDetails = getPackageDetails(selectedPackage, ALL_OFFERINGS);
    //   make the api call here

    const order = {
      buyerId: user.publicMetadata.userId as string,
      // name: 'placeholder'
      type: OrderType.PRIVATE_SESSION,
    };
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
    >
      <Controller
        control={control}
        name={"package"}
        render={({ field }) => (
          <RadioGroup
            isDisabled={isSubmitting}
            isInvalid={!!errors.package}
            errorMessage={errors.package?.message}
            onValueChange={field.onChange}
            className={"mb-12"}
            classNames={{
              errorMessage: "text-center mt-3",
            }}
            label={<PackageLabel />}
            description={<PackageDescription />}
            value={field.value}
            {...field}
          >
            <AdditionalDescription />
            <SelectTypeOfPrivateSession
              setPrivateSessionType={setPrivateSessionType}
            />
            <PrivateSessionOfferings privateSessionType={privateSessionType} />
          </RadioGroup>
        )}
      />
      <CheckoutButton />
    </form>
  );
};

export default SelectPackageForm;
