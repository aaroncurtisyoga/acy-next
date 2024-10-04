import React, { FC } from "react";
import { Input } from "@nextui-org/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

interface TitleInputProps {
  control: Control;
  isSubmitting: boolean;
  errors: FieldErrors<Inputs>;
}

const TitleInput: FC<TitleInputProps> = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name={"title"}
      render={({ field }) => (
        <Input
          isDisabled={isSubmitting}
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
          label={"Event Name"}
          onChange={field.onChange}
          type={"text"}
          variant="bordered"
          {...field}
        />
      )}
    />
  );
};

export default TitleInput;
