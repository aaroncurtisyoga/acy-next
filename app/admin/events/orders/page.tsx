import { getOrdersByEvent } from "@/app/_lib/actions/order.actions";
import OrdersTable from "@/app/admin/events/orders/_components/OrdersTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

interface OrdersPageProps {
  searchParams: Promise<{ eventId?: string; query?: string }>;
}

const Orders = async ({ searchParams }: OrdersPageProps) => {
  const params = await searchParams;
  const eventId = (params?.eventId as string) || "";
  const searchText = (params?.query as string) || "";
  const orders = await getOrdersByEvent({ eventId, searchString: searchText });

  return (
    <section className={"wrapper py-5 md:py-10 "}>
      <h3 className={"text-xl mb-5 text-foreground"}>Orders</h3>
      <OrdersTable orders={orders} />
    </section>
  );
};

export default Orders;
