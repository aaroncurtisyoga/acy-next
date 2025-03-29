import { FC } from "react";
import { Input } from "@heroui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

interface MaxAttendeesProps {
  control: Control;
  isSubmitting: boolean;
  errors: FieldErrors<Inputs>;
}

const MaxAttendees: FC<MaxAttendeesProps> = ({
  control,
  isSubmitting,
  errors,
}) => {
  return (
    <Controller
      control={control}
      name={"maxAttendees"}
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
