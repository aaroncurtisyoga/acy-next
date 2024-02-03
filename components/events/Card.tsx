import Image from "next/image";
import Link from "next/link";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

type CardProps = {
  isAdmin: boolean;
  event: IEvent;
};
const Card = ({ isAdmin, event }: CardProps) => {
  const { _id, category, imageUrl, isFree, price, startDateTime, title } =
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
              <Image
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={20}
              />
            </Link>
            <DeleteConfirmation eventId={_id} />
          </div>
        </div>
      )}
      <div
        className={
          "flex flex-col w-full max-w-[400px] min-h-[340px] overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
        }
      >
        <Link href={`/events/${_id}`} className={"flex-col hover:underline"}>
          <Image
            src={imageUrl}
            alt={`People doing ${category}`}
            // sizes={"400px"}
            width={400}
            height={153.75}
            style={{ width: "100%", height: "140px", objectFit: "cover" }}
          />
          <p className="text-lg line-clamp-2 flex-1 text-black pt-3 px-3">
            {title}
          </p>
        </Link>
        <div className={"pt-3 px-3"}>
          <p className="text-grey-500 ">
            {formatDateTime(startDateTime).dateOnlyWithoutYear} •{" "}
            {formatDateTime(startDateTime).timeOnly}
          </p>
          <p>{event.location}</p>
          <span className="">{isFree ? "Free" : `$${price}`}</span>
        </div>
      </div>
    </>
  );
};

export default Card;
