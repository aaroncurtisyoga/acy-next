import { unstable_cache } from "next/cache";
import {
  getPublicNewsletter,
  getPublicNewsletters,
} from "@/app/_lib/actions/newsletter.actions";
import { NEWSLETTERS_CACHE_TAG } from "@/app/_lib/constants/cache-tags";

/**
 * Cached reads for the public newsletter archive, mirroring
 * event.queries.ts: public/crawler traffic must not fire live Postgres
 * queries on every request, or the Neon database never scales to zero.
 *
 * The archive only changes when a send goes out (or a sent newsletter is
 * deleted) — those mutations bust NEWSLETTERS_CACHE_TAG, so the long TTL is
 * just a backstop.
 */
const REVALIDATE_SECONDS = 3600; // 1 hour

export const getPublicNewslettersCached = unstable_cache(
  () => getPublicNewsletters(),
  ["public-newsletters"],
  { tags: [NEWSLETTERS_CACHE_TAG], revalidate: REVALIDATE_SECONDS },
);

// Cached per issue id; the sentHtml snapshot is immutable once sent.
export const getPublicNewsletterCached = unstable_cache(
  (id: string) => getPublicNewsletter(id),
  ["public-newsletter"],
  { tags: [NEWSLETTERS_CACHE_TAG], revalidate: REVALIDATE_SECONDS },
);
