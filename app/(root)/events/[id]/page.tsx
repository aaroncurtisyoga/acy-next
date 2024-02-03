import Image from "next/image";
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
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center overflow-hidden"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="">{event.title}</h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className=" rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? "FREE" : `$${event.price}`}
                  </p>
                  <p className=" rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>
              </div>
            </div>

            <CheckoutButton event={event} />

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className=" lg:p-regular-20 flex flex-wrap items-center">
                  <p>{formatDateTime(event.startDateTime).dateOnly} / </p>
                  <p>{formatDateTime(event.startDateTime).timeOnly} - </p>
                  <p>{formatDateTime(event.endDateTime).timeOnly}</p>
                </div>
              </div>

              <div className=" flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className=" lg:p-regular-20">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className=" text-grey-600">What to expect:</p>
              <p className="">{event.description}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Events with  the same category */}
      {!!eventsWithSameCategory?.data.length && (
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
      )}
    </>
  );
};

export default EventDetails;
