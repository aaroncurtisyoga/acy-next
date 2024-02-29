import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";

import React from "react";

const EndDate = ({ control, isSubmitting }) => {
  return (
    <Controller
      control={control}
      name={"endDateTime"}
      render={({ field }) => (
        <DatePicker
          disabled={isSubmitting}
          dateFormat="MM/dd/yyyy h:mm aa"
          onChange={(date: Date) => field.onChange(date)}
          placeholderText={"End Date/Time"}
          selected={field.value}
          showTimeSelect
          timeInputLabel={"End Date/Time:"}
          wrapperClassName="datePicker"
        />
      )}
    />
  );
};

export default EndDate;
