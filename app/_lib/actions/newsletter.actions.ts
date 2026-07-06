"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  renderNewsletterHtml,
  resolveMergeTags,
} from "@/app/_lib/email/newsletter-template";
import prisma from "@/app/_lib/prisma";
import resend from "@/app/_lib/resend";
import {
  getEventsByWeek,
  getFeaturedEvents,
} from "@/app/_lib/actions/event.actions";
import {
  NewsletterComposeSchema,
  NewsletterFormSchema,
  NewsletterSubscriberSchema,
  NewsletterSubscriberUpdateSchema,
} from "@/app/_lib/schema";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import {
  formatDateTime,
  richTextToPlainText,
  toDateKey,
} from "@/app/_lib/utils";
import { serialize } from "@/app/_lib/utils/serialize";

type SignupInputs = z.infer<typeof NewsletterFormSchema>;
type SubscriberInputs = z.infer<typeof NewsletterSubscriberSchema>;
type SubscriberUpdateInputs = z.infer<typeof NewsletterSubscriberUpdateSchema>;
type ComposeInputs = z.infer<typeof NewsletterComposeSchema>;

type EventSectionOptions = {
  includeUpcoming?: boolean;
  includeClasses?: boolean;
  includeDescriptions?: boolean;
};

const NEWSLETTER_ADMIN_PATH = "/admin/newsletter";

/* -------------------------------- Helpers -------------------------------- */

async function requireAdmin() {
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Unauthorized: admin role required");
  }
}

function getResendConfig() {
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!segmentId || !from) {
    throw new Error(
      "Missing RESEND_SEGMENT_ID or RESEND_FROM_EMAIL environment variable",
    );
  }
  return { segmentId, from };
}

/* ----------------------------- Public signup ----------------------------- */

export async function addNewsletterEntry(data: SignupInputs) {
  const formValidationResult = NewsletterFormSchema.safeParse(data);

  if (formValidationResult.success === false) {
    return { formErrors: formValidationResult.error.format() };
  }

  try {
    const segmentId = process.env.RESEND_SEGMENT_ID;
    const { error } = await resend.contacts.create({
      email: formValidationResult.data.email,
      segments: segmentId ? [{ id: segmentId }] : undefined,
    });

    if (error) {
      if (/already exist/i.test(error.message)) {
        return {
          apiError: "ALREADY_SUBSCRIBED",
          message: "Looks like you're already subscribed.",
        };
      }
      console.error("Newsletter subscription error:", error);
      return {
        apiError: "Failed to subscribe.",
        message: "Sorry. Something went wrong. Please try again later!",
      };
    }

    return { message: "You're on the list!" };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      apiError: "Failed to subscribe.",
      message: "Sorry. Something went wrong. Please try again later!",
    };
  }
}

/* --------------------------- Admin: subscribers -------------------------- */

// `field: "email"` marks errors the client should show inline on the email
// input (bad address, already subscribed); everything else is infrastructure
// and belongs in a toast.
type AddSubscriberResult = {
  status: boolean;
  message: string;
  field?: "email";
};

export async function addSubscriber(
  data: SubscriberInputs,
): Promise<AddSubscriberResult> {
  await requireAdmin();

  const validation = NewsletterSubscriberSchema.safeParse(data);
  if (!validation.success) {
    return {
      status: false,
      message: "Please enter a valid email address.",
      field: "email",
    };
  }

  try {
    const segmentId = process.env.RESEND_SEGMENT_ID;
    if (!segmentId) {
      return {
        status: false,
        message: "Missing RESEND_SEGMENT_ID environment variable.",
      };
    }

    const firstName = validation.data.firstName?.trim() || undefined;
    const lastName = validation.data.lastName?.trim() || undefined;

    const { error } = await resend.contacts.create({
      email: validation.data.email,
      firstName,
      lastName,
      segments: [{ id: segmentId }],
    });

    if (error) {
      if (/already exist/i.test(error.message)) {
        return {
          status: false,
          message: "That email is already subscribed.",
          field: "email",
        };
      }
      console.error("Failed to add subscriber:", error);
      return { status: false, message: "Resend rejected the subscriber." };
    }

    return { status: true, message: "Subscriber added." };
  } catch (error) {
    console.error("Failed to add subscriber:", error);
    return { status: false, message: "Failed to add the subscriber." };
  }
}

/* -------------------------- Admin: subscriber CRUD ----------------------- */

