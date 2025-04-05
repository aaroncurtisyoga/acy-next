import { FC } from "react";
import { Input } from "@heroui/react";
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
      render={({ field: { onChange, ...field } }) => (
        <Input
          isDisabled={isSubmitting}
          errorMessage={errors.maxAttendees?.message}
          isInvalid={!!errors.maxAttendees}
          label={"Max Attendees"}
          onChange={(e) => onChange(Number(e.target.value))}
          type={"number"}
          variant="bordered"
          {...field}
        />
      )}
    />
  );
};

export default MaxAttendees;
