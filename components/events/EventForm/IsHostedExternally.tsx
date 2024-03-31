import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox } from "@nextui-org/react";

const IsHostedExternally = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name={"isHostedExternally"}
      render={({ field }) => (
        <Checkbox disabled={isSubmitting} {...field}>
          Event registration managed by an external platform?
        </Checkbox>
      )}
    />
  );
};

export default IsHostedExternally;
