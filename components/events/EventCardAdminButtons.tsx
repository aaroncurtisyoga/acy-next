import Link from "next/link";
import { Edit } from "lucide-react";
import { deleteEvent } from "@/lib/actions/event.actions";

type EventCardAdminButtonsProps = {
  id: string;
  pathname: string;
};

const EventCardAdminButtons = ({
  id,
  pathname,
}: EventCardAdminButtonsProps) => {
  return (
    <div className="flex flex-row gap-4 p-3 justify-between">
      <Link href={`/orders?eventId=${id}`} className="flex gap-2">
        <p className="text-primary-500">Order Details</p>
      </Link>
      <div className={"flex gap-2"}>
        <Link href={`/events/${id}/update`}>
          <Edit width={20} height={20} />
        </Link>
        {/* todo: display confirmation msg in modal */}
        <button
          onClick={async () =>
            await deleteEvent({ eventId: id, path: pathname })
          }
        >
          delete event
        </button>
      </div>
    </div>
  );
};

export default EventCardAdminButtons;