export type Subscriber = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  unsubscribed: boolean;
  createdAt: string;
};

/**
 * Resend paginates contacts (max 100 per page, cursor-based). Walk every page
 * so the admin sees the whole list and gets an accurate count — the yoga list
 * is small enough that fetching it all is cheaper than partial + guessing.
 */
async function fetchAllSubscribers(): Promise<{
  subscribers: Subscriber[];
  capped: boolean;
  failed: boolean;
}> {
  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!segmentId) return { subscribers: [], capped: false, failed: false };

  const subscribers: Subscriber[] = [];
  let after: string | undefined;
  const MAX_PAGES = 100; // 100 pages * 100 = 10k contacts safety ceiling

  for (let page = 0; page < MAX_PAGES; page++) {
    const { data, error } = await resend.contacts.list(
      after ? { segmentId, limit: 100, after } : { segmentId, limit: 100 },
    );
    if (error || !data) {
      // A failure before we've read anything is a hard error worth surfacing;
      // a failure partway through still leaves a usable (if partial) list.
      return { subscribers, capped: false, failed: subscribers.length === 0 };
    }

    for (const contact of data.data) {
      subscribers.push({
        id: contact.id,
        email: contact.email,
        firstName: contact.first_name,
        lastName: contact.last_name,
        unsubscribed: contact.unsubscribed,
        createdAt: contact.created_at,
      });
    }

    if (!data.has_more || data.data.length === 0) {
      return { subscribers, capped: false, failed: false };
    }
    after = data.data[data.data.length - 1].id;
  }

  // Fell out of the loop still seeing has_more — list is larger than the cap.
  return { subscribers, capped: true, failed: false };
}

export async function listSubscribers() {
  await requireAdmin();
  try {
    const segmentId = process.env.RESEND_SEGMENT_ID;
    if (!segmentId) {
      return {
        status: false as const,
        message: "Missing RESEND_SEGMENT_ID environment variable.",
        subscribers: [] as Subscriber[],
        capped: false,
      };
    }

    const { subscribers, capped, failed } = await fetchAllSubscribers();
    if (failed) {
      return {
        status: false as const,
        message: "Couldn't reach Resend. Please try again.",
        subscribers: [] as Subscriber[],
        capped: false,
      };
    }
    // Newest first
    subscribers.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
    );
    return { status: true as const, subscribers, capped };
  } catch (error) {
    console.error("Failed to list subscribers:", error);
    return {
      status: false as const,
      message: "Failed to load subscribers.",
      subscribers: [] as Subscriber[],
      capped: false,
    };
  }
}

export async function updateSubscriber(
  data: SubscriberUpdateInputs,
): Promise<AddSubscriberResult> {
  await requireAdmin();

  const validation = NewsletterSubscriberUpdateSchema.safeParse(data);
  if (!validation.success) {
    return {
      status: false,
      message: "Please check the details and try again.",
    };
  }

  try {
    const { id, firstName, lastName, unsubscribed } = validation.data;

    // Only send the fields the caller actually provided. A blank name field is
    // an intentional clear (null); an omitted field is left untouched — that's
    // what keeps the quick unsubscribe toggle from wiping someone's name.
    const payload: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      unsubscribed?: boolean;
    } = { id };
    if (firstName !== undefined) payload.firstName = firstName.trim() || null;
    if (lastName !== undefined) payload.lastName = lastName.trim() || null;
    if (unsubscribed !== undefined) payload.unsubscribed = unsubscribed;

    const { error } = await resend.contacts.update(payload);
    if (error) {
      console.error("Failed to update subscriber:", error);
      return { status: false, message: "Resend rejected the update." };
    }
    return { status: true, message: "Subscriber updated." };
  } catch (error) {
    console.error("Failed to update subscriber:", error);
    return { status: false, message: "Failed to update the subscriber." };
  }
}

export async function deleteSubscriber(
  id: string,
): Promise<AddSubscriberResult> {
  await requireAdmin();
  if (!id) return { status: false, message: "Missing subscriber id." };

  try {
    const { error } = await resend.contacts.remove(id);
    if (error) {
      console.error("Failed to remove subscriber:", error);
      return { status: false, message: "Resend rejected the removal." };
    }
    return { status: true, message: "Subscriber removed." };
  } catch (error) {
    console.error("Failed to remove subscriber:", error);
    return { status: false, message: "Failed to remove the subscriber." };
  }
}

