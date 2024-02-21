import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { deleteEvent } from "@/lib/actions/event.actions";

type CardProps = {
  isAdmin: boolean;
  event: IEvent;
};

const Card = ({ isAdmin, event }: CardProps) => {
  const pathname = usePathname();
  const { _id, category, imgLarge, isFree, price, startDateTime, title } =
    event;
  return (
    <>
      {isAdmin && (
        <div>
          <Link href={`/orders?eventId=${_id}`}>
            <p>Order Details</p>
          </Link>
          <div>
            <Link href={`/events/${_id}/update`}>Edit</Link>
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
      <div>
        <Link href={`/events/${_id}`}>
          <Image
            src={imgLarge}
            alt={`People doing ${category.name}`}
            sizes={"400px"}
            width={400}
            height={140}
            style={{ objectFit: "cover" }}
            priority={true}
          />
          <p>{title}</p>
        </Link>
        <div>
          <p>
            {formatDateTime(startDateTime).dateOnlyWithoutYear} •{" "}
            {formatDateTime(startDateTime).timeOnly}
          </p>
          <p>{event.location.name}</p>
        </div>
      </div>
    </>
  );
};

export default Card;
