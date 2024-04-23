import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
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
        <Checkbox disabled={isSubmitting} {...field} size={"lg"}>
          External Registration
        </Checkbox>
      )}
    />
  );
};

export default IsHostedExternallyCheckbox;