/* ------------------------------ Admin: CRUD ------------------------------ */

export async function getNewsletters() {
  await requireAdmin();
  try {
    await reconcileScheduledNewsletters();
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return serialize(newsletters);
  } catch (error) {
    console.error("Failed to fetch newsletters:", error);
    return [];
  }
}

export async function getNewsletterById(id: string) {
  await requireAdmin();
  try {
    const newsletter = await prisma.newsletter.findUnique({ where: { id } });
    return newsletter ? serialize(newsletter) : null;
  } catch (error) {
    console.error("Failed to fetch newsletter:", error);
    return null;
  }
}

export async function createNewsletter(data: ComposeInputs) {
  await requireAdmin();
  const validation = NewsletterComposeSchema.safeParse(data);
  if (!validation.success) {
    return { status: false, message: "Please fix the form errors." };
  }

  try {
    const newsletter = await prisma.newsletter.create({
      data: validation.data,
    });
    revalidatePath(NEWSLETTER_ADMIN_PATH);
    return { status: true, data: serialize(newsletter) };
  } catch (error) {
    console.error("Failed to create newsletter:", error);
    return { status: false, message: "Failed to save the draft." };
  }
}

export async function updateNewsletter(id: string, data: ComposeInputs) {
  await requireAdmin();
  const validation = NewsletterComposeSchema.safeParse(data);
  if (!validation.success) {
    return { status: false, message: "Please fix the form errors." };
  }

  try {
    const existing = await prisma.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return { status: false, message: "Newsletter not found." };
    }
    if (existing.status !== "DRAFT") {
      return { status: false, message: "Only drafts can be edited." };
    }

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: validation.data,
    });
    revalidatePath(NEWSLETTER_ADMIN_PATH);
    return { status: true, data: serialize(newsletter) };
  } catch (error) {
    console.error("Failed to update newsletter:", error);
    return { status: false, message: "Failed to save the draft." };
  }
}

export async function deleteNewsletter(id: string) {
  await requireAdmin();
  try {
    const existing = await prisma.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return { status: false, message: "Newsletter not found." };
    }
    if (existing.status === "SCHEDULED") {
      return {
        status: false,
        message:
          "This newsletter is queued in Resend and can't be deleted here. Cancel it in the Resend dashboard first.",
      };
    }

    await prisma.newsletter.delete({ where: { id } });
    revalidatePath(NEWSLETTER_ADMIN_PATH);
    return { status: true };
  } catch (error) {
    console.error("Failed to delete newsletter:", error);
    return { status: false, message: "Failed to delete the newsletter." };
  }
}

export async function duplicateNewsletter(id: string) {
  await requireAdmin();
  try {
    const existing = await prisma.newsletter.findUnique({ where: { id } });
    if (!existing) {
      return { status: false, message: "Newsletter not found." };
    }

    const copy = await prisma.newsletter.create({
      data: {
        subject: `${existing.subject} (copy)`,
        previewText: existing.previewText,
        content: existing.content,
      },
    });
    revalidatePath(NEWSLETTER_ADMIN_PATH);
    return { status: true, data: serialize(copy) };
  } catch (error) {
    console.error("Failed to duplicate newsletter:", error);
    return { status: false, message: "Failed to duplicate the newsletter." };
  }
}

/* ----------------------------- Admin: sending ---------------------------- */

