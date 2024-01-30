import Image from "next/image";
import Link from "next/link";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { checkRole, formatDateTime } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
};
const Card = ({ event, hasOrderLink }: CardProps) => {
  const isAdmin = checkRole("admin");
  const { _id, category, imageUrl, isFree, price, startDateTime, title } =
    event;
  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${_id}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />

      {isAdmin && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
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
      )}

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
          {formatDateTime(startDateTime).dateTime}
        </p>
        <Link href={`/events/${_id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {title}
          </p>
        </Link>
        <div className="flex-between w-full">
          {hasOrderLink && (
            <Link href={`/orders?eventId=${_id}`} className="flex gap-2">
              <p className="text-primary-500">Order Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;

/* Todo
 *   Img Optimization: Use smaller file for Cards
 * */
