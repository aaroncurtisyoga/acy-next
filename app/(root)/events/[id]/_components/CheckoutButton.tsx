"use client";

import { FC, FormEvent, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@nextui-org/react";
import { Event } from "@prisma/client";
import { checkoutOrder } from "@/_lib/actions/order.actions";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type CheckoutProps = { event: Event; userId: string };

const CheckoutButton: FC<CheckoutProps> = ({ event, userId }) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready.",
      );
    }
  }, []);

  const onCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const order = {
      buyerId: userId,
      eventId: event.id,
      isFree: event.isFree,
      name: event.title,
      price: event.price,
    };

    await checkoutOrder(order);
  };

  return (
    <form onSubmit={(e) => onCheckout(e)} method="post">
      <Button type="submit" fullWidth={true} color={"primary"}>
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </form>
  );
};

export default CheckoutButton;
