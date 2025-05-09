"use server";

import { redirect } from "next/navigation";
import { Prisma, PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/app/_lib/types";
import { handleError } from "@/app/_lib/utils";

const prisma = new PrismaClient();

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const price = order.isFree ? 0 : Number(order.price) * 100;

  let checkoutSession: Stripe.Checkout.Session;

  // Metadata: Useful for storing additional info for the order
  const metadata: { [key: string]: string } = {
    buyerId: order.buyerId,
    type: order.type,
    // Only Events will have an eventId. Private sessions won't have an eventId
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
  }
};

export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    return await prisma.order.findMany({
      where: {
        AND: [
          { event: { id: eventId } },
          {
            OR: [
              {
                buyer: {
                  firstName: { contains: searchString, mode: "insensitive" },
                },
              },
              {
                buyer: {
                  lastName: { contains: searchString, mode: "insensitive" },
                },
              },
            ],
          },
        ],
      },
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
  }
}

export async function getOrdersByUser({
  userId,
  limit = 10,
  page,
}: GetOrdersByUserParams) {
  try {
    const skipAmount = (Number(page) - 1) * limit;
    const orders = await prisma.order.findMany({
      where: { buyer: { id: userId } },
      orderBy: { createdAt: "desc" },
      skip: skipAmount,
      take: limit,
      include: { event: { select: { title: true, id: true } } },
    });

    const totalOrders = await prisma.order.count({
      where: { buyer: { id: userId } },
    });

    return {
      data: orders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
