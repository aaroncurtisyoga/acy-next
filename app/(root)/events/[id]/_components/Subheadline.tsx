import { FC } from "react";
import ShareEvent from "@/app/(root)/events/[id]/_components/ShareEvent";
import { formatDateTime } from "@/app/_lib/utils";

interface SubheadingProps {
  category: string;
  id: string;
  startDateTime: Date;
}
const Subheading: FC<SubheadingProps> = ({ category, id, startDateTime }) => {
  return (
    <div className="wrapper-width flex justify-between items-center w-full py-3">
      <p className={"text-base lg:text-lg font-semibold text-gray-600"}>
        {formatDateTime(startDateTime).dateOnlyWithoutYear} • {category}
      </p>
      <ShareEvent eventId={id} />
    </div>
  );
};

export default Subheading;
