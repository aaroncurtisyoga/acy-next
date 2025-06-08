import React, { FC } from "react";
import { Input } from "@heroui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface PriceInputProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
}

const PriceInput: FC<PriceInputProps> = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name={"price" satisfies keyof EventFormValues}
      render={({ field }) => (
        <Input
          isDisabled={isSubmitting}
          errorMessage={errors.price?.message}
          isInvalid={!!errors.price}
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
          value={field.value?.toString() || ""}
        />
      )}
    />
  );
};

export default PriceInput;
