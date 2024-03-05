import { CalendarCheck2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const DateAndTime = ({ endDateTime, startDateTime }) => {
  return (
    <>
      <h2 className={"text-2xl font-bold mb-3"}>Date and time</h2>
      <div className={"flex gap-4 items-center mb-6 md:mb-8"}>
        <CalendarCheck2 size={14} />
        <p className={"text-sm"}>
          {formatDateTime(startDateTime).dateLongWithoutYear} •{" "}
          {formatDateTime(startDateTime).timeOnly} -{" "}
          {formatDateTime(endDateTime).timeOnly}
        </p>
      </div>
    </>
  );
};

export default DateAndTime;
