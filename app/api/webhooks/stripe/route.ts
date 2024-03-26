import { NextResponse } from "next/server";
import stripe from "stripe";
import { createOrder } from "@/lib/actions/order.actions";

export async function POST(request: Request) {
  console.log("Stripe Webhook: Starting Post");
  const body = await request.text();

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event;
  console.log("Stripe Webhook: Event is", event);

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("Stripe Webhook: try constructEvent");
    console.log("Stripe Webhook: event is", event);
  } catch (err) {
    console.log("Stripe Webhook: catch constructEvent");
    console.log("Stripe Webhook: err is", err);
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  // Get the ID and type
  const eventType = event.type;

  // CREATE
  if (eventType === "checkout.session.completed") {
    console.log(
      "Stripe Webhook: Create event type is checkout.session.completed",
    );
    const { id, amount_total, metadata } = event.data.object;

    const order = {
      stripeId: id,
      eventId: metadata?.eventId || "",
      buyerId: metadata?.buyerId || "",
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
      createdAt: new Date(),
    };
    console.log("Stripe Webhook: order is", order);

    const newOrder = await createOrder(order);
    console.log("Stripe Webhook: newOrder is", newOrder);
    return NextResponse.json({ message: "OK", order: newOrder });
  }

  return new Response("", { status: 200 });
}
