import { NextResponse } from "next/server";
import { OrderType } from "@prisma/client";
import stripe from "stripe";
import { createOrder } from "@/app/_lib/actions/order.actions";
import { handleError } from "@/app/_lib/utils";

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

  // Get event type
  const stripeEventType = stripeEvent.type;

  // Handle checkout completion
  if (stripeEventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = stripeEvent.data.object;

    const order = {
      buyerId: metadata?.buyerId || "",
      createdAt: new Date(),
      stripeId: id,
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      type: (metadata?.type as OrderType) || OrderType.EVENT,
      ...(metadata?.eventId && { eventId: metadata.eventId }),
    };

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

  // Handle payment success
  if (stripeEventType === "payment_intent.succeeded") {
    const { id, amount, metadata } = stripeEvent.data.object;

    const order = {
      buyerId: metadata?.buyerId || "",
      createdAt: new Date(),
      stripeId: id,
      totalAmount: amount ? (amount / 100).toString() : "0",
      type: (metadata?.type as OrderType) || OrderType.PRIVATE_SESSION,
    };

    try {
      const newOrder = await createOrder(order);
      return NextResponse.json({ message: "OK", order: newOrder });
    } catch (error) {
      handleError("Stripe Webhook Creating order from payment intent", error);
      return NextResponse.json({
        message: "Error creating order from payment intent",
        error: error.message,
      });
    }
  }

  return new Response("", { status: 200 });
}
