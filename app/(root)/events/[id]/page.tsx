import Image from "next/image";
import { CalendarCheck2 } from "lucide-react";
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
      <div>
        <section>
          <div className="event-hero-wrapper">
            <div className={"event-hero"}>
              <div
                className={"event-hero-background"}
                style={{ backgroundImage: `url(${event.imgThumbnail})` }}
              />
              <div>
                <Image
                  src={event.imgLarge}
                  alt="hero image"
                  width={940}
                  height={470}
                  sizes={
                    "(max-width:480px) 480px, (max-width:600px) 600px, 940px"
                  }
                  priority={true}
                />
              </div>
            </div>
          </div>
          {/* Date & Share Btn */}
          <div>
            <p>
              {formatDateTime(event.startDateTime).dateOnlyWithoutYear} •{" "}
              {event.category.name}
            </p>
            <ShareEvent eventId={event._id} />
          </div>
          <div>
            {/* Content Left ie Details */}
            <div>
              <h1>{event.title}</h1>
              <h2>Date and time</h2>
              <div>
                <p>
                  {formatDateTime(event.startDateTime).dateLongWithoutYear} •{" "}
                  {formatDateTime(event.startDateTime).timeOnly} -{" "}
                  {formatDateTime(event.endDateTime).timeOnly}
                </p>
              </div>
              <Location location={event.location} />
              {!event.isFree && (
                <div>
                  <h2>Refund Policy</h2>
                  <p>
                    Refunds are easy. Just send me an email at
                    AaronCurtisYoga@gmail.com, and I&lsquo;ll provide a 100%
                    refund. No questions asked.
                  </p>
                </div>
              )}
              <h2>About this event</h2>
              <p>{event.description}</p>
            </div>
            {/* Content Right ie Primary CTA */}
            <div id={"event-checkout"}>
              <p>{event.isFree ? "Free" : `$${event.price}`}</p>
              <CheckoutButton event={event} />
            </div>
          </div>
        </section>
      </div>
      {/*{!!eventsWithSameCategory?.data.length && (
        <section>
          <div>
            <h3>Other events with Aaron you may like:</h3>
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
      )}*/}
    </>
  );
};

export default EventDetails;
