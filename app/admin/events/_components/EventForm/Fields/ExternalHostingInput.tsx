import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/app/_lib/utils";
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
          <FormField
            label="Registration URL"
            error={errors.externalRegistrationUrl?.message}
          >
            <Input
              disabled={isSubmitting || !isHostedExternally}
              className={cn(
                errors.externalRegistrationUrl && "border-destructive",
              )}
              placeholder={
                isHostedExternally
                  ? "https://example.com/register"
                  : "Internal registration"
              }
              type="url"
              value={isHostedExternally ? field.value || "" : ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              name={field.name}
            />
            <p className="text-xs text-muted-foreground">
              {isHostedExternally
                ? "The URL where people will sign up for this event"
                : "Registration handled internally"}
            </p>
          </FormField>
        )}
      />

      <Controller
        control={control}
        name={"isHostedExternally" satisfies keyof EventFormValues}
        render={({ field: { value, onChange, ...field } }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              disabled={isSubmitting}
              checked={value}
              onCheckedChange={(checked) => {
                onChange(checked);
                if (!checked) {
                  setValue("externalRegistrationUrl", "");
                }
              }}
              {...field}
            />
            <Label className="text-sm font-normal">
              People sign up on a different app
            </Label>
          </div>
        )}
      />
    </div>
  );
};

export default ExternalHostingInput;
