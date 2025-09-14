import React, { FC } from "react";
import { Input, Checkbox } from "@heroui/react";
import {
  Control,
  Controller,
  FieldErrors,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface ExternalHostingInputProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
}

const ExternalHostingInput: FC<ExternalHostingInputProps> = ({
  control,
  isSubmitting,
  errors,
}) => {
  const { setValue } = useFormContext<EventFormValues>();
  const isHostedExternally = useWatch({ control, name: "isHostedExternally" });

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name={"externalRegistrationUrl" satisfies keyof EventFormValues}
        render={({ field }) => (
          <Input
            isDisabled={isSubmitting || !isHostedExternally}
            isInvalid={!!errors.externalRegistrationUrl}
            errorMessage={errors.externalRegistrationUrl?.message}
            label={"Registration URL"}
            placeholder={
              isHostedExternally
                ? "https://example.com/register"
                : "Internal registration"
            }
            description={
              isHostedExternally
                ? "The URL where people will sign up for this event"
                : "Registration handled internally"
            }
            onChange={(e) => field.onChange(e)}
            type={"url"}
            variant="bordered"
            {...field}
            value={isHostedExternally ? field.value || "" : ""}
          />
        )}
      />

      <Controller
        control={control}
        name={"isHostedExternally" satisfies keyof EventFormValues}
        render={({ field: { value, onChange, ...field } }) => (
          <Checkbox
            isDisabled={isSubmitting}
            size={"md"}
            onChange={(checked) => {
              onChange(checked);
              // Clear the URL when unchecking
              if (!checked) {
                setValue("externalRegistrationUrl", "");
              }
            }}
            isSelected={value}
            {...field}
            classNames={{
              label: "text-sm font-normal",
            }}
          >
            People sign up on a different app
          </Checkbox>
        )}
      />
    </div>
  );
};

export default ExternalHostingInput;
