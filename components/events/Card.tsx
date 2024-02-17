import Image from "next/image";
import Link from "next/link";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import { Edit } from "lucide-react";

type CardProps = {
  isAdmin: boolean;
  event: IEvent;
};
const Card = ({ isAdmin, event }: CardProps) => {
  const { _id, category, imgLarge, isFree, price, startDateTime, title } =
    event;
  return (
    <>
      {isAdmin && (
        <div className="flex flex-row gap-4 p-3 justify-between">
          <Link href={`/orders?eventId=${_id}`} className="flex gap-2">
            <p className="text-primary-500">Order Details</p>
          </Link>
          <div className={"flex gap-2"}>
            <Link href={`/events/${_id}/update`}>
              <Edit width={20} height={20} />
            </Link>
            <DeleteConfirmation eventId={_id} />
          </div>
        </div>
      )}
      <div
        className={
          "flex flex-col w-full md:max-w-[400px]" +
          " md:min-h-[280px] overflow-hidden" +
          " rounded-sm bg-white shadow-md transition-all hover:shadow-lg"
        }
      >
        <Link href={`/events/${_id}`} className={"flex-col hover:underline"}>
          <Image
            src={imgLarge}
            alt={`People doing ${category.name}`}
            sizes={"400px"}
            width={400}
            height={140}
            className={"aspect-[2/1] w-full h-auto md:h-[140px]"}
            style={{ objectFit: "cover" }}
            priority={true}
          />
          <p className="text-lg line-clamp-2 flex-1 text-black pt-2 px-3">
            {title}
          </p>
        </Link>
        <div className={"pt-1 px-3 mb-8 md:mb-auto"}>
          <p className="md:text-sm mb-1/2 font-semibold">
            {formatDateTime(startDateTime).dateOnlyWithoutYear} •{" "}
            {formatDateTime(startDateTime).timeOnly}
          </p>
          <p className={"md:text-sm mt-1"}>
            {event.location.structuredFormatting.mainText}
          </p>
        </div>
      </div>
    </>
  );
};

export default Card;