export async function sendNewsletter(
  id: string,
  scheduledAtIso?: string,
  sectionOpts?: EventSectionOptions,
) {
  await requireAdmin();
  try {
    const { segmentId, from } = getResendConfig();

    const newsletter = await prisma.newsletter.findUnique({ where: { id } });
    if (!newsletter) {
      return { status: false, message: "Newsletter not found." };
    }
    if (newsletter.status !== "DRAFT") {
      return { status: false, message: "Only drafts can be sent." };
    }

    let scheduledAt: Date | undefined;
    if (scheduledAtIso) {
      scheduledAt = new Date(scheduledAtIso);
      if (isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
        return {
          status: false,
          message: "The scheduled time must be in the future.",
        };
      }
    }

    const sections = await buildEventSectionsHtml(sectionOpts);
    const html = renderNewsletterHtml({
      // Resend substitutes the merge tags per-recipient; we only append the
      // live event listings.
      contentHtml: `${newsletter.content}${sections}`,
      previewText: newsletter.previewText ?? undefined,
    });

    const createResult = await resend.broadcasts.create({
      segmentId,
      from,
      subject: newsletter.subject,
      previewText: newsletter.previewText ?? undefined,
      name: newsletter.subject,
      html,
    });
    if (createResult.error || !createResult.data) {
      console.error("Failed to create broadcast:", createResult.error);
      return { status: false, message: "Resend rejected the broadcast." };
    }

    const sendResult = await resend.broadcasts.send(
      createResult.data.id,
      scheduledAt ? { scheduledAt: scheduledAt.toISOString() } : undefined,
    );
    if (sendResult.error) {
      console.error("Failed to send broadcast:", sendResult.error);
      return { status: false, message: "Resend failed to send the broadcast." };
    }

    const updated = await prisma.newsletter.update({
      where: { id },
      data: {
        resendBroadcastId: createResult.data.id,
        status: scheduledAt ? "SCHEDULED" : "SENT",
        scheduledAt: scheduledAt ?? null,
        sentAt: scheduledAt ? null : new Date(),
      },
    });

    revalidatePath(NEWSLETTER_ADMIN_PATH);
    return { status: true, data: serialize(updated) };
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return {
      status: false,
      message:
        error instanceof Error && error.message.includes("environment")
          ? error.message
          : "Failed to send the newsletter.",
    };
  }
}

export async function sendTestNewsletter(
  data: ComposeInputs,
  sectionOpts?: EventSectionOptions,
) {
  await requireAdmin();
  const validation = NewsletterComposeSchema.safeParse(data);
  if (!validation.success) {
    return { status: false, message: "Please fix the form errors." };
  }

  try {
    const { from } = getResendConfig();

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return {
        status: false,
        message: "Couldn't determine your email address for the test send.",
      };
    }

    const sections = await buildEventSectionsHtml(sectionOpts);
    const html = renderNewsletterHtml({
      // The transactional API doesn't substitute merge tags, so resolve them
      // here with the admin's own details for a realistic test.
      contentHtml: `${resolveMergeTags(validation.data.content, {
        firstName: user?.firstName ?? undefined,
        lastName: user?.lastName ?? undefined,
        email,
      })}${sections}`,
      previewText: validation.data.previewText,
      unsubscribeUrl: "#",
    });

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: `[Test] ${validation.data.subject}`,
      html,
    });
    if (error) {
      console.error("Failed to send test email:", error);
      return { status: false, message: "Resend failed to send the test." };
    }

    return { status: true, message: `Test sent to ${email}` };
  } catch (error) {
    console.error("Failed to send test email:", error);
    return { status: false, message: "Failed to send the test email." };
  }
}

export async function getSubscriberCount() {
  await requireAdmin();
  try {
    const segmentId = process.env.RESEND_SEGMENT_ID;
    if (!segmentId) return null;

    const { subscribers, capped, failed } = await fetchAllSubscribers();
    if (failed) return null;
    // Count active subscribers only — unsubscribed contacts still come back
    // from Resend but shouldn't inflate the headline number.
    const count = subscribers.filter((s) => !s.unsubscribed).length;
    return { count, hasMore: capped };
  } catch (error) {
    console.error("Failed to fetch subscriber count:", error);
    return null;
  }
}

/**
 * Newsletters scheduled through Resend are sent server-side by Resend, so our
 * rows can go stale. Reconcile any past-due SCHEDULED rows against the
 * broadcast status before listing.
 */
async function reconcileScheduledNewsletters() {
  const dueNewsletters = await prisma.newsletter.findMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
  });

  for (const newsletter of dueNewsletters) {
    if (!newsletter.resendBroadcastId) continue;
    try {
      const { data } = await resend.broadcasts.get(
        newsletter.resendBroadcastId,
      );
      if (data?.status === "sent") {
        await prisma.newsletter.update({
          where: { id: newsletter.id },
          data: {
            status: "SENT",
            sentAt: data.sent_at ? new Date(data.sent_at) : new Date(),
          },
        });
      }
    } catch (error) {
      console.error(`Failed to reconcile newsletter ${newsletter.id}:`, error);
    }
  }
}

/* ------------------------- Admin: compose helpers ------------------------ */

const NEWSLETTER_SITE_URL = "https://www.aaroncurtisyoga.com";
const COBALT = "#2749e0";
const DESCRIPTION_MAX_CHARS = 160;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Trim to a word boundary near the limit and add an ellipsis.
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

