import { unstable_cache } from "next/cache";
import {
  getEventsByWeek,
  getEventsByMonth,
  getFeaturedEvents,
  getLastActiveEventDate,
  getEventById,
} from "@/app/_lib/actions/event.actions";
import { EVENTS_CACHE_TAG } from "@/app/_lib/constants/cache-tags";

/**
 * Cached reads for the public event listings (homepage weekly/monthly schedule
 * and the Upcoming band).
 *
 * These run on every visitor *and* every bot/crawler request. The homepage
 * reads `searchParams`, so it renders dynamically and route-level ISR
 * (`export const revalidate`) is ignored — without caching, each request fires
 * live Postgres queries, which keeps the Neon database awake around the clock
 * and burns compute even when nobody's really using the site.
 *
 * Caching at the data layer fixes that: identical queries reuse a cached result
 * for up to REVALIDATE_SECONDS, so repeated/crawler traffic no longer touches
 * the DB. Any event mutation busts the shared tag (see `revalidateTag` calls in
 * event.actions.ts), so admin edits still appear immediately rather than after
 * the TTL.
 */
const REVALIDATE_SECONDS = 900; // 15 minutes

// Fixed date-range query — result doesn't depend on "now", so caching is exact.
export const getEventsByWeekCached = unstable_cache(
  (weekStartISO: string) => getEventsByWeek(weekStartISO),
  ["events-by-week"],
  { tags: [EVENTS_CACHE_TAG], revalidate: REVALIDATE_SECONDS },
);

// Fixed date-range query keyed on its params object — cached per month/filter.
export const getEventsByMonthCached = unstable_cache(
  (params: Parameters<typeof getEventsByMonth>[0]) => getEventsByMonth(params),
  ["events-by-month"],
  { tags: [EVENTS_CACHE_TAG], revalidate: REVALIDATE_SECONDS },
);

// Filters on `startDateTime >= now`, so a just-started event can linger in the
// Upcoming band for up to the TTL — an acceptable trade for not hitting the DB
// on every request.
export const getFeaturedEventsCached = unstable_cache(
  (limit?: number) => getFeaturedEvents(limit),
  ["featured-events"],
  { tags: [EVENTS_CACHE_TAG], revalidate: REVALIDATE_SECONDS },
);

// getLastActiveEventDate returns a Date; unstable_cache JSON-serializes its
// result, so round-trip through an ISO string to preserve the Date contract.
const getLastActiveEventDateISO = unstable_cache(
  async () => {
    const date = await getLastActiveEventDate();
    return date ? date.toISOString() : null;
  },
  ["last-active-event-date"],
  { tags: [EVENTS_CACHE_TAG], revalidate: REVALIDATE_SECONDS },
);

export async function getLastActiveEventDateCached(): Promise<Date | null> {
  const iso = await getLastActiveEventDateISO();
  return iso ? new Date(iso) : null;
}

// Public event detail page, cached per event id. The query includes the
// registered-attendee list, so that list can be up to REVALIDATE_SECONDS stale
// on the *public* page — acceptable for a class page (it's not a live seat map),
// and the "events" tag is busted on any event mutation. Admin / edit routes must
// keep calling the uncached getEventById so they always see current data.
export const getEventByIdCached = unstable_cache(
  (eventId: string) => getEventById(eventId),
  ["event-by-id"],
  { tags: [EVENTS_CACHE_TAG], revalidate: REVALIDATE_SECONDS },
);
