import { NextResponse } from "next/server";
import prisma from "@/app/_lib/prisma";
import resend from "@/app/_lib/resend";

// Newsletter engagement events from Resend. Each event is deduped per
// (newsletter, recipient email id, type) via the NewsletterEmailEvent ledger,
// so the counters track unique recipients — a subscriber opening the same
// email five times counts once.
const COUNTER_BY_EVENT: Record<
  string,
  | "deliveredCount"
  | "openedCount"
  | "clickedCount"
  | "bouncedCount"
  | "complainedCount"
> = {
  "email.delivered": "deliveredCount",
  "email.opened": "openedCount",
  "email.clicked": "clickedCount",
  "email.bounced": "bouncedCount",
  // Spam complaints — the one signal that threatens future deliverability.
  // Needs the event enabled on the webhook in the Resend dashboard.
  "email.complained": "complainedCount",
};

export async function POST(req: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing RESEND_WEBHOOK_SECRET environment variable");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // The signature is computed over the raw bytes — read the body as text
  // before any JSON parsing.
  const payload = await req.text();
  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");
  if (!id || !timestamp || !signature) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret,
    });
  } catch (error) {
    console.error("Resend webhook verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const counter = COUNTER_BY_EVENT[event.type];
  if (!counter) {
    return NextResponse.json({ received: true });
  }

  // Only broadcast (newsletter) emails carry a broadcast_id; test sends and
  // other transactional mail self-exclude here.
  const data = event.data as {
    broadcast_id?: string;
    email_id?: string;
    to?: string | string[];
    click?: { link?: string };
  };
  if (!data.broadcast_id || !data.email_id) {
    return NextResponse.json({ received: true });
  }

  // Click events also record WHICH link, so the admin can see per-link counts.
  // Capped well under Postgres's ~2700-byte btree index-row limit even for
  // fully multibyte URLs — an overflowing insert would roll back the whole
  // transaction, counter bump included, on every webhook retry.
  const clickedLink =
    event.type === "email.clicked"
      ? data.click?.link?.slice(0, 500)
      : undefined;

  // Bounces and complaints record WHO, so a typo'd address from an in-person
  // signup is fixable instead of a mystery count.
  const recipient =
    event.type === "email.bounced" || event.type === "email.complained"
      ? (Array.isArray(data.to) ? data.to[0] : data.to)
          ?.slice(0, 320)
          .toLowerCase()
      : undefined;

  try {
    const newsletter = await prisma.newsletter.findFirst({
      where: { resendBroadcastId: data.broadcast_id },
      select: { id: true },
    });
    if (!newsletter) {
      return NextResponse.json({ received: true });
    }

    // Ledger insert + counter bump commit together: if the increment fails,
    // the ledger row rolls back too, so Resend's retry can count the event
    // instead of hitting the dedup constraint and skipping it forever.
    await prisma.$transaction(async (tx) => {
      // The link-less row is the per-recipient dedup ledger (one per
      // newsletter/email/type) and is what drives the unique-recipient
      // counters — clicking a second, different link must not bump the count.
      const inserted = await tx.newsletterEmailEvent.createMany({
        data: [
          {
            newsletterId: newsletter.id,
            emailId: data.email_id!,
            type: event.type,
            recipient,
          },
        ],
        skipDuplicates: true,
      });
      if (inserted.count > 0) {
        await tx.newsletter.update({
          where: { id: newsletter.id },
          data: { [counter]: { increment: 1 } },
        });
      }
      // Clicks additionally get one row per distinct link per recipient,
      // powering the "Top clicked links" view (unique clickers per URL).
      if (clickedLink) {
        await tx.newsletterEmailEvent.createMany({
          data: [
            {
              newsletterId: newsletter.id,
              emailId: data.email_id!,
              type: event.type,
              link: clickedLink,
            },
          ],
          skipDuplicates: true,
        });
      }
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Failed to record Resend webhook event:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
