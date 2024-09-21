import React, { FC, useState } from "react";
import { Link, RadioGroup } from "@nextui-org/react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/_lib/redux/hooks";
import SelectTypeOfPrivateSession from "@/app/(root)/private-sessions/(select-package)/_components/SelectTypeOfPrivateSession";
import PrivateSessionOfferings from "@/app/(root)/private-sessions/(select-package)/_components/PrivateSessionOfferings";
import CheckoutButton from "@/app/(root)/private-sessions/(select-package)/_components/CheckoutButton";
import { setSelectedPackage } from "@/_lib/redux/features/privateSessionFormSlice";
import { SessionType } from "@/app/(root)/private-sessions/_lib/types";
import { INDIVIDUAL } from "@/app/(root)/private-sessions/_lib/constants";
import { SelectPackageFormSchema } from "@/_lib/schema";

export type Inputs = z.infer<typeof SelectPackageFormSchema>;

const SelectPackageForm: FC = () => {
  const dispatch = useAppDispatch();
  const [privateSessionType, setPrivateSessionType] =
    useState<SessionType>(INDIVIDUAL);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(SelectPackageFormSchema),
  });

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
        name={"selectedPackage"}
        render={({ field }) => (
          <RadioGroup
            isDisabled={isSubmitting}
            errorMessage={errors.selectedPackage?.message}
            onValueChange={(value) => {
              dispatch(setSelectedPackage(value));
            }}
            className={"mb-12"}
            label={
              <h1
                className={
                  "text-center text-4xl font-bold mb-2 mt-12" +
                  " tracking-tight"
                }
              >
                Train With Me
              </h1>
            }
            description={
              <p className={"text-center mt-3"}>
                Select the type of private session you&apos;d like to book.
              </p>
            }
          >
            <p className={"text-gray-500 max-w-xl text-center mx-auto mb-5"}>
              Private sessions allow me to connect with you on a personal level,
              focusing on your unique needs. Whether we&apos;re working on
              specific postures, meditation, improving movement, or mentoring
              for teaching, my goal is to share everything I’ve learned to help
              you achieve your goals. If you have any questions, please{" "}
              <Link
                isExternal
                underline={"always"}
                href="https://www.instagram.com/aaroncurtisyoga/"
              >
                reach out
              </Link>
              —I look forward to working with you!
            </p>
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
