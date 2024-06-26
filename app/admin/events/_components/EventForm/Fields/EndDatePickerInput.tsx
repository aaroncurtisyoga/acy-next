import React, { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import DatePicker from "react-datepicker";
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
            disabled={isSubmitting}
            dateFormat="MM/dd/yyyy h:mm aa"
            enableTabLoop={false}
            onChange={(date: Date) => field.onChange(date)}
            placeholderText={"End Date/Time"}
            selected={new Date(field.value)}
            showTimeSelect
            timeInputLabel={"End Date/Time:"}
            wrapperClassName="datePicker"
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
