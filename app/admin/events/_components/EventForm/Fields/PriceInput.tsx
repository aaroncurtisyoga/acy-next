import React, { FC } from "react";
import { Input } from "@nextui-org/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

interface PriceInputProps {
  control: Control;
  isSubmitting: boolean;
  errors: FieldErrors<Inputs>;
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
          onChange={field.onChange}
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
