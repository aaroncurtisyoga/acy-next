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
  searchParams: {
    ordersPage: string;
  };
}

const AccountPage: FC<AccountPageProps> = async ({ searchParams }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.metadata?.userId as string;
  const ordersPage = Number(searchParams?.ordersPage) || 1;
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
