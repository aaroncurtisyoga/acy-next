import { FC } from "react";
import { DatePicker } from "@heroui/date-picker";
import { Control, Controller, FieldErrors } from "react-hook-form";
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
        <div className={"w-full flex flex-col"}>
          <DatePicker
            isDisabled={isSubmitting}
            hideTimeZone
            isInvalid={!!errors.endDateTime}
            errorMessage={errors.endDateTime?.message as string}
            onChange={field.onChange}
            variant={"bordered"}
            label={"End Date/Time"}
            value={field.value}
          />
        </div>
      )}
    />
  );
};

export default EndDatePickerInput;
