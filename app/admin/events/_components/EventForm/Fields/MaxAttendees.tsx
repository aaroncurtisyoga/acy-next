import { FC } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/app/_lib/utils";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface MaxAttendeesProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
}

const MaxAttendees: FC<MaxAttendeesProps> = ({
  control,
  isSubmitting,
  errors,
}) => {
  return (
    <Controller
      control={control}
      name={"maxAttendees" satisfies keyof EventFormValues}
      render={({ field }) => (
        <FormField label="Max Attendees" error={errors.maxAttendees?.message}>
          <Input
            disabled={isSubmitting}
            className={cn(errors.maxAttendees && "border-destructive")}
            type="number"
            value={field.value?.toString() ?? ""}
            onChange={(e) =>
              field.onChange(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            onBlur={field.onBlur}
            name={field.name}
          />
        </FormField>
      )}
    />
  );
};

export default MaxAttendees;
