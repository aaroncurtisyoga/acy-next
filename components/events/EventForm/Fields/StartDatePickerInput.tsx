import React, { FC } from "react";
import DatePicker from "react-datepicker";
import { Control, Controller } from "react-hook-form";

interface StartDatePickerInputProps {
  control: Control;
  errors: {
    startDateTime: {
      message?: string;
    };
  };
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
      render={({ field }) => (
        <div className={"w-full flex flex-col"}>
          <DatePicker
            disabled={isSubmitting}
            dateFormat="MM/dd/yyyy h:mm aa"
            enableTabLoop={false}
            onChange={field.onChange}
            placeholderText={"Start Date/Time"}
            selected={field.value}
            showTimeSelect
            timeInputLabel={"Start Date/Time:"}
            wrapperClassName="datePicker"
          />
          {errors.startDateTime?.message && (
            <div className="p-1 flex relative flex-col gap-1.5">
              <div className="text-tiny text-danger">
                {errors.startDateTime.message}
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default StartDatePickerInput;
