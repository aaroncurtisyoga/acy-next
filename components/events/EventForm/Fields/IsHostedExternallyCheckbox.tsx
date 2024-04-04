import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox } from "@nextui-org/react";

const IsHostedExternallyCheckbox = ({ control, isSubmitting }) => {
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
