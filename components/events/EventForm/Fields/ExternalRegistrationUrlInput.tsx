import { Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";
const ExternalRegistrationUrlInput = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name={"externalRegistrationUrl"}
      render={({ field }) => (
        <Input
          disabled={isSubmitting}
          errorMessage={errors.externalRegistrationUrl?.message}
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

export default ExternalRegistrationUrlInput;
