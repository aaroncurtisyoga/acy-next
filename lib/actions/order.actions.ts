"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";
import { handleError } from "../utils";

const prisma = new PrismaClient();
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/account`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        ...order,
        event: order.eventId,
        userId: order.buyerId,
      },
    });
    return newOrder;
  } catch (error) {
    handleError(error);
  }
};

export async function getOrdersByEvent({
  searchString,
  eventId,
}: GetOrdersByEventParams) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        AND: [
          { event: eventId },
          {
            OR: [
              {
                "buyer.firstName": {
                  contains: searchString,
                  mode: "insensitive",
                },
              },
              {
                "buyer.lastName": {
                  contains: searchString,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
        include: {
          event: true,
          buyer: true,
        },
      },
    });
    return orders;
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
      where: { userId: userId },
      orderBy: { createdAt: "asc" },
      skip: skipAmount,
      take: limit,
      include: { event: { include: { category: true } } },
    });

    const totalOrders = await prisma.order.count({
      where: { userId: userId },
    });

    return {
      data: orders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
