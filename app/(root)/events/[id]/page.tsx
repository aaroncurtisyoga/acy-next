import Attendees from "@/components/events/EventPage/Attendees";
import CheckoutButton from "@/components/events/EventPage/CheckoutButton";
import DateAndTime from "@/components/events/EventPage/DateAndTime";
import DescriptionRichTextEditor from "@/components/events/EventPage/DescriptionDisplay";
import Headline from "@/components/events/EventPage/Headline";
import Hero from "@/components/events/EventPage/Hero";
import Location from "@/components/events/EventPage/Location";
import RefundPolicy from "@/components/events/EventPage/RefundPolicy";
import Subheading from "@/components/events/EventPage/Subheadline";
import { getEventById } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";

const EventPage = async ({ params: { id } }: SearchParamProps) => {
  const event = await getEventById(id);
  const {
    _id,
    attendees,
    category,
    description,
    endDateTime,
    imageUrl,
    isFree,
    location,
    price,
    startDateTime,
    title,
  } = event;

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
              <Location location={location} />
              <DescriptionRichTextEditor description={description} />
              <Attendees attendees={attendees} />
              {!isFree && <RefundPolicy />}
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
              {isFree ? "Free" : `$${price}`}
            </p>
            <CheckoutButton event={event} className={"justify-center"} />
          </div>
        </div>
      </section>
    </>
  );
};

export default EventPage;
