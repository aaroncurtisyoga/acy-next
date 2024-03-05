import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";

const Title = ({ control, isSubmitting, errors }) => {
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

export default Title;
