import { FC } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/app/_lib/utils";
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
        <FormField
          label="Registration URL"
          error={errors.externalRegistrationUrl?.message}
        >
          <Input
            disabled={isSubmitting}
            className={cn(
              errors.externalRegistrationUrl && "border-destructive",
            )}
            placeholder="https://example.com/register"
            type="url"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
          />
          <p className="text-xs text-muted-foreground">
            The URL where people will sign up for this event
          </p>
        </FormField>
      )}
    />
  );
};

export default ExternalRegistrationUrlInput;
