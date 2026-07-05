"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { renderNewsletterHtml } from "@/app/_lib/email/newsletter-template";
import prisma from "@/app/_lib/prisma";
import resend from "@/app/_lib/resend";
import {
  NewsletterComposeSchema,
  NewsletterFormSchema,
  NewsletterSubscriberSchema,
} from "@/app/_lib/schema";
import { serialize } from "@/app/_lib/utils/serialize";

type SignupInputs = z.infer<typeof NewsletterFormSchema>;
type SubscriberInputs = z.infer<typeof NewsletterSubscriberSchema>;
type ComposeInputs = z.infer<typeof NewsletterComposeSchema>;

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

export async function sendNewsletter(id: string, scheduledAtIso?: string) {
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

    const html = renderNewsletterHtml({
      contentHtml: newsletter.content,
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

export async function sendTestNewsletter(data: ComposeInputs) {
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

    const html = renderNewsletterHtml({
      contentHtml: validation.data.content,
      previewText: validation.data.previewText,
      // No per-recipient substitution on the transactional API
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

    const { data, error } = await resend.contacts.list({
      segmentId,
      limit: 100,
    });
    if (error || !data) return null;

    // Good enough for a small list; shows "100+" once pagination kicks in
    return { count: data.data.length, hasMore: data.has_more };
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

export async function getUpcomingEventsForNewsletter() {
  await requireAdmin();
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true, startDateTime: { gte: new Date() } },
      orderBy: { startDateTime: "asc" },
      take: 8,
      include: { location: true },
    });
    return serialize(events);
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
}
