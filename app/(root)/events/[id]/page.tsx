import CheckoutButton from "@/components/events/EventPage/CheckoutButton";
import DateAndTime from "@/components/events/EventPage/DateAndTime";
import Hero from "@/components/events/EventPage/Hero";
import Location from "@/components/events/EventPage/Location";
import Subheading from "@/components/events/EventPage/Subheadline";
import Headline from "@/components/events/EventPage/Headline";
import RefundPolicy from "@/components/events/EventPage/RefundPolicy";
import {
  getEventById,
  getEventsWithSameCategory,
} from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import DescriptionRichTextEditor from "@/components/events/EventPage/DescriptionDisplay";
import Attendees from "@/components/events/EventPage/Attendees";

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
      <section className="flex flex-col w-full md:items-center pb-unit-10 gap-3">
        <Hero imageUrl={imageUrl} />
        <Subheading
          category={category}
          id={_id}
          startDateTime={startDateTime}
        />
        <div className={"wrapper-width flex flex-col md:flex-row"}>
          <div className={"flex-1"}>
            <div className={"px-5 md:px-0"}>
              <Headline title={title} />
              <DateAndTime
                startDateTime={startDateTime}
                endDateTime={endDateTime}
              />
              <Location location={event.location} />
              <DescriptionRichTextEditor description={event.description} />
              <Attendees isHostedExternally={event.isHostedExternally} />
              {!event.isFree && <RefundPolicy />}
            </div>
          </div>
          <div
            id={"event-checkout"}
            className={
              "flex-1 w-full border-t-2 h-[140px] p-[24px] fixed bottom-0 z-10 bg-white" +
              " md:border-[1px] md:rounded-2xl md:relative" +
              " md:max-w-[360px]"
            }
          >
            <p className={"text-center text-lg mb-3"}>
              {event.isFree ? "Free" : `$${event.price}`}
            </p>
            <CheckoutButton event={event} className={"justify-center"} />
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
