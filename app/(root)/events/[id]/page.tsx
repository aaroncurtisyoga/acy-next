import Image from "next/image";
import { CalendarCheck2, MapPin, Share } from "lucide-react";

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
      <div className={"flex flex-col"}>
        <section className="flex flex-col w-full md:items-center">
          <div className="event-hero-wrapper w-full">
            <div className={"w-full flex justify-center"}>
              <Image
                src={event.imageUrl}
                alt="hero image"
                width={940}
                height={470}
                className="h-full max-h-[50vw] md:max-h-[470px] object-cover object-center overflow-hidden"
                sizes={
                  "(max-width:480px) 480px, (max-width:600px) 600px, 940px"
                }
              />
            </div>
          </div>
          {/* Date & Share Btn */}
          <div className="flex flex-between event-wrapper-width pt-5 pb-2">
            <p className={"text-base lg:text-lg font-semibold text-gray-600"}>
              {formatDateTime(event.startDateTime).dateOnlyWithoutYear}{" "}
            </p>
            <Share className={"cursor-pointer text-base lg:text-lg"} />
          </div>
          <div className={"md:flex md:event-wrapper-width"}>
            {/* Content Left ie Details */}
            <div className={"flex-1 px-5 md:px-0"}>
              <h1 className={"text-[2rem] md:text-[3.25rem] font-extrabold"}>
                {event.title}
              </h1>
              <p className={"text-base mb-3"}>{event.category.name}</p>
              <h2 className={"text-2xl font-bold mb-3"}>Date and time</h2>
              <div className={"flex gap-4 items-center mb-6"}>
                <CalendarCheck2 size={14} />
                <p className={"text-sm"}>
                  {formatDateTime(event.startDateTime).dateLongWithoutYear} •{" "}
                  {formatDateTime(event.startDateTime).timeOnly} -{" "}
                  {formatDateTime(event.endDateTime).timeOnly}
                </p>
              </div>
              <h2 className={"text-2xl font-bold mb-3"}>Location</h2>
              <div className={"flex items-center mb-6 gap-4"}>
                <MapPin size={14} />
                <p className={"text-sm"}>{event.location}</p>
              </div>
              {!event.isFree && (
                <>
                  <h2 className={"text-2xl font-bold"}>Refund Policy</h2>
                  <p>Todo: Insert refund policy here</p>
                </>
              )}
              <h2 className={"text-2xl font-bold mb-3"}>About this event</h2>
              <p>{event.description}</p>
            </div>
            {/* Content Right ie Primary CTA */}
            <div
              id={"event-checkout"}
              className={
                "fixed bottom-0 z-10 bg-white " +
                " border-t-2  md:border-[1px] md:rounded-2xl md:relative" +
                " w-full flex-1 md:max-w-[360px] h-[140px] p-[24px]"
              }
            >
              <p className={"text-center text-lg mb-3"}>
                {event.isFree ? "Free" : `$${event.price}`}
              </p>
              <CheckoutButton event={event} className={"justify-center"} />
            </div>
          </div>
        </section>
      </div>
      {!!eventsWithSameCategory?.data.length && (
        <section className={"event-wrapper-width"}>
          <h3 className={""}>Other events with Aaron you may like:</h3>
          <Collection
            data={eventsWithSameCategory?.data}
            emptyTitle={"No Events Founds"}
            emptyStateSubtext={"Please visit back soon to check in for events."}
            collectionType={"All_Events"}
            limit={3}
            page={searchParams.page as string}
            totalPages={eventsWithSameCategory?.totalPages}
          />
        </section>
      )}
    </>
  );
};

export default EventDetails;
