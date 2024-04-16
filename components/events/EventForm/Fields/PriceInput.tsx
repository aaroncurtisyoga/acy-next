import React, { FC } from "react";
import { Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";

interface PriceInputProps {
  control: any;
  isSubmitting: boolean;
  errors: any;
}

const PriceInput: FC<PriceInputProps> = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name={"price"}
      render={({ field }) => (
        <Input
          disabled={isSubmitting}
          errorMessage={errors.price?.message}
          label={"Price"}
          onChange={(e) => field.onChange(e)}
          placeholder={"0.00"}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
          type={"number"}
          variant="bordered"
          {...field}
        />
      )}
    />
  );
};

export default PriceInput;