function eventListItemHtml(
  event: EventWithLocationAndCategory,
  {
    withDescription = false,
    withCta = false,
  }: { withDescription?: boolean; withCta?: boolean } = {},
): string {
  const { weekdayShort, monthShort, dayNumber, timeOnly } = formatDateTime(
    event.startDateTime,
  );
  const when = `${weekdayShort}, ${monthShort} ${dayNumber} · ${timeOnly}`;
  const location = event.location?.name ? ` · ${event.location.name}` : "";
  const href =
    event.isHostedExternally && event.externalRegistrationUrl
      ? event.externalRegistrationUrl
      : `${NEWSLETTER_SITE_URL}/events/${event.id}`;

  // Descriptions are TipTap HTML on the site — flatten, truncate, re-escape
  // (richTextToPlainText decodes entities back to raw <, >, & characters).
  let description = "";
  if (withDescription) {
    const text = richTextToPlainText(event.description);
    if (text) {
      description = `<span style="display:block; margin-top:3px; color:#52525b; font-size:14px; font-style:italic; line-height:1.5;">${escapeHtml(
        truncate(text, DESCRIPTION_MAX_CHARS),
      )}</span>`;
    }
  }

  // A cobalt button so featured events get a clear call to action, not just a
  // linked title. Links to external registration when hosted elsewhere.
  const cta = withCta
    ? `<span style="display:block; margin-top:8px; text-align:center;"><a href="${href}" style="display:inline-block; background-color:${COBALT}; color:#ffffff; text-decoration:none; font-weight:700; font-size:13px; letter-spacing:0.02em; padding:8px 16px; border-radius:4px;">Reserve your spot →</a></span>`
    : "";

  const liAttr = description || cta ? ' style="margin-bottom:18px;"' : "";
  return `<li${liAttr}><strong><a href="${href}">${event.title}</a></strong>, ${when}${location}${description}${cta}</li>`;
}

/** Monday (ET) of the week containing `now`, as a YYYY-MM-DD key. */
function getEtMondayIso(now: Date): string {
  const et = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const day = et.getDay(); // 0 = Sun … 6 = Sat
  const diff = day === 0 ? -6 : 1 - day;
  et.setDate(et.getDate() + diff);
  et.setHours(0, 0, 0, 0);
  return toDateKey(et);
}

/**
 * Builds the "Upcoming" (featured events) and "Classes This Week" (this week's
 * remaining classes) blocks appended after the writer's message — mirroring the
 * homepage's two sections. Returns "" when both are empty so the newsletter
 * simply omits them. Kept out of the saved draft so duplicating a newsletter
 * never bakes in a stale snapshot.
 */
async function buildEventSectionsHtml({
  includeUpcoming = true,
  includeClasses = true,
  includeDescriptions = false,
}: EventSectionOptions = {}): Promise<string> {
  if (!includeUpcoming && !includeClasses) return "";
  try {
    const now = new Date();
    const sections: string[] = [];

    if (includeUpcoming) {
      const upcoming = await getFeaturedEvents(5).catch(() => []);
      if (upcoming.length > 0) {
        sections.push(
          `<h2>Upcoming</h2><ul>${upcoming
            .map((event) =>
              eventListItemHtml(event, {
                withDescription: includeDescriptions,
                withCta: true,
              }),
            )
            .join("")}</ul>`,
        );
      }
    }

    if (includeClasses) {
      let weekEvents: EventWithLocationAndCategory[] = [];
      try {
        weekEvents = await getEventsByWeek(getEtMondayIso(now));
      } catch {
        weekEvents = [];
      }
      // Only classes still to come this week — past ones are noise in an email.
      const classesThisWeek = weekEvents.filter(
        (event) => new Date(event.startDateTime) >= now,
      );
      if (classesThisWeek.length > 0) {
        sections.push(
          `<h2>Classes This Week</h2><ul>${classesThisWeek
            .map((event) => eventListItemHtml(event))
            .join("")}</ul>`,
        );
      }
    }

    if (sections.length === 0) return "";
    // A divider separates the writer's message from the auto-added listings.
    return `<hr>${sections.join("")}`;
  } catch (error) {
    console.error("Failed to build newsletter event sections:", error);
    return "";
  }
}

/** Exposed for the composer preview + sent view so they match what's sent. */
export async function getNewsletterEventSectionsHtml(
  opts?: EventSectionOptions,
): Promise<string> {
  await requireAdmin();
  return buildEventSectionsHtml(opts);
}
