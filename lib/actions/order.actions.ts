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
    return await prisma.order.create({
      data: {
        ...order,
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
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
      orderBy: { createdAt: "asc" },
      skip: skipAmount,
      take: limit,
      select: { event: { select: { title: true, id: true } } },
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
