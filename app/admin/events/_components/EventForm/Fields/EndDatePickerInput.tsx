import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { DatePicker } from "@nextui-org/react";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

interface EndDatePickerInputProps {
  control: Control;
  errors: FieldErrors<Inputs>;
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
      name={"endDateTime"}
      render={({ field }) => (
        <div className={"w-full flex flex-col"}>
          <DatePicker
            isDisabled={isSubmitting}
            hideTimeZone
            isInvalid={!!errors.endDateTime}
            errorMessage={errors.endDateTime?.message}
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
