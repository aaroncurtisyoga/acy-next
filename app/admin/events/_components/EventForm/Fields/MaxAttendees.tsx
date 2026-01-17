import { FC } from "react";
import { Input } from "@heroui/input";
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
        <Input
          isDisabled={isSubmitting}
          errorMessage={errors.maxAttendees?.message}
          isInvalid={!!errors.maxAttendees}
          label={"Max Attendees"}
          type={"number"}
          variant="bordered"
          value={field.value?.toString() ?? ""}
          onChange={(e) =>
            field.onChange(e.target.value ? Number(e.target.value) : undefined)
          }
          onBlur={field.onBlur}
          name={field.name}
        />
      )}
    />
  );
};

export default MaxAttendees;
