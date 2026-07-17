import { unstable_cache } from "next/cache";
import prisma from "@/app/_lib/prisma";
import { serialize } from "@/app/_lib/utils/serialize";
import { NEWSLETTERS_CACHE_TAG } from "@/app/_lib/constants/cache-tags";

/**
 * Public newsletter archive: the reads and their cached wrappers.
 *
 * These reads take NO auth on purpose — only reader-safe fields of publicly
 * visible rows leave them — so they live here (not in the "use server"
 * newsletter.actions module), making that trust boundary a file boundary.
 *
 * Cached like event.queries.ts: public/crawler traffic must not fire a live
 * Postgres query on every request, or the Neon database never scales to zero.
 * The archive only changes when a send goes out (or a sent newsletter is
 * deleted); those mutations bust NEWSLETTERS_CACHE_TAG, so the long TTL is just
 * a backstop.
 */
const REVALIDATE_SECONDS = 3600; // 1 hour

export type NewsletterArchiveItem = {
  id: string;
  subject: string;
  previewText: string | null;
  sentAt: string | null;
};

export type PublicNewsletter = NewsletterArchiveItem & {
  sentHtml: string | null;
  content: string;
};

/**
 * A row is publicly viewable once its email is (or must be) in inboxes:
 * status SENT, or a past-due SCHEDULED row whose snapshot was baked at
 * scheduling time. The latter matters because nothing flips SCHEDULED → SENT
 * until the admin next opens the dashboard, while the emailed "View in
 * browser" link starts getting clicked the moment Resend fires.
 */
function publiclyVisibleWhere(now: Date) {
  return {
    OR: [
      { status: "SENT" as const },
      {
        status: "SCHEDULED" as const,
        scheduledAt: { lte: now },
        sentHtml: { not: null },
      },
    ],
  };
}

/**
 * Sent newsletters for the public archive.
 *
 * DB errors deliberately propagate: unstable_cache must never store a transient
 * failure as an hour of empty archive / 404s. Pages catch and show a soft retry
 * message instead.
 */
async function getPublicNewsletters(): Promise<NewsletterArchiveItem[]> {
  const now = new Date();
  const newsletters = await prisma.newsletter.findMany({
    where: publiclyVisibleWhere(now),
    select: {
      id: true,
      subject: true,
      previewText: true,
      sentAt: true,
      scheduledAt: true,
    },
  });
  const items = newsletters
    .map((n) => ({
      id: n.id,
      subject: n.subject,
      previewText: n.previewText,
      // A just-fired scheduled row has no sentAt yet; its send time is the
      // scheduled time.
      sentAt: n.sentAt ?? n.scheduledAt,
    }))
    .sort((a, b) => (b.sentAt?.getTime() ?? 0) - (a.sentAt?.getTime() ?? 0));
  // serialize() JSON-round-trips, so Date becomes an ISO string at runtime.
  return serialize(items) as unknown as NewsletterArchiveItem[];
}

async function getPublicNewsletter(
  id: string,
): Promise<PublicNewsletter | null> {
  const now = new Date();
  const newsletter = await prisma.newsletter.findFirst({
    where: { id, ...publiclyVisibleWhere(now) },
    select: {
      id: true,
      subject: true,
      previewText: true,
      sentAt: true,
      scheduledAt: true,
      sentHtml: true,
      content: true,
    },
  });
  if (!newsletter) return null;
  const { scheduledAt, ...rest } = newsletter;
  const publicFields = { ...rest, sentAt: newsletter.sentAt ?? scheduledAt };
  // serialize() JSON-round-trips, so Date becomes an ISO string at runtime.
  return serialize(publicFields) as unknown as PublicNewsletter;
}

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
