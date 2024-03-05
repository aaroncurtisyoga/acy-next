import Collection from "@/components/events/Collection";
import CheckoutButton from "@/components/events/EventPage/CheckoutButton";
import DateAndTime from "@/components/events/EventPage/DateAndTime";
import Hero from "@/components/events/EventPage/Hero";
import Location from "@/components/events/EventPage/Location";
import Subheading from "@/components/events/EventPage/Subheadline";
import category from "@/components/events/EventForm/Category";
import {
  getEventById,
  getEventsWithSameCategory,
} from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Headline from "@/components/events/EventPage/Headline";

const EventPage = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const event = await getEventById(id);
  const { _id, category, imageUrl, startDateTime, endDateTime, title } = event;
  const eventsWithSameCategory = await getEventsWithSameCategory({
    categoryId: category._id,
    eventId: _id,
    page: searchParams.page as string,
  });
  return (
    <>
      <section className="flex flex-col w-full md:items-center">
        <Hero imageUrl={imageUrl} />
        <div className={"wrapper flex flex-col"}>
          <Subheading
            category={category}
            id={_id}
            startDateTime={startDateTime}
          />
          <div className={"px-5 md:px-0"}>
            <Headline title={title} />
            <DateAndTime
              startDateTime={startDateTime}
              endDateTime={endDateTime}
            />
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
            {/*<CheckoutButton event={event} className={"justify-center"} />*/}
          </div>
        </div>
      </section>
      {/* {!!eventsWithSameCategory?.data.length && (
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
      )}*/}
    </>
  );
};

export default EventPage;
