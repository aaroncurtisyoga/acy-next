import React, { FC, useEffect, useState } from "react";
import { Link, RadioGroup } from "@nextui-org/react";
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
import { INDIVIDUAL } from "@/app/(root)/private-sessions/_lib/constants";
import { SelectPackageFormSchema } from "@/_lib/schema";
import { PackageLabel } from "@/app/(root)/private-sessions/(select-package)/_components/PackageLabel";
import { PackageDescription } from "@/app/(root)/private-sessions/(select-package)/_components/PackageDescription";
import { AdditionalDescription } from "@/app/(root)/private-sessions/(select-package)/_components/AdditionalDescription";

export type Inputs = z.infer<typeof SelectPackageFormSchema>;

const SelectPackageForm: FC = () => {
  const dispatch = useAppDispatch();
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);
  const selectedPackageFromRedux: Inputs = useAppSelector(selectedPackage);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(SelectPackageFormSchema),
    defaultValues: selectedPackageFromRedux,
  });

  useEffect(() => {
    // update the form’s default values when the Redux store changes
    if (selectedPackageFromRedux) {
      reset(selectedPackageFromRedux);
    }
  }, [selectedPackageFromRedux, reset]);

  const onSubmit = (data) => {};

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
            onValueChange={(value) => {
              dispatch(setSelectedPackage(value));
            }}
            className={"mb-12"}
            label={<PackageLabel />}
            description={<PackageDescription />}
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
