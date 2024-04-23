import { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Inputs } from "@/components/events/EventForm/Steps/DetailsForExternallyHostedEvent";

interface ExternalRegistrationUrlInputProps {
  control: Control;
  isSubmitting: boolean;
  errors: FieldErrors<Inputs>;
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
