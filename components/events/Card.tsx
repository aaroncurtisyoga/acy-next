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
    <div className={"flex flex-col"}>
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
      <Link
        href={`/events/${_id}`}
        className={
          "flex min-h-[380px] md:min-h-[438px] w-full max-w-[400px]" +
          " flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
        }
      >
        {/* Todo: Use small image here */}
        <Image
          src={imageUrl}
          alt={`People doing ${category}`}
          sizes={"400px"}
          width={400} // todo: what is this supposed to be?
          height={50} // todo: what is this supposed to be?
        />
        <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {isFree ? "FREE" : `$${price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
              {category.name}
            </p>
          </div>
          <p className="p-medium-16 p-medium-18 text-grey-500">
            {formatDateTime(startDateTime).dateOnlyWithoutYear} •{" "}
            {formatDateTime(startDateTime).timeOnly}
          </p>
          <Link href={`/events/${_id}`}>
            <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
              {title}
            </p>
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default Card;
