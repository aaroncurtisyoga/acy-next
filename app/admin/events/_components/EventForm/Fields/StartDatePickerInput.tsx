import React, { FC } from "react";
import { DatePicker } from "@heroui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface StartDatePickerInputProps {
  control: Control<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  isSubmitting: boolean;
}

const StartDatePickerInput: FC<StartDatePickerInputProps> = ({
  control,
  errors,
  isSubmitting,
}) => {
  return (
    <Controller
      control={control}
      name={"startDateTime" satisfies keyof EventFormValues}
      render={({ field }) => {
        return (
          <div className={"w-full flex flex-col"}>
            <DatePicker
              errorMessage={errors.startDateTime?.message as string}
              isDisabled={isSubmitting}
              isInvalid={!!errors.startDateTime}
              hideTimeZone
              onChange={field.onChange}
              variant={"bordered"}
              label={"Start Date/Time"}
              value={field.value}
            />
          </div>
        );
      }}
    />
  );
};

export default StartDatePickerInput;
