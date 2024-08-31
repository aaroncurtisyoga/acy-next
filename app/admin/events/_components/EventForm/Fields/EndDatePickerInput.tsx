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
            isRequired
            hideTimeZone
            onChange={field.onChange}
            variant={"bordered"}
            label={"End Date/Time"}
            value={field.value}
          />
          {errors.endDateTime?.message && (
            <div className="p-1 flex relative flex-col gap-1.5">
              <div className="text-tiny text-danger">
                {errors.endDateTime.message}
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default EndDatePickerInput;
