import { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface EndDatePickerInputProps {
  control: Control<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  isSubmitting: boolean;
}

const EndDatePickerInput: FC<EndDatePickerInputProps> = ({
  control,
  errors,
  isSubmitting,
}) => {
  return (
    <Controller
      control={control}
      name={"endDateTime" satisfies keyof EventFormValues}
      render={({ field }) => (
        <DateTimePicker
          label="End Date/Time"
          value={
            field.value instanceof Date
              ? field.value
              : field.value
                ? new Date(field.value)
                : undefined
          }
          onChange={field.onChange}
          disabled={isSubmitting}
          error={errors.endDateTime?.message as string}
        />
      )}
    />
  );
};

export default EndDatePickerInput;
