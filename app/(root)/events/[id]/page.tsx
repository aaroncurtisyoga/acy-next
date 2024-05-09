import { FC } from "react";
import {
  Event as PrismaEvent,
  Category,
  EventUser,
  User,
  Location as PrismaLocation,
} from "@prisma/client";
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
import { handleError } from "@/lib/utils";
import { SearchParamProps } from "@/types";

type Event = PrismaEvent & {
  category: Category;
  attendees: (EventUser & { user: User })[];
  location: PrismaLocation;
};
const EventPage: FC<SearchParamProps> = async ({ params: { id } }) => {
  let event: Event | null = null;

  try {
    event = await getEventById(id);
  } catch (error) {
    handleError(error);
  }

  if (!event) {
    handleError("Event Page: No event found");
  }

  return (
    <section className="flex flex-col w-full md:items-center pb-unit-10 gap-3">
      <Hero imageUrl={event.imageUrl} />
      <Subheading
        category={event.category.name}
        id={event.id}
        startDateTime={event.startDateTime}
      />
      <div className={"wrapper-width flex flex-col md:flex-row"}>
        <div className={"flex-1"}>
          <div className={"px-5 md:px-0"}>
            <Headline title={event.title} />
            <DateAndTime
              startDateTime={event.startDateTime}
              endDateTime={event.endDateTime}
            />
            <Location location={event.location} />
            <DescriptionRichTextEditor description={event.description} />
            <Attendees
              attendees={event.attendees.map((attendee) => attendee.user)}
            />
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
  );
};

export default EventPage;
