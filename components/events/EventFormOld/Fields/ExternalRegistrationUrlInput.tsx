import { FC } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@nextui-org/react";

interface ExternalRegistrationUrlInputProps {
  control: any;
  isSubmitting: boolean;
  errors: any;
}

const ExternalRegistrationUrlInput: FC<ExternalRegistrationUrlInputProps> = ({
  control,
  isSubmitting,
  errors,
}) => {
  return (
    <Controller
      control={control}
      name={"externalRegistrationUrl"}
      render={({ field }) => (
        <Input
          disabled={isSubmitting}
          errorMessage={errors.externalRegistrationUrl?.message}
          label={"External Registration URL"}
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
