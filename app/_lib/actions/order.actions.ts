"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import prisma from "@/app/_lib/prisma";
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/app/_lib/types";
import { handleError } from "@/app/_lib/utils";
import {
  calculateSkipAmount,
  calculateTotalPages,
} from "@/app/_lib/utils/pagination";
import { buildOrderSearchConditions } from "@/app/_lib/utils/query-builders";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const price = order.isFree ? 0 : Number(order.price) * 100;

  let checkoutSession: Stripe.Checkout.Session;

  // Metadata for order tracking
  const metadata: { [key: string]: string } = {
    buyerId: order.buyerId,
    type: order.type,
    // Events include eventId, private sessions don't
    ...(order.eventId && { eventId: order.eventId }),
  };

  try {
    checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.name,
            },
          },
          quantity: 1,
        },
      ],
      metadata,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/account`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });
  } catch (error) {
    handleError(error);
    throw error;
  }
  redirect(checkoutSession.url as string);
};

export const createOrder = async (order: CreateOrderParams) => {
  const data: Prisma.OrderCreateInput = {
    buyer: { connect: { id: order.buyerId } },
    createdAt: order.createdAt,
    stripeId: order.stripeId,
    totalAmount: order.totalAmount,
    type: order.type,
    ...(order.eventId && { event: { connect: { id: order.eventId } } }),
  };

  try {
    return await prisma.order.create({
      data,
    });
  } catch (error) {
    handleError(error);
    return null;
  }
};

export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    const whereConditions = buildOrderSearchConditions(searchString, eventId);

    return await prisma.order.findMany({
      where: whereConditions,
      include: {
        event: {
          select: { title: true },
        },
        buyer: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getOrdersByUser({
  userId,
  limit = 10,
  page,
}: GetOrdersByUserParams) {
  try {
    const skipAmount = calculateSkipAmount(Number(page), limit);
    const whereConditions = { buyer: { id: userId } };

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
        skip: skipAmount,
        take: limit,
        include: { event: { select: { title: true, id: true } } },
      }),
      prisma.order.count({
        where: whereConditions,
      }),
    ]);

    return {
      data: orders,
      totalPages: calculateTotalPages(totalOrders, limit),
    };
  } catch (error) {
    handleError(error);
    return {
      data: [],
      totalPages: 0,
    };
  }
}
