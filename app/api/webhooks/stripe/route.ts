import { OrderType } from "@prisma/client";
import { NextResponse } from "next/server";
import stripe from "stripe";
import { handleError } from "@/_lib/utils";
import { createOrder } from "@/_lib/actions/order.actions";

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let stripeEvent: stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    handleError("Stripe webhook error", err);
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  // Get the ID and type
  const stripeEventType = stripeEvent.type;

  // CREATE
  if (stripeEventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = stripeEvent.data.object;

    const order = {
      buyerId: metadata?.buyerId || "",
      createdAt: new Date(),
      stripeId: id,
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      type: (metadata?.type as OrderType) || OrderType.EVENT,
    };

    if (metadata.eventId) {
      order["eventId"] = metadata.eventId;
    }

    try {
      const newOrder = await createOrder(order);
      return NextResponse.json({ message: "OK", order: newOrder });
    } catch (error) {
      handleError("Stripe Webhook Creating order", error);
      return NextResponse.json({
        message: "Error creating order",
        error: error.message,
      });
    }
  }

  return new Response("", { status: 200 });
}
