import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";

interface TitleInputProps {
  control: Control;
  isSubmitting: boolean;
  errors: {
    title?: {
      message: string;
    };
  };
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
