import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs";

import Collection from "@/components/events/Collection";
import { IOrder } from "@/lib/mongodb/database/models/order.model";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { SearchParamProps } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};
const ProfilePage = async ({ searchParams }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.metadata?.userId as string;
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const orders = await getOrdersByUser({ userId, page: ordersPage });
  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];

  return (
    <section
      className={
        "grid grow w-full md:min-h-[calc(100dvh-64px)] max-w-screen-2xl " +
        "md:grid-cols-[1fr,1fr] 11rem)] lg:mx-auto"
      }
    >
      <div>
        <h3>Payment History</h3>
        {/* date, payment type, amount, receipt number */}
      </div>
    </section>
  );
};

export default ProfilePage;
