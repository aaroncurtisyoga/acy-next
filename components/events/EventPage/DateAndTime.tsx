import { FC } from "react";
import { CalendarCheck2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface DateAndTimeProps {
  endDateTime: Date;
  startDateTime: Date;
}

const DateAndTime: FC<DateAndTimeProps> = ({ endDateTime, startDateTime }) => {
  return (
    <div className={"mb-6 md:mb-8"}>
      <h2 className={"text-2xl font-bold mb-3"}>Date and time</h2>
      <div className={"flex gap-4 items-center "}>
        <CalendarCheck2 size={14} />
        <p className={"text-sm"}>
          {formatDateTime(startDateTime).dateLongWithoutYear} •{" "}
          {formatDateTime(startDateTime).timeOnly} -{" "}
          {formatDateTime(endDateTime).timeOnly}
        </p>
      </div>
    </div>
  );
};

export default DateAndTime;
