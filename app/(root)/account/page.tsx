import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import EventHistoryTable from "@/components/account/EventHistoryTable";

export const metadata: Metadata = {
  title: "Account",
};

const AccountPage = async ({ searchParams }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.metadata?.userId as string;
  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const orders = await getOrdersByUser({ userId, page: ordersPage });

  return (
    <section className={"wrapper py-5 md:py-10"}>
      <h3 className={"text-xl mb-5"}>Event Purchase History</h3>
      <EventHistoryTable orders={orders} />
    </section>
  );
};

export default AccountPage;
