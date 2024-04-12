import { NextResponse } from "next/server";
import stripe from "stripe";
import { createOrder } from "@/lib/actions/order.actions";
import { handleError } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    handleError("Stripe webhook error", err);
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  // Get the ID and type
  const eventType = event.type;

  // CREATE
  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata, status } = event.data.object;

    const order = {
      buyerId: metadata?.buyerId || "",
      createdAt: new Date(),
      eventId: metadata?.eventId || "",
      status: status || "",
      stripeId: id,
      totalAmount: amount_total ? (amount_total / 100).toString() : "0",
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

  return new Response("", { status: 200 });
}
