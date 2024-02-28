"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Edit } from "lucide-react";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { deleteEvent } from "@/lib/actions/event.actions";

type CardProps = {
  isAdmin: boolean;
  event: IEvent;
};

const EventCard = ({ isAdmin, event }: CardProps) => {
  const pathname = usePathname();
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
            {/* todo: display confirmation msg in modal */}
            <button
              onClick={async () =>
                await deleteEvent({ eventId: _id, path: pathname })
              }
            >
              delete event
            </button>
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
          {/* todo: does there need to be a border radius added here to
           soften those edges */}
          <Image
            src={imgLarge}
            alt={`People doing ${category.name}`}
            sizes={"400px"}
            width={400}
            height={140}
            className={"w-full h-auto md:h-[140px]"}
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
          <p className={"md:text-sm mt-1"}>{event.location.name}</p>
        </div>
      </div>
    </>
  );
};

export default EventCard;
