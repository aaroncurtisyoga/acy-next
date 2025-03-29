import { FC } from "react";
import { auth } from "@clerk/nextjs/server";
import { Event, Order } from "@prisma/client";
import PurchaseHistoryTable from "@/app/(root)/account/_components/PurchaseHistoryTable";
import { getOrdersByUser } from "@/app/_lib/actions/order.actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

type OrderWithEventFields = Order & {
  event: Pick<Event, "title" | "id">;
};

export type OrderResponse = {
  data: OrderWithEventFields[];
  totalPages: number;
};

interface AccountPageProps {
  searchParams: Promise<{
    ordersPage?: string;
  }>;
}

const AccountPage: FC<AccountPageProps> = async ({ searchParams }) => {
  // Await the auth function to get the session claims
  const authResult = await auth();
  const userId = authResult?.sessionClaims?.metadata?.userId as string;

  // Await the searchParams promise before accessing its properties
  const resolvedParams = await searchParams;
  const ordersPage = Number(resolvedParams?.ordersPage) || 1;

  const orders: OrderResponse = await getOrdersByUser({
    userId,
    page: ordersPage,
  });

  return (
    <section className={"wrapper py-5 md:py-10"}>
      <h3 className={"text-xl mb-5"}>Purchase History</h3>
      <PurchaseHistoryTable orders={orders} />
    </section>
  );
};

export default AccountPage;
