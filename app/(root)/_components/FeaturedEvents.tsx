import Image from "next/image";
import Link from "next/link";
import { getFeaturedEvents } from "@/app/_lib/actions/event.actions";
import { formatDateTime, richTextToPlainText } from "@/app/_lib/utils";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

export default async function FeaturedEvents() {
  const events = await getFeaturedEvents(2);

  return (
    <section
      id="upcoming"
      data-testid="featured-events"
      className="scroll-mt-20 bg-navy py-14 md:py-20"
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-6 lg:px-12">
        <h2 className="font-display text-4xl uppercase text-white md:text-5xl">
          Upcoming
        </h2>
        {events.length === 0 ? (
          <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-white/60">
            Nothing extra on the calendar right now ~ new sound baths and
            workshops land here first.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-6">
            {events.map((event) => (
              <FeaturedEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedEventCard({ event }: { event: EventWithLocationAndCategory }) {
  const { monthShort, dayNumber, timeOnly } = formatDateTime(
    event.startDateTime,
  );
  const href =
    event.isHostedExternally && event.externalRegistrationUrl
      ? event.externalRegistrationUrl
      : `/events/${event.id}`;
  const isExternal =
    event.isHostedExternally && !!event.externalRegistrationUrl;
  const priceChip = event.isFree
    ? "Free"
    : event.price
      ? `$${event.price}`
      : null;
  // Descriptions are TipTap HTML — flatten to plain text for the card teaser
  const descriptionText = richTextToPlainText(event.description);

  const chips = (
    <div className="flex flex-wrap gap-2">
      <Chip>{`${monthShort} ${dayNumber}`.toUpperCase()}</Chip>
      <Chip>{timeOnly}</Chip>
      {event.location?.name && <Chip>{event.location.name}</Chip>}
      {priceChip && <Chip>{priceChip}</Chip>}
    </div>
  );

  const reserveButton = (
    <Link
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-block bg-primary px-9 py-3.5 font-display text-base uppercase tracking-[0.08em] text-white transition hover:brightness-110"
    >
      Reserve
    </Link>
  );

  if (!event.imageUrl) {
    // Text-first card when the event has no photo
    return (
      <div className="rounded-md border-l-4 border-primary bg-navy-card p-7 md:p-10">
        <h3 className="max-w-[26ch] font-display text-3xl uppercase leading-[1.05] text-white md:text-4xl">
          {event.title}
        </h3>
        <div className="mt-5">{chips}</div>
        {descriptionText && (
          <p className="mt-5 line-clamp-3 max-w-[64ch] text-[15px] leading-relaxed text-white/70">
            {descriptionText}
          </p>
        )}
        <div className="mt-7">{reserveButton}</div>
      </div>
    );
  }

  return (
    <div className="grid overflow-hidden rounded-md bg-navy-card md:grid-cols-[1.1fr_1fr]">
      <div className="relative min-h-[220px] md:min-h-[300px]">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent"
          aria-hidden="true"
        />
        <h3 className="absolute bottom-5 left-6 max-w-[14ch] pr-4 font-display text-3xl uppercase leading-[1.02] text-white md:text-4xl">
          {event.title}
        </h3>
      </div>

      <div className="flex flex-col justify-center p-7 md:p-10">
        {chips}
        {descriptionText && (
          <p className="mt-5 line-clamp-3 max-w-[42ch] text-[15px] leading-relaxed text-white/70">
            {descriptionText}
          </p>
        )}
        <div className="mt-7">{reserveButton}</div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[3px] border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
      {children}
    </span>
  );
}
