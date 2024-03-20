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
const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.metadata?.userId as string;
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const orders = await getOrdersByUser({ userId, page: ordersPage });
  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
  return (
    <>
      <section>
        <div>
          <h3>My Tickets</h3>
          <Link href="/#events">Explore More Events</Link>
        </div>
      </section>
      <section>
        {/* Display in table instead... */}
        <Collection
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="Take a look at upcoming events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
