import React, { FC } from "react";
import { Checkbox } from "@heroui/react";
import { Control, Controller } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface IsHostedExternallyCheckboxProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
}

const IsHostedExternallyCheckbox: FC<IsHostedExternallyCheckboxProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <Controller
      control={control}
      name={"isHostedExternally" satisfies keyof EventFormValues}
      render={({ field: { value, onChange, ...field } }) => (
        <Checkbox
          isDisabled={isSubmitting}
          size={"md"}
          onChange={onChange}
          isSelected={value}
          {...field}
          classNames={{
            label: "text-sm font-normal",
          }}
        >
          People sign up on a different app
        </Checkbox>
      )}
    />
  );
};

export default IsHostedExternallyCheckbox;
