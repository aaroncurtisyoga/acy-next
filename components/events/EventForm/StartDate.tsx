import React from "react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

const StartDate = ({ control, isSubmitting }) => {
  return (
    <Controller
      control={control}
      name={"startDateTime"}
      render={({ field }) => (
        <DatePicker
          disabled={isSubmitting}
          dateFormat="MM/dd/yyyy h:mm aa"
          enableTabLoop={false}
          onChange={(date: Date) => field.onChange(date)}
          placeholderText={"Start Date/Time"}
          selected={field.value}
          showTimeSelect
          timeInputLabel={"Start Date/Time:"}
          wrapperClassName="datePicker"
        />
      )}
    />
  );
};

export default StartDate;
