import { FC } from "react";
import { DatePicker } from "@heroui/date-picker";
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface StartDatePickerInputProps {
  control: Control<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  isSubmitting: boolean;
  onChange?: (value: any) => void;
  rules?: RegisterOptions<EventFormValues, "startDateTime">;
}

const StartDatePickerInput: FC<StartDatePickerInputProps> = ({
  control,
  errors,
  isSubmitting,
  onChange,
  rules,
}) => {
  return (
    <Controller
      control={control}
      name={"startDateTime" satisfies keyof EventFormValues}
      rules={rules}
      render={({ field }) => {
        return (
          <div className={"w-full flex flex-col"}>
            <DatePicker
              errorMessage={errors.startDateTime?.message as string}
              isDisabled={isSubmitting}
              isInvalid={!!errors.startDateTime}
              hideTimeZone
              onChange={onChange || field.onChange}
              variant={"bordered"}
              label={"Start Date/Time"}
              value={field.value}
              isRequired={!!rules?.required}
            />
          </div>
        );
      }}
    />
  );
};

export default StartDatePickerInput;
