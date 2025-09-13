import React, { FC } from "react";
import { Input, Switch } from "@heroui/react";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface PriceInputProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
}

const PriceInput: FC<PriceInputProps> = ({ control, isSubmitting, errors }) => {
  const isFree = useWatch({ control, name: "isFree" });

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name={"price" satisfies keyof EventFormValues}
        render={({ field }) => (
          <Input
            isDisabled={isSubmitting || isFree}
            errorMessage={errors.price?.message}
            isInvalid={!!errors.price}
            label={"Price"}
            onChange={field.onChange}
            placeholder={isFree ? "Free" : "0.00"}
            startContent={
              !isFree && (
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              )
            }
            type={"number"}
            variant="bordered"
            {...field}
            value={isFree ? "" : field.value?.toString() || ""}
          />
        )}
      />

      <Controller
        control={control}
        name={"isFree" satisfies keyof EventFormValues}
        render={({ field }) => (
          <Switch
            isDisabled={isSubmitting}
            isSelected={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              // Clear price when marking as free
              if (value) {
                control._formValues.price = "";
              }
            }}
            classNames={{
              wrapper: "group-data-[selected=true]:bg-success",
            }}
          >
            <span className="text-sm">This is a free event</span>
          </Switch>
        )}
      />
    </div>
  );
};

export default PriceInput;
