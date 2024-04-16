import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/react";

// Todo: see if FieldErrors is the correct thing b/c its complaining below
interface TitleInputProps {
  control: Control;
  isSubmitting: boolean;
  errors: FieldErrors;
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
          onChange={(e) => field.onChange(e)}
          type={"text"}
          variant="bordered"
          {...field}
        />
      )}
    />
  );
};

export default TitleInput;
