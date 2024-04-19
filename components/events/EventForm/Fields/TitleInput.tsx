import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Inputs } from "@/components/events/EventForm";

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
          disabled={isSubmitting}
          errorMessage={errors.title?.message}
          label={"Title"}
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
