import Image from "next/image";
import { Share } from "lucide-react";

import { SearchParamProps } from "@/types";

import Collection from "@/components/events/Collection";
import CheckoutButton from "@/components/events/CheckoutButton";
import {
  getEventById,
  getEventsWithSameCategory,
} from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";

const EventDetails = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const event = await getEventById(id);
  const eventsWithSameCategory = await getEventsWithSameCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });
  return (
    <div className={"flex flex-col"}>
      <section className="flex flex-col w-full md:items-center">
        <Image
          src={event.imageUrl}
          alt="hero image"
          width={940}
          height={470}
          className="h-full max-h-[50vw] md:max-h-[470px] object-cover object-center overflow-hidden"
          sizes={"(max-width:480px) 480px, (max-width:600px) 600px, 940px"}
        />
        {/* Date & Share Btn */}
        <div className="flex flex-between wrapper">
          <p className={"text-base lg:text-lg font-semibold text-gray-700"}>
            {formatDateTime(event.startDateTime).dateOnlyWithoutYear}{" "}
          </p>
          {/* Todo:
                  On hover: "Share event" tooltip. On Click, copy event URL to
                  Clipboard
             */}
          <Share className={"cursor-pointer text-base lg:text-lg"} />
        </div>
        <div className={"md:flex"}>
          {/* Content Left ie Details */}
          <div className={"flex-1 wrapper"}>
            <h1 className={"text-5xl md:text-[3.25rem] font-extrabold"}>
              {event.title}
            </h1>
            <h2 className={"text-2xl font-bold"}>Date and time</h2>
            <h2 className={"text-2xl font-bold"}>Location</h2>
            {!event.isFree && (
              <>
                <h2 className={"text-2xl font-bold"}>Refund Policy</h2>
                <p>Todo: Insert refund policy here</p>
              </>
            )}
            <h2 className={"text-2xl font-bold "}>About this event</h2>
          </div>
          {/* Content Right ie Primary CTA */}
          <div
            id={"event-checkout"}
            className={
              "fixed bottom-0 z-10 bg-white shadow-lg md:shadow-none" +
              " border-t-2 md:border-t-0 md:relative w-full " +
              " flex-1 md:max-w-[360px] h-[140px] md:h-auto"
            }
          >
            <p className={"text-center"}>
              {event.isFree ? "Free" : `$${event.price}`}
            </p>
            <CheckoutButton event={event} className={"justify-center"} />
          </div>
        </div>
      </section>
      {/* Events with  the same category */}

      {/*{!!eventsWithSameCategory?.data.length && (
        <section className={"wrapper"}>
          <h3 className={""}>Similar Events</h3>
          <Collection
            data={eventsWithSameCategory?.data}
            emptyTitle={"No Events Founds"}
            emptyStateSubtext={"Please visit back soon to check in for events."}
            collectionType={"All_Events"}
            limit={6}
            page={searchParams.page as string}
            totalPages={eventsWithSameCategory?.totalPages}
          />
        </section>
      )}*/}
    </div>
  );
};

export default EventDetails;
