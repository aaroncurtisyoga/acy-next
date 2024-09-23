import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { Checkbox } from "@nextui-org/react";

interface IsHostedExternallyCheckboxProps {
  control: Control;
  isSubmitting: boolean;
}

const IsHostedExternallyCheckbox: FC<IsHostedExternallyCheckboxProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <Controller
      control={control}
      name={"isHostedExternally"}
      render={({ field }) => (
        <Checkbox
          isDisabled={isSubmitting}
          size={"lg"}
          onChange={field.onChange}
          isSelected={field.value}
          {...field}
        >
          People sign up on a different app
        </Checkbox>
      )}
    />
  );
};

export default IsHostedExternallyCheckbox;
