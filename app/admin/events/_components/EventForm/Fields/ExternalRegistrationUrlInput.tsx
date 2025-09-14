import { FC } from "react";
import { Input } from "@heroui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface ExternalRegistrationUrlInputProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
}

const ExternalRegistrationUrlInput: FC<ExternalRegistrationUrlInputProps> = ({
  control,
  isSubmitting,
  errors,
}) => {
  return (
    <Controller
      control={control}
      name={"externalRegistrationUrl" satisfies keyof EventFormValues}
      render={({ field }) => (
        <Input
          isDisabled={isSubmitting}
          isInvalid={!!errors.externalRegistrationUrl}
          errorMessage={errors.externalRegistrationUrl?.message}
          label={"Registration URL"}
          placeholder={"https://example.com/register"}
          description={"The URL where people will sign up for this event"}
          onChange={(e) => field.onChange(e)}
          type={"url"}
          variant="bordered"
          {...field}
        />
      )}
    />
  );
};

export default ExternalRegistrationUrlInput;
