import Image from "next/image";
import { CalendarCheck2, MapPin } from "lucide-react";
import Collection from "@/components/events/Collection";
import CheckoutButton from "@/components/events/CheckoutButton";
import ShareEvent from "@/components/events/ShareEvent";
import {
  getEventById,
  getEventsWithSameCategory,
} from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import { formatDateTime } from "@/lib/utils";
import Location from "@/components/events/Location";
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
          <div className="event-hero-wrapper w-full relative">
            <div className={"event-hero"}>
              <div
                className={"event-hero-background"}
                style={{ backgroundImage: `url(${event.imgThumbnail})` }}
              />
              <div className={"m-auto md:w-[940px]"}>
                <Image
                  src={event.imgLarge}
                  alt="hero image"
                  width={940}
                  height={470}
                  className="h-full max-h-[50vw] md:max-h-[470px] object-cover object-center overflow-hidden relative z-10"
                  sizes={
                    "(max-width:480px) 480px, (max-width:600px) 600px, 940px"
                  }
                  priority={true}
                />
              </div>
            </div>
          </div>
          {/* Date & Share Btn */}
          <div className="flex justify-between items-center event-wrapper-width pt-5 md:pt-12 pb-2">
            <p className={"text-base lg:text-lg font-semibold text-gray-600"}>
              {formatDateTime(event.startDateTime).dateOnlyWithoutYear} •{" "}
              {event.category.name}
            </p>
            <ShareEvent eventId={event._id} />
          </div>
          <div className={"md:flex md:event-wrapper-width"}>
            {/* Content Left ie Details */}
            <div className={"flex-1 px-5 md:px-0"}>
              <h1
                className={
                  "text-[2rem] md:text-[3.25rem] font-extrabold mb-5 md:mb-8"
                }
              >
                {event.title}
              </h1>
              <h2 className={"text-2xl font-bold mb-3"}>Date and time</h2>
              <div className={"flex gap-4 items-center mb-6 md:mb-8"}>
                <CalendarCheck2 size={14} />
                <p className={"text-sm"}>
                  {formatDateTime(event.startDateTime).dateLongWithoutYear} •{" "}
                  {formatDateTime(event.startDateTime).timeOnly} -{" "}
                  {formatDateTime(event.endDateTime).timeOnly}
                </p>
              </div>
              <Location location={event.location} />
              {!event.isFree && (
                <div className={"mb-6 md:mb-8"}>
                  <h2 className={"text-2xl font-bold mb-3"}>Refund Policy</h2>
                  <p>
                    Refunds are easy. Just send me an email at
                    AaronCurtisYoga@gmail.com, and I&lsquo;ll provide a 100%
                    refund. No questions asked.
                  </p>
                </div>
              )}
              <h2 className={"text-2xl font-bold mb-3"}>About this event</h2>
              <p className={"mb-14"}>{event.description}</p>
            </div>
            {/* Content Right ie Primary CTA */}
            <div
              id={"event-checkout"}
              className={
                "fixed bottom-0 z-10 bg-white " +
                " border-t-2  md:border-[1px] md:rounded-2xl md:relative" +
                " w-full flex-1 md:max-w-[360px] h-[140px] p-[24px]" +
                " md:sticky md:top-5 md:mt-[20px]"
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
        <section className={"bg-gray-100 w-full py-6 md:py-8"}>
          <div className="event-wrapper-width">
            <h3 className={"text-lg font-bold text-gray-800 mb-6"}>
              Other events with Aaron you may like:
            </h3>
            <Collection
              data={eventsWithSameCategory?.data}
              emptyTitle={"No Events Founds"}
              emptyStateSubtext={
                "Please visit back soon to check in for events."
              }
              collectionType={"All_Events"}
              limit={3}
              page={searchParams.page as string}
              totalPages={eventsWithSameCategory?.totalPages}
            />
          </div>
        </section>
      )}
    </>
  );
};

export default EventDetails;
