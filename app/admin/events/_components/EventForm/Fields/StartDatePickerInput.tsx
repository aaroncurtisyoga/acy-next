import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { DatePicker } from "@nextui-org/react";

import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

interface StartDatePickerInputProps {
  control: Control;
  errors: FieldErrors<Inputs>;
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
      name={"startDateTime"}
      render={({ field }) => {
        return (
          <div className={"w-full flex flex-col"}>
            <DatePicker
              isDisabled={isSubmitting}
              isRequired
              hideTimeZone
              onChange={field.onChange}
              variant={"bordered"}
              label={"Start Date/Time"}
              value={field.value}
            />
            {errors.startDateTime?.message && (
              <div className="p-1 flex relative flex-col gap-1.5">
                <div className="text-tiny text-danger">
                  {errors.startDateTime.message}
                </div>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default StartDatePickerInput;
