import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { sessionClaims } = await auth();

    if (!sessionClaims?.metadata?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, packageName, sessionType, sessionCount, pricePerSession } =
      await request.json();

    // Check required fields
    if (!amount || !sessionType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        buyerId: sessionClaims.metadata.userId,
        packageName:
          packageName || `${sessionCount || 1} ${sessionType} Sessions`,
        sessionType,
        sessionCount: sessionCount?.toString() || "1",
        pricePerSession: pricePerSession?.toString() || amount.toString(),
        type: "PRIVATE_SESSION",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
