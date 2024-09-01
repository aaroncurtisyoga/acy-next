import { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/react";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/DetailsForExternallyHostedEvent";

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
          isInvalid={!!errors.externalRegistrationUrl}
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
